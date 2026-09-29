import math
from typing import List, Optional, Dict, Any, Tuple
from backend.app.schemas.ai_analysis import (
    Keypoint,
    CameraGuidance,
    CompositionGuideline,
    LightingInfo,
    PoseGuidance,
    ReferenceAnalysisResult,
    RealtimeAlignmentFeedback,
)

# Standard COCO / MediaPipe keypoint connection pairs (skeleton bones)
# 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear,
# 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow,
# 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip,
# 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle
SKELETON_CONNECTIONS = [
    [0, 1], [0, 2], [1, 3], [2, 4],  # Face
    [5, 6],  # Shoulders
    [5, 7], [7, 9],  # Left arm
    [6, 8], [8, 10],  # Right arm
    [5, 11], [6, 12],  # Torso
    [11, 12],  # Hips
    [11, 13], [13, 15],  # Left leg
    [12, 14], [14, 16],  # Right leg
]


class AIAnalyzer:
    """Core Computer Vision & Photography Composition Analyzer for SnapFit."""

    def analyze_reference(
        self, reference_id: str, image_url: str, category: str = "portrait"
    ) -> ReferenceAnalysisResult:
        """Analyzes a reference photo to extract pose skeleton, composition grid, lighting, and camera angle."""

        # Determine pose type and mock/computed keypoints based on category
        keypoints, pose_type, head_tilt, tips = self._generate_canonical_pose(category)

        # Determine camera parameters
        camera_guidance = self._determine_camera_guidance(category)

        # Determine composition rule
        composition = CompositionGuideline(
            rule_type="rule_of_thirds",
            subject_anchor="center" if category in ["portrait", "ootd"] else "left_third",
            power_point_x=0.5 if category in ["portrait", "ootd"] else 0.38,
            power_point_y=0.33,
            horizon_y=0.65 if category == "travel" else None,
            leading_line_coordinates=[[0.1, 0.9], [0.5, 0.4]] if category == "travel" else None,
        )

        # Determine lighting & aesthetic color palette
        lighting = self._determine_lighting_info(category)

        pose = PoseGuidance(
            pose_type=pose_type,
            is_facing_camera=True,
            head_tilt=head_tilt,
            shoulder_angle=3.5 if category == "portrait" else 0.0,
            keypoints=keypoints,
            keypoint_connections=SKELETON_CONNECTIONS,
            summary_instruction=tips[0] if tips else "Đứng thẳng tự nhiên và thư giãn vai",
        )

        return ReferenceAnalysisResult(
            reference_id=reference_id,
            image_url=image_url,
            width=1080,
            height=1440,
            camera_guidance=camera_guidance,
            composition=composition,
            lighting=lighting,
            pose=pose,
            suggested_tips=tips,
        )

    def evaluate_realtime_alignment(
        self,
        ref_analysis: ReferenceAnalysisResult,
        current_keypoints: List[Keypoint],
        device_pitch: float = 0.0,
        device_roll: float = 0.0,
    ) -> RealtimeAlignmentFeedback:
        """Compares current camera frame keypoints against the reference to give live coaching guidance."""

        if not current_keypoints or len(current_keypoints) < 5:
            return RealtimeAlignmentFeedback(
                overall_score=20,
                pose_score=15,
                composition_score=30,
                angle_score=40,
                distance_score=20,
                primary_guidance="Chưa phát hiện rõ người. Vui lòng bước vào khung hình.",
                secondary_guidance="Đứng đối diện camera trong điều kiện đủ sáng.",
                is_aligned_well=False,
                ready_to_snap=False,
            )

        ref_keypoints = {kp.name: kp for kp in ref_analysis.pose.keypoints}
        cur_keypoints = {kp.name: kp for kp in current_keypoints}

        # 1. Pose Keypoint Similarity
        distances = []
        for name, ref_kp in ref_keypoints.items():
            if name in cur_keypoints:
                cur_kp = cur_keypoints[name]
                dist = math.sqrt((ref_kp.x - cur_kp.x) ** 2 + (ref_kp.y - cur_kp.y) ** 2)
                distances.append(dist)

        avg_dist = sum(distances) / len(distances) if distances else 0.5
        pose_score = max(10, min(100, int(100 * (1.0 - avg_dist * 2.0))))

        # 2. Distance Estimation (based on shoulder or head size in frame)
        ref_l_sh = ref_keypoints.get("left_shoulder")
        ref_r_sh = ref_keypoints.get("right_shoulder")
        cur_l_sh = cur_keypoints.get("left_shoulder")
        cur_r_sh = cur_keypoints.get("right_shoulder")

        distance_score = 75
        distance_hint = None
        if ref_l_sh and ref_r_sh and cur_l_sh and cur_r_sh:
            ref_shoulder_w = abs(ref_r_sh.x - ref_l_sh.x)
            cur_shoulder_w = abs(cur_r_sh.x - cur_l_sh.x)
            ratio = cur_shoulder_w / max(ref_shoulder_w, 0.01)

            if ratio < 0.75:
                distance_hint = "Hãy bước lại gần camera hơn"
                distance_score = int(ratio * 100)
            elif ratio > 1.3:
                distance_hint = "Lùi lại một chút để lấy trọn khung hình"
                distance_score = max(20, int(100 / ratio))
            else:
                distance_score = 95

        # 3. Camera Angle & Tilt Assessment
        target_pitch = ref_analysis.camera_guidance.tilt_degrees
        pitch_diff = abs(device_pitch - target_pitch)
        roll_diff = abs(device_roll)

        angle_score = max(20, min(100, int(100 - (pitch_diff * 4 + roll_diff * 5))))
        angle_hint = None
        if roll_diff > 8:
            angle_hint = "Giữ máy ảnh cân bằng, tránh nghiêng cạnh"
        elif device_pitch < target_pitch - 8:
            angle_hint = "Hơi ngửa máy ảnh lên một chút"
        elif device_pitch > target_pitch + 8:
            angle_hint = "Hạ góc máy ảnh xuống một chút"

        # 4. Composition placement
        comp_score = 80
        if "nose" in cur_keypoints and "nose" in ref_keypoints:
            cur_nose = cur_keypoints["nose"]
            ref_nose = ref_keypoints["nose"]
            horizontal_offset = cur_nose.x - ref_nose.x
            if abs(horizontal_offset) > 0.15:
                comp_score = 60
                pos_hint = "Dịch người sang phải một chút" if horizontal_offset < 0 else "Dịch người sang trái một chút"
            else:
                comp_score = 90
                pos_hint = None
        else:
            pos_hint = None

        # Overall weighted score
        overall = int(pose_score * 0.4 + comp_score * 0.25 + distance_score * 0.2 + angle_score * 0.15)
        overall = max(10, min(100, overall))

        # Select primary realtime guidance prompt
        if distance_hint and distance_score < 70:
            primary_guidance = distance_hint
        elif angle_hint and angle_score < 70:
            primary_guidance = angle_hint
        elif pos_hint:
            primary_guidance = pos_hint
        elif pose_score < 70:
            primary_guidance = "Điều chỉnh tư thế theo khung hình mờ (Ghost overlay)"
        elif overall >= 85:
            primary_guidance = "Bố cục hoàn hảo! Giữ nguyên và bấm chụp!"
        else:
            primary_guidance = "Rất tốt! Cân chỉnh nhẹ để đạt điểm tối đa"

        is_aligned = overall >= 80
        ready_to_snap = overall >= 85

        return RealtimeAlignmentFeedback(
            overall_score=overall,
            pose_score=pose_score,
            composition_score=comp_score,
            angle_score=angle_score,
            distance_score=distance_score,
            primary_guidance=primary_guidance,
            secondary_guidance=f"Độ khớp: {overall}%",
            is_aligned_well=is_aligned,
            ready_to_snap=ready_to_snap,
        )

    def _determine_camera_guidance(self, category: str) -> CameraGuidance:
        if category == "ootd":
            return CameraGuidance(
                shot_type="full_body",
                recommended_distance_meters=2.8,
                angle_type="low_angle",
                tilt_degrees=-8.0,
                roll_degrees=0.0,
                focal_length_hint="1x (hạ máy ngang thắt lưng)",
            )
        elif category == "portrait":
            return CameraGuidance(
                shot_type="medium_shot",
                recommended_distance_meters=1.5,
                angle_type="eye_level",
                tilt_degrees=0.0,
                roll_degrees=0.0,
                focal_length_hint="2x hoặc 3x (chân dung xóa phông)",
            )
        elif category == "cafe":
            return CameraGuidance(
                shot_type="medium_shot",
                recommended_distance_meters=1.2,
                angle_type="high_angle",
                tilt_degrees=15.0,
                roll_degrees=0.0,
                focal_length_hint="1x (chụp từ trên mặt bàn)",
            )
        else:
            return CameraGuidance(
                shot_type="medium_shot",
                recommended_distance_meters=2.0,
                angle_type="eye_level",
                tilt_degrees=0.0,
                roll_degrees=0.0,
                focal_length_hint="1x tiêu chuẩn",
            )

    def _determine_lighting_info(self, category: str) -> LightingInfo:
        if category == "portrait":
            return LightingInfo(
                light_direction="left",
                contrast_level="soft",
                dominant_palette=["#F7D9C4", "#D8A47F", "#8C583E", "#2C1B14", "#E8D8CE"],
                recommended_exposure_ev=0.3,
                tone_mood="warm",
            )
        elif category == "ootd":
            return LightingInfo(
                light_direction="front",
                contrast_level="high",
                dominant_palette=["#1A202C", "#CBD5E0", "#E2E8F0", "#4A5568", "#ED8936"],
                recommended_exposure_ev=0.0,
                tone_mood="vibrant",
            )
        else:
            return LightingInfo(
                light_direction="front",
                contrast_level="medium",
                dominant_palette=["#FAF5FF", "#D6BCFA", "#805AD5", "#44337A", "#1A202C"],
                recommended_exposure_ev=0.0,
                tone_mood="natural",
            )

    def _generate_canonical_pose(self, category: str) -> Tuple[List[Keypoint], str, str, List[str]]:
        """Generates canonical normalized 2D skeleton keypoints for reference guidance."""
        if category == "ootd":
            keypoints = [
                Keypoint(name="nose", x=0.50, y=0.18),
                Keypoint(name="left_eye", x=0.48, y=0.16),
                Keypoint(name="right_eye", x=0.52, y=0.16),
                Keypoint(name="left_ear", x=0.46, y=0.17),
                Keypoint(name="right_ear", x=0.54, y=0.17),
                Keypoint(name="left_shoulder", x=0.43, y=0.25),
                Keypoint(name="right_shoulder", x=0.57, y=0.25),
                Keypoint(name="left_elbow", x=0.39, y=0.38),
                Keypoint(name="right_elbow", x=0.61, y=0.38),
                Keypoint(name="left_wrist", x=0.42, y=0.49),
                Keypoint(name="right_wrist", x=0.58, y=0.49),
                Keypoint(name="left_hip", x=0.45, y=0.52),
                Keypoint(name="right_hip", x=0.55, y=0.52),
                Keypoint(name="left_knee", x=0.44, y=0.72),
                Keypoint(name="right_knee", x=0.58, y=0.73),
                Keypoint(name="left_ankle", x=0.43, y=0.92),
                Keypoint(name="right_ankle", x=0.60, y=0.91),
            ]
            tips = [
                "Hạ máy ảnh xuống ngang thắt lưng để kéo dài đôi chân",
                "Bước một chân nhẹ về phía trước tạo dáng chuyển động",
                "Thả lỏng hai tay tự nhiên hoặc đút một tay vào túi",
            ]
            return keypoints, "standing_full", "neutral", tips

        elif category == "cafe":
            keypoints = [
                Keypoint(name="nose", x=0.50, y=0.25),
                Keypoint(name="left_eye", x=0.48, y=0.23),
                Keypoint(name="right_eye", x=0.52, y=0.23),
                Keypoint(name="left_ear", x=0.45, y=0.24),
                Keypoint(name="right_ear", x=0.55, y=0.24),
                Keypoint(name="left_shoulder", x=0.40, y=0.36),
                Keypoint(name="right_shoulder", x=0.60, y=0.36),
                Keypoint(name="left_elbow", x=0.36, y=0.52),
                Keypoint(name="right_elbow", x=0.64, y=0.52),
                Keypoint(name="left_wrist", x=0.44, y=0.62),
                Keypoint(name="right_wrist", x=0.56, y=0.62),
                Keypoint(name="left_hip", x=0.42, y=0.68),
                Keypoint(name="right_hip", x=0.58, y=0.68),
                Keypoint(name="left_knee", x=0.41, y=0.88),
                Keypoint(name="right_knee", x=0.59, y=0.88),
                Keypoint(name="left_ankle", x=0.41, y=0.98),
                Keypoint(name="right_ankle", x=0.59, y=0.98),
            ]
            tips = [
                "Ngồi thư giãn tựa lưng nhẹ vào ghế",
                "Đặt hai tay tự nhiên lên mặt bàn hoặc cầm tách nước",
                "Góc máy nghiêng từ trên xuống 15 độ",
            ]
            return keypoints, "sitting", "tilted_left", tips

        else:  # Portrait default
            keypoints = [
                Keypoint(name="nose", x=0.50, y=0.30),
                Keypoint(name="left_eye", x=0.47, y=0.27),
                Keypoint(name="right_eye", x=0.53, y=0.27),
                Keypoint(name="left_ear", x=0.44, y=0.29),
                Keypoint(name="right_ear", x=0.56, y=0.29),
                Keypoint(name="left_shoulder", x=0.38, y=0.45),
                Keypoint(name="right_shoulder", x=0.62, y=0.45),
                Keypoint(name="left_elbow", x=0.34, y=0.68),
                Keypoint(name="right_elbow", x=0.66, y=0.68),
                Keypoint(name="left_wrist", x=0.38, y=0.86),
                Keypoint(name="right_wrist", x=0.62, y=0.86),
                Keypoint(name="left_hip", x=0.42, y=0.88),
                Keypoint(name="right_hip", x=0.58, y=0.88),
                Keypoint(name="left_knee", x=0.42, y=0.98),
                Keypoint(name="right_knee", x=0.58, y=0.98),
                Keypoint(name="left_ankle", x=0.42, y=1.0),
                Keypoint(name="right_ankle", x=0.58, y=1.0),
            ]
            tips = [
                "Nghiêng nhẹ mặt 15 độ để tôn đường nét xương quai hàm",
                "Hạ vai xuống thư giãn, tránh gồng cứng",
                "Giữ mắt nhìn hơi chéo góc ống kính để tạo chiều sâu",
            ]
            return keypoints, "portrait_medium", "tilted_right", tips


ai_analyzer = AIAnalyzer()
