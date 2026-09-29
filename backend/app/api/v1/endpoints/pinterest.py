from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from backend.app.schemas.pinterest import (
    PinterestSearchResponse,
    PinterestPinResponse,
    CategoryItem,
)
from backend.app.services.pinterest_service import pinterest_service

router = APIRouter()


@router.get("/categories", response_model=List[CategoryItem])
async def list_categories():
    """Returns curated photo categories (Portrait, Couple, Group, OOTD, Cafe, Travel)."""
    return await pinterest_service.get_categories()


@router.get("/search", response_model=PinterestSearchResponse)
async def search_references(
    q: Optional[str] = Query(default="", description="Search keyword"),
    category: Optional[str] = Query(default=None, description="Category filter"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=50),
):
    """Search Pinterest / inspiration database for reference photos."""
    return await pinterest_service.search_pins(query=q, category=category, page=page, limit=limit)


@router.get("/pins/{pin_id}", response_model=PinterestPinResponse)
async def get_pin(pin_id: str):
    """Get single pin details by ID."""
    pin = await pinterest_service.get_pin_by_id(pin_id)
    if not pin:
        raise HTTPException(status_code=404, detail="Pin not found")
    return pin
