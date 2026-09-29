import httpx
from typing import List, Optional, Dict, Any
from backend.app.core.config import settings
from backend.app.schemas.pinterest import PinterestPinResponse, PinterestSearchResponse, CategoryItem

# Curated categories for photography inspiration
CATEGORIES: List[CategoryItem] = [
    CategoryItem(
        id="portrait",
        name="Chân dung (Portrait)",
        description="Ảnh chụp cá nhân góc cận, trung cảnh, cận cảnh nghệ thuật",
        icon="user",
        cover_image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        sample_queries=["aesthetic portrait photography poses", "golden hour portrait", "studio portrait pose ideas"],
    ),
    CategoryItem(
        id="couple",
        name="Đôi lứa (Couple)",
        description="Tư thế chụp ảnh cặp đôi tự nhiên, tình cảm, lãng mạn",
        icon="heart",
        cover_image="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80",
        sample_queries=["couple photoshoot poses outdoor", "cute candid couple poses", "street couple photography"],
    ),
    CategoryItem(
        id="group",
        name="Nhóm bạn (Group)",
        description="Bố cục chụp ảnh nhóm bạn thân, gia đình đầy phong cách",
        icon="users",
        cover_image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
        sample_queries=["friends aesthetic photoshoot poses", "group poses streetwear", "creative squad photoshoot"],
    ),
    CategoryItem(
        id="ootd",
        name="OOTD / Streetwear",
        description="Khoe trang phục, góc máy tôn dáng, thời trang đường phố",
        icon="sparkles",
        cover_image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        sample_queries=["ootd photography poses standing", "korean street style photoshoot", "minimalist outfit pose"],
    ),
    CategoryItem(
        id="travel",
        name="Du lịch & Cảnh (Travel)",
        description="Kết hợp hài hòa giữa chủ thể và phong cảnh xung quanh",
        icon="compass",
        cover_image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        sample_queries=["travel photography pose ideas", "wanderlust landscape with person", "cafe travel poses"],
    ),
    CategoryItem(
        id="cafe",
        name="Quán Cafe & Lifestyle",
        description="Tạo dáng ngồi bàn, cầm ly cafe, đọc sách tự nhiên",
        icon="coffee",
        cover_image="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
        sample_queries=["aesthetic cafe sitting pose", "coffee shop candid portrait", "lifestyle cafe photoshoot"],
    ),
]

# High quality mock inspiration data for instant testing
SAMPLE_PINS: List[PinterestPinResponse] = [
    PinterestPinResponse(
        id="pin-port-1",
        title="Ánh sáng hoàng hôn nghệ thuật",
        description="Góc chụp 3/4 mặt, ánh sáng ngược ấm áp, ánh mắt nhìn lơ đãng",
        image_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&auto=format&fit=crop&q=85",
        thumbnail_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        width=1080,
        height=1440,
        category="portrait",
        dominant_color="#E0A96D",
    ),
    PinterestPinResponse(
        id="pin-port-2",
        title="Tối giản phong cách Hàn Quốc",
        description="Đứng thẳng, nghiêng đầu nhẹ 10 độ, một tay để trong túi áo khoác",
        image_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1080&auto=format&fit=crop&q=85",
        thumbnail_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        width=1080,
        height=1620,
        category="portrait",
        dominant_color="#2D3748",
    ),
    PinterestPinResponse(
        id="pin-ootd-1",
        title="OOTD Dáng bước đi tự nhiên",
        description="Bước chân về phía trước, máy ảnh hạ thấp ngang thắt lưng để kéo dài chân",
        image_url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&auto=format&fit=crop&q=85",
        thumbnail_url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
        width=1080,
        height=1620,
        category="ootd",
        dominant_color="#F6AD55",
    ),
    PinterestPinResponse(
        id="pin-couple-1",
        title="Cặp đôi dạo phố hoàng hôn",
        description="Hai người nắm tay nhau bước đi cùng hướng, góc máy ngang tầm mắt",
        image_url="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1080&auto=format&fit=crop&q=85",
        thumbnail_url="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=80",
        width=1080,
        height=1440,
        category="couple",
        dominant_color="#DD6B20",
    ),
    PinterestPinResponse(
        id="pin-cafe-1",
        title="Ngồi thư giãn bên tách cafe",
        description="Góc chụp từ trên chéo xuống, hai tay cầm tách cafe trên mặt bàn gỗ",
        image_url="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1080&auto=format&fit=crop&q=85",
        thumbnail_url="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80",
        width=1080,
        height=1440,
        category="cafe",
        dominant_color="#7B341E",
    ),
    PinterestPinResponse(
        id="pin-group-1",
        title="Nhóm bạn bậc thang",
        description="Ngồi so le trên bậc thang, tạo chiều sâu và khoảng cách hài hòa",
        image_url="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1080&auto=format&fit=crop&q=85",
        thumbnail_url="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80",
        width=1080,
        height=1440,
        category="group",
        dominant_color="#3182CE",
    ),
]


class PinterestService:
    def __init__(self):
        self.access_token = settings.PINTEREST_ACCESS_TOKEN
        self.api_base = settings.PINTEREST_API_BASE_URL

    async def get_categories(self) -> List[CategoryItem]:
        return CATEGORIES

    async def search_pins(
        self, query: str, category: Optional[str] = None, page: int = 1, limit: int = 20
    ) -> PinterestSearchResponse:
        # If Pinterest API token is configured, call Pinterest official API
        if self.access_token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    headers = {"Authorization": f"Bearer {self.access_token}"}
                    response = await client.get(
                        f"{self.api_base}/pins",
                        headers=headers,
                        params={"query": query, "page_size": limit},
                    )
                    if response.status_code == 200:
                        data = response.json()
                        items = [
                            PinterestPinResponse(
                                id=item.get("id"),
                                title=item.get("title") or "Pinterest Inspiration",
                                description=item.get("description"),
                                image_url=item.get("media", {}).get("images", {}).get("600x", {}).get("url", ""),
                                category=category or "portrait",
                            )
                            for item in data.get("items", [])
                        ]
                        return PinterestSearchResponse(items=items, total=len(items), page=page, limit=limit)
            except Exception as e:
                # Log error and fall back gracefully
                print(f"[PinterestService] API call failed: {e}. Falling back to curated dataset.")

        # Fallback to rich curated local dataset
        filtered = SAMPLE_PINS
        if category and category != "all":
            filtered = [p for p in filtered if p.category == category]
        if query and query.strip():
            q = query.lower()
            filtered = [
                p for p in filtered
                if q in p.title.lower() or (p.description and q in p.description.lower()) or (p.category and q in p.category.lower())
            ] or SAMPLE_PINS  # keep sample if query doesn't match to allow browsing

        return PinterestSearchResponse(
            items=filtered[:limit],
            total=len(filtered),
            page=page,
            limit=limit,
        )

    async def get_pin_by_id(self, pin_id: str) -> Optional[PinterestPinResponse]:
        for pin in SAMPLE_PINS:
            if pin.id == pin_id:
                return pin
        return SAMPLE_PINS[0]


pinterest_service = PinterestService()
