export interface Keypoint {
  name: string;
  x: number; // 0.0 - 1.0
  y: number; // 0.0 - 1.0
  z?: number;
  visibility?: number;
}

export interface CameraGuidance {
  shot_type: 'close_up' | 'medium_shot' | 'full_body' | 'wide_shot';
  recommended_distance_meters: number;
  angle_type: 'eye_level' | 'low_angle' | 'high_angle';
  tilt_degrees: number;
  roll_degrees: number;
  focal_length_hint: string;
}

export interface CompositionGuideline {
  rule_type: string;
  subject_anchor: string;
  power_point_x: number;
  power_point_y: number;
  horizon_y?: number | null;
}

export interface LightingInfo {
  light_direction: string;
  contrast_level: string;
  dominant_palette: string[];
  recommended_exposure_ev: number;
  tone_mood: string;
}

export interface PoseGuidance {
  pose_type: string;
  is_facing_camera: boolean;
  head_tilt: string;
  shoulder_angle: number;
  keypoints: Keypoint[];
  keypoint_connections: number[][];
  summary_instruction: string;
}

export interface ReferencePhoto {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category: string;
  dominant_color?: string;
  width?: number;
  height?: number;
  camera_guidance?: CameraGuidance;
  composition?: CompositionGuideline;
  lighting?: LightingInfo;
  pose?: PoseGuidance;
  suggested_tips?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  cover_image: string;
  sample_queries: string[];
}

export interface RealtimeAlignmentFeedback {
  overall_score: number; // 0 - 100
  pose_score: number;
  composition_score: number;
  angle_score: number;
  distance_score: number;
  primary_guidance: string;
  secondary_guidance?: string;
  is_aligned_well: boolean;
  ready_to_snap: boolean;
}

export interface CapturedPhoto {
  id: string;
  uri: string;
  reference_id?: string;
  reference_image_url?: string;
  similarity_score?: number;
  created_at: string;
  filter_applied: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
}

export interface ComparisonResult {
  captured_photo_id: string;
  reference_id: string;
  overall_match_percentage: number;
  pose_match_score: number;
  composition_match_score: number;
  color_palette_similarity: number;
  lighting_similarity: number;
  feedback_notes: string[];
  positive_highlights: string[];
  improvement_tips: string[];
}
