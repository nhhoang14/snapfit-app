from backend.app.schemas.pinterest import (
    PinterestSearchRequest,
    PinterestPinResponse,
    PinterestSearchResponse,
    CategoryItem,
)
from backend.app.schemas.ai_analysis import (
    ReferenceAnalysisRequest,
    Keypoint,
    PoseGuidance,
    CompositionGuideline,
    LightingInfo,
    ReferenceAnalysisResult,
    RealtimeAlignmentFeedback,
)
from backend.app.schemas.photo import (
    PhotoCreate,
    PhotoResponse,
    PhotoComparisonResult,
)
from backend.app.schemas.user import UserCreate, UserResponse, Token
