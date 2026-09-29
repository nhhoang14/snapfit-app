# SnapFit REST API Specification (v1)

Swagger / OpenAPI documentation khả dụng trực tiếp tại: `http://localhost:8000/docs`

## Base URL
- Development: `http://localhost:8000/api/v1`

---

## 1. Pinterest & Inspiration Endpoints

### 1.1. Lấy danh sách chuyên mục chụp ảnh
- **GET** `/pinterest/categories`
- **Response**:
```json
[
  {
    "id": "portrait",
    "name": "Chân dung (Portrait)",
    "description": "Ảnh chụp cá nhân góc cận, trung cảnh, cận cảnh nghệ thuật",
    "icon": "user",
    "cover_image": "https://images.unsplash.com/...",
    "sample_queries": ["aesthetic portrait photography poses", "golden hour portrait"]
  }
]
```

### 1.2. Tìm kiếm ảnh tham khảo
- **GET** `/pinterest/search?q={query}&category={category}&page={page}&limit={limit}`
- **Response**:
```json
{
  "items": [
    {
      "id": "pin-port-1",
      "title": "Ánh sáng hoàng hôn nghệ thuật",
      "description": "Góc chụp 3/4 mặt, ánh sáng ngược ấm áp",
      "image_url": "https://images.unsplash.com/...",
      "thumbnail_url": "https://images.unsplash.com/...",
      "width": 1080,
      "height": 1440,
      "category": "portrait",
      "dominant_color": "#E0A96D"
    }
  ],
  "total": 6,
  "page": 1,
  "limit": 20
}
```

---

## 2. AI Analysis & Realtime Guidance

### 2.1. Phân tích ảnh tham khảo
- **POST** `/ai/analyze-reference`
- **Request Body**:
```json
{
  "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "category": "portrait"
}
```
- **Response**:
```json
{
  "reference_id": "ref-12345",
  "image_url": "https://...",
  "width": 1080,
  "height": 1440,
  "camera_guidance": {
    "shot_type": "medium_shot",
    "recommended_distance_meters": 1.5,
    "angle_type": "eye_level",
    "tilt_degrees": 0.0,
    "roll_degrees": 0.0,
    "focal_length_hint": "2x hoặc 3x chân dung"
  },
  "composition": {
    "rule_type": "rule_of_thirds",
    "subject_anchor": "center",
    "power_point_x": 0.5,
    "power_point_y": 0.33,
    "horizon_y": null
  },
  "lighting": {
    "light_direction": "left",
    "contrast_level": "soft",
    "dominant_palette": ["#F7D9C4", "#D8A47F", "#8C583E", "#2C1B14", "#E8D8CE"],
    "recommended_exposure_ev": 0.3,
    "tone_mood": "warm"
  },
  "pose": {
    "pose_type": "portrait_medium",
    "is_facing_camera": true,
    "head_tilt": "tilted_right",
    "shoulder_angle": 3.5,
    "keypoints": [
      {"name": "nose", "x": 0.5, "y": 0.3, "z": 0.0, "visibility": 1.0}
    ],
    "keypoint_connections": [[0, 1], [0, 2], [5, 6], [5, 7]],
    "summary_instruction": "Nghiêng nhẹ mặt 15 độ để tôn đường nét xương quai hàm"
  },
  "suggested_tips": [
    "Nghiêng nhẹ mặt 15 độ để tôn đường nét xương quai hàm",
    "Hạ vai xuống thư giãn, tránh gồng cứng",
    "Giữ mắt nhìn hơi chéo góc ống kính để tạo chiều sâu"
  ]
}
```

### 2.2. Nhận feedback hướng dẫn thời gian thực
- **POST** `/ai/live-alignment`
- **Request Body**:
```json
{
  "reference_id": "pin-port-1",
  "current_keypoints": [
    {"name": "nose", "x": 0.52, "y": 0.31, "z": 0.0, "visibility": 0.95}
  ],
  "device_pitch": -2.0,
  "device_roll": 0.5
}
```
- **Response**:
```json
{
  "overall_score": 88,
  "pose_score": 90,
  "composition_score": 85,
  "angle_score": 92,
  "distance_score": 85,
  "primary_guidance": "Bố cục hoàn hảo! Giữ nguyên và bấm chụp!",
  "secondary_guidance": "Độ khớp: 88%",
  "is_aligned_well": true,
  "ready_to_snap": true
}
```

---

## 3. Photo Capturing & Comparison

### 3.1. Danh sách bộ lọc chỉnh sửa
- **GET** `/photos/filters`

### 3.2. Lưu ảnh chụp mới
- **POST** `/photos/capture` (Multipart Form)
  - `file`: Ảnh chụp
  - `reference_id`: ID ảnh tham khảo
  - `similarity_score`: Điểm tương đồng khi chụp (ví dụ: 88)
  - `filter_applied`: Bộ lọc áp dụng (ví dụ: `vintage_warm`)

### 3.3. So sánh ảnh chụp với ảnh tham khảo
- **POST** `/photos/compare` (Form Data)
  - `captured_photo_id`: ID ảnh chụp
  - `reference_id`: ID ảnh tham khảo
- **Response**:
```json
{
  "captured_photo_id": "photo-001",
  "reference_id": "pin-port-1",
  "overall_match_percentage": 91,
  "pose_match_score": 92,
  "composition_match_score": 95,
  "color_palette_similarity": 84,
  "lighting_similarity": 88,
  "feedback_notes": [
    "Bức ảnh đạt độ tương thích 91% so với reference!",
    "Tư thế và góc chụp đã truyền tải được tinh thần của bức ảnh mẫu."
  ],
  "positive_highlights": [
    "Bố cục đạt 95%: Vị trí chủ thể khớp hoàn hảo với quy tắc 1/3 của ảnh mẫu.",
    "Tư thế đạt 92%: Góc nghiêng đầu và độ mở vai rất tự nhiên."
  ],
  "improvement_tips": [
    "Có thể hạ nhẹ nguồn sáng phụ hoặc chọn góc nắng xiên để độ tương phản da nổi bật hơn."
  ]
}
```
