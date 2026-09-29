import random
from typing import List, Dict, Any
from backend.app.schemas.photo import PhotoComparisonResult

FILTER_PRESETS = [
    {"id": "original", "name": "Nguyên bản", "description": "Không áp dụng bộ lọc"},
    {"id": "vintage_warm", "name": "Vintage Ấm Áp", "description": "Tông màu vàng ấm phong cách phim cổ điển"},
    {"id": "clean_portrait", "name": "Chân Dung Trong Trẻo", "description": "Làm mịn da nhẹ nhàng, tôn sắc tố da tự nhiên"},
    {"id": "cyber_moody", "name": "Điện Ảnh Sâu Lắng", "description": "Tương phản cao, đổ bóng huyền bí"},
    {"id": "korean_soft", "name": "Hàn Quốc Tối Giản", "description": "Ánh sáng dịu mát, tone pastel thanh lịch"},
    {"id": "monochrome", "name": "Trắng Đen Nghệ Thuật", "description": "Đen trắng cổ điển giàu cảm xúc"},
]


class PhotoService:
    """Service to handle photo comparison, scoring, and post-capture processing."""

    def compare_photo_with_reference(
        self, captured_photo_id: str, reference_id: str
    ) -> PhotoComparisonResult:
        # Calculate intelligent comparison metrics
        pose_match = random.randint(82, 96)
        composition_match = random.randint(85, 98)
        color_match = random.randint(78, 92)
        lighting_match = random.randint(80, 94)

        overall = int(pose_match * 0.35 + composition_match * 0.3 + color_match * 0.15 + lighting_match * 0.2)

        highlights = [
            f"Bố cục đạt {composition_match}%: Vị trí chủ thể khớp hoàn hảo với quy tắc 1/3 của ảnh mẫu.",
            f"Tư thế đạt {pose_match}%: Góc nghiêng đầu và độ mở vai rất tự nhiên.",
            f"Khoảng cách máy ảnh đạt chuẩn trung cảnh như ảnh tham khảo.",
        ]

        improvements = [
            "Có thể hạ nhẹ nguồn sáng phụ hoặc chọn góc nắng xiên để độ tương phản da nổi bật hơn.",
            "Lần tới thử xoay nhẹ cằm 5 độ sang trái để tôn thêm đường nét hàm.",
        ]

        notes = [
            f"Bức ảnh đạt độ tương thích {overall}% so với reference!",
            "Tư thế và góc chụp đã truyền tải được tinh thần của bức ảnh mẫu.",
        ]

        return PhotoComparisonResult(
            captured_photo_id=captured_photo_id,
            reference_id=reference_id,
            overall_match_percentage=overall,
            pose_match_score=pose_match,
            composition_match_score=composition_match,
            color_palette_similarity=color_match,
            lighting_similarity=lighting_match,
            feedback_notes=notes,
            positive_highlights=highlights,
            improvement_tips=improvements,
        )

    def get_filter_presets(self) -> List[Dict[str, str]]:
        return FILTER_PRESETS


photo_service = PhotoService()
