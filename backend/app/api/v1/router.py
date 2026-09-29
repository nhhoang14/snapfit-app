from fastapi import APIRouter
from backend.app.api.v1.endpoints import auth, pinterest, ai_analysis, photos

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(pinterest.router, prefix="/pinterest", tags=["Pinterest & Inspiration"])
api_router.include_router(ai_analysis.router, prefix="/ai", tags=["AI Analysis & Realtime Guidance"])
api_router.include_router(photos.router, prefix="/photos", tags=["Photos & Photo Editing"])
