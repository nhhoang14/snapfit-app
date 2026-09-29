from fastapi import APIRouter, HTTPException, Body
from backend.app.schemas.ai_analysis import (
    ReferenceAnalysisRequest,
    ReferenceAnalysisResult,
    LiveFeedbackRequest,
    RealtimeAlignmentFeedback,
)
from backend.app.services.ai_analyzer import ai_analyzer
from backend.app.services.pinterest_service import pinterest_service

router = APIRouter()


@router.post("/analyze-reference", response_model=ReferenceAnalysisResult)
async def analyze_reference(request: ReferenceAnalysisRequest):
    """Analyzes a reference image to extract pose landmarks, composition grid, lighting, and camera guidance."""
    image_url = request.image_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080"
    reference_id = "ref-" + str(abs(hash(image_url)))[:8]

    result = ai_analyzer.analyze_reference(
        reference_id=reference_id,
        image_url=image_url,
        category=request.category or "portrait",
    )
    return result


@router.get("/reference/{reference_id}", response_model=ReferenceAnalysisResult)
async def get_reference_analysis(reference_id: str):
    """Get previously computed or on-demand analysis for a reference ID."""
    pin = await pinterest_service.get_pin_by_id(reference_id)
    image_url = pin.image_url if pin else "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080"
    category = pin.category if pin else "portrait"

    return ai_analyzer.analyze_reference(
        reference_id=reference_id,
        image_url=image_url,
        category=category,
    )


@router.post("/live-alignment", response_model=RealtimeAlignmentFeedback)
async def evaluate_live_alignment(request: LiveFeedbackRequest):
    """Realtime endpoint: evaluates current camera keypoints against reference and provides live coaching."""
    pin = await pinterest_service.get_pin_by_id(request.reference_id)
    category = pin.category if pin else "portrait"
    image_url = pin.image_url if pin else ""

    ref_analysis = ai_analyzer.analyze_reference(
        reference_id=request.reference_id,
        image_url=image_url,
        category=category,
    )

    feedback = ai_analyzer.evaluate_realtime_alignment(
        ref_analysis=ref_analysis,
        current_keypoints=request.current_keypoints,
        device_pitch=request.device_pitch or 0.0,
        device_roll=request.device_roll or 0.0,
    )
    return feedback
