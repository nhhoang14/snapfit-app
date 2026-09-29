import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime
from backend.app.core.database import Base


class ReferencePhoto(Base):
    __tablename__ = "references"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    source = Column(String, default="pinterest")  # pinterest, curated, user_upload
    external_id = Column(String, index=True, nullable=True)
    title = Column(String, nullable=True)
    category = Column(String, index=True, default="portrait")  # portrait, couple, group, ootd, street, aesthetic
    image_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    width = Column(Integer, default=1080)
    height = Column(Integer, default=1920)
    analysis_cache = Column(Text, nullable=True)  # JSON serialized analysis
    tags = Column(String, nullable=True)  # comma-separated tags
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
