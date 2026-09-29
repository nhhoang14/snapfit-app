from typing import List, Optional
from pydantic import BaseModel, HttpUrl


class PinterestPinResponse(BaseModel):
    id: str
    title: Optional[str] = "Untitled Inspiration"
    description: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = 1080
    height: Optional[int] = 1920
    source_url: Optional[str] = None
    category: Optional[str] = "portrait"
    dominant_color: Optional[str] = "#5A67D8"


class PinterestSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    page: int = 1
    limit: int = 20


class PinterestSearchResponse(BaseModel):
    items: List[PinterestPinResponse]
    total: int
    page: int
    limit: int


class CategoryItem(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    cover_image: str
    sample_queries: List[str]
