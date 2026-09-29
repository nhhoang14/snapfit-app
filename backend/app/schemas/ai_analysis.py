from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Keypoint(BaseModel):
    name: str
    x: float  # Normalized 0.0 - 1.0 (relative to image width)
    y: float  # Normalized 0.0 - 1.0 (relative to image height)
    z: Optional[float] = 0.0
    visibility: float = 1.0


class SubjectBoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float
    width: float
    height: float


class CameraGuidance(BaseModel):
    shot_type: str = "medium_shot"  # close_up, medium_shot, full_body, wide_shot
    recommended_distance_meters: float = 2.0
    angle_type: str = "eye_level"  # eye_level, low_angle, high_angle
    tilt_degrees: float = 0.0  # pitch
    roll_degrees: float = 0.0  # roll/level
    focal_length_hint: str = "1x (24-28mm)"


class CompositionGuideline(BaseModel):
    rule_type: str = "rule_of_thirds"  # rule_of_thirds, center_weighted, golden_ratio, leading_lines, diagonal
    subject_anchor: str = "center"  # left_third, right_third, center
    power_point_x: float = 0.5
    power_point_y: float = 0.33
    horizon_y: Optional[float] = None
    leading_line_coordinates: Optional[List[List[float]]] = None


class LightingInfo(BaseModel):
    light_direction: str = "front"  # front, left, right, backlit, top
    contrast_level: str = "medium"  # soft, medium, high
    dominant_palette: List[str] = Field(default_factory=lambda: ["#FFFFFF", "#000000", "#718096"])
    recommended_exposure_ev: float = 0.0
    tone_mood: str = "natural"  # warm, cool, moody, vibrant, vintage, natural


class PoseGuidance(BaseModel):
    pose_type: str = "standing"  # standing, sitting, walking, leaning, crouching
    is_facing_camera: bool = True
    head_tilt: str = "neutral"  # neutral, tilted_left, tilted_right
    shoulder_angle: float = 0.0
    keypoints: List[Keypoint] = Field(default_factory=list)
    keypoint_connections: List[List[int]] = Field(default_factory=list)
    summary_instruction: str = "Đứng thẳng tự nhiên, mắt hướng về máy ảnh"


class ReferenceAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    category: Optional[str] = "portrait"


class ReferenceAnalysisResult(BaseModel):
    reference_id: str
    image_url: str
    width: int
    height: int
    camera_guidance: CameraGuidance
    composition: CompositionGuideline
    lighting: LightingInfo
    pose: PoseGuidance
    suggested_tips: List[str] = Field(default_factory=list)


class LiveFeedbackRequest(BaseModel):
    reference_id: str
    current_keypoints: List[Keypoint]
    device_pitch: Optional[float] = 0.0
    device_roll: Optional[float] = 0.0


class RealtimeAlignmentFeedback(BaseModel):
    overall_score: int  # 0 to 100
    pose_score: int
    composition_score: int
    angle_score: int
    distance_score: int
    primary_guidance: str  # Vietnamese realtime guidance voice/text
    secondary_guidance: Optional[str] = None
    is_aligned_well: bool = False
    ready_to_snap: bool = False
