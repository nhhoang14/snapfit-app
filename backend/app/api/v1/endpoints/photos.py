import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user_optional
from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.models.photo import CapturedPhoto
from backend.app.schemas.photo import PhotoResponse, PhotoComparisonResult
from backend.app.services.photo_service import photo_service

router = APIRouter()


@router.get("/filters")
def list_filters():
    """List available photo editing presets."""
    return photo_service.get_filter_presets()


@router.post("/capture", response_model=PhotoResponse)
async def upload_captured_photo(
    file: UploadFile = File(None),
    reference_id: Optional[str] = Form(None),
    similarity_score: Optional[int] = Form(None),
    filter_applied: Optional[str] = Form("original"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Save a photo captured in the SnapFit camera."""
    photo_id = str(uuid.uuid4())
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    filename = f"{photo_id}.jpg"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    if file:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        image_url = f"/uploads/{filename}"
    else:
        # Fallback placeholder if simulated
        image_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080"

    photo = CapturedPhoto(
        id=photo_id,
        user_id=current_user.id if current_user else None,
        reference_id=reference_id,
        image_url=image_url,
        similarity_score=similarity_score or 88,
        filter_applied=filter_applied or "original",
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.post("/compare", response_model=PhotoComparisonResult)
def compare_photos(
    captured_photo_id: str = Form(...),
    reference_id: str = Form(...),
):
    """Compare a captured photo against the chosen reference photo."""
    return photo_service.compare_photo_with_reference(
        captured_photo_id=captured_photo_id, reference_id=reference_id
    )


@router.get("/history", response_model=List[PhotoResponse])
def get_user_photo_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get list of previously captured photos."""
    query = db.query(CapturedPhoto).order_by(CapturedPhoto.created_at.desc())
    if current_user:
        query = query.filter(CapturedPhoto.user_id == current_user.id)
    return query.limit(30).all()
