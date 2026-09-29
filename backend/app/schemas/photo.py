from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class PhotoCreate(BaseModel):
    reference_id: Optional[str] = None
    similarity_score: Optional[int] = None
    filter_applied: Optional[str] = "original"
    metadata: Optional[Dict[str, Any]] = None


class PhotoResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    reference_id: Optional[str] = None
    reference_image_url: Optional[str] = None
    similarity_score: Optional[int] = None
    created_at: datetime
    filter_applied: str = "original"


class PhotoComparisonResult(BaseModel):
    captured_photo_id: str
    reference_id: str
    overall_match_percentage: int
    pose_match_score: int
    composition_match_score: int
    color_palette_similarity: int
    lighting_similarity: int
    feedback_notes: List[str]
    positive_highlights: List[str]
    improvement_tips: List[str]
