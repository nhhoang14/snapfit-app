# SnapFit 📸 — AI Realtime Photography Assistant

> **Ứng dụng chụp ảnh thông minh trên iOS & Android sử dụng AI và Computer Vision để hướng dẫn người dùng tạo dáng, căn góc máy, khoảng cách, bố cục và phong cách theo ảnh tham khảo (Pinterest / Curated References).**

---

## 🌟 1. Tổng Quan & Điểm Nổi Bật

**SnapFit** giải quyết bài toán lớn nhất khi chụp ảnh: *không biết tạo dáng như thế nào, không biết đặt góc máy ở đâu, xa hay gần*. Ứng dụng hỗ trợ trực tiếp người chụp và người được chụp qua cơ chế tương tác trực quan theo thời gian thực:

- 🔍 **Tìm kiếm cảm hứng từ Pinterest**: Duyệt theo chuyên mục (Chân dung, OOTD/Thời trang, Cặp đôi, Quán Cafe, Nhóm bạn, Du lịch) hoặc tìm theo từ khóa.
- ⚡ **AI Phân Tích Ảnh Mẫu Tức Thì**: Trích xuất 17 điểm mốc cơ thể (Pose Skeleton), quy tắc bố cục 1/3 (Rule of Thirds), hướng ánh sáng và bảng màu thẩm mỹ.
- 🎯 **Hướng Dẫn Realtime Trên Camera**:
  - **Ghost Overlay**: Hình bóng mờ bán trong suốt của ảnh mẫu đè lên camera để dễ dàng căn người vào dáng.
  - **Skeleton Wireframe**: Khung xương AI đổi màu (đỏ ➔ vàng ➔ xanh lục) khi người chụp vào đúng tư thế.
  - **Leveler & Sensor Guidance**: Đọc góc nghiêng máy ảnh (Pitch/Roll) và nhắc nhở điều chỉnh độ cao.
  - **Voice & Text Coaching**: Câu nhắc giọng nói / chữ tiếng Việt theo thời gian thực (*"Lùi lại 2 bước"*, *"Nâng cằm nhẹ"*, *"Bố cục hoàn hảo! Chụp ngay!"*).
- 🎚️ **Thanh Trượt So Sánh Split-View**: So sánh trực tiếp ảnh vừa chụp với ảnh reference qua thanh kéo tương tác.
- 🎨 **Bộ Lọc Màu Đồng Bộ**: Cân chỉnh tông màu theo các preset điện ảnh (Vintage Warm, Clean Portrait, Cyber Moody, Korean Soft).

---

## 🏗️ 2. Cấu Trúc Dự Án (Monorepo)

```text
snapfit-app/
├── mobile/                      # Ứng dụng Mobile (React Native / Expo SDK 57)
│   ├── src/
│   │   ├── app/                 # Expo Router Screens
│   │   │   ├── _layout.tsx      # Root Tab Navigation
│   │   │   ├── index.tsx        # Màn hình Khám phá & Tìm kiếm Pinterest
│   │   │   ├── camera.tsx       # Màn hình Camera AI Realtime Guidance
│   │   │   ├── compare.tsx      # Màn hình So sánh Split-View & Chỉnh sửa
│   │   │   └── gallery.tsx      # Bộ sưu tập ảnh & Lịch sử phiên chụp
│   │   ├── components/
│   │   │   ├── camera/          # GhostOverlay, SkeletonOverlay, Grid, GuidanceBanner
│   │   │   ├── comparison/      # ComparisonSlider, ScoreBreakdownCard
│   │   │   └── editor/          # FilterPicker
│   │   ├── services/            # API Client & Mock Data
│   │   ├── store/               # Zustand Global State Management
│   │   └── types/               # TypeScript Definitions
│   ├── app.json                 # Cấu hình Expo, Camera & Media Permissions
│   └── package.json
│
├── backend/                     # Backend REST API & AI Service (Python FastAPI)
│   ├── app/
│   │   ├── main.py              # Khởi tạo FastAPI App, CORS & Static Uploads
│   │   ├── api/v1/endpoints/    # Pinterest, AI Analysis, Photos, Auth
│   │   ├── core/                # Config (Pydantic Settings), DB, Security
│   │   ├── models/              # SQLAlchemy Database Models
│   │   ├── schemas/             # Pydantic Request / Response Schemas
│   │   └── services/            # AI Analyzer, Pinterest API Client, Photo Service
│   ├── tests/                   # Pytest API Test Suite
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                        # Tài liệu chi tiết dự án
│   ├── architecture.md          # Sơ đồ & Kiến trúc hệ thống
│   ├── api_spec.md              # Đặc tả REST API (OpenAPI endpoints)
│   └── realtime_cv_spec.md      # Hướng dẫn kỹ thuật Computer Vision & Realtime Feedback
│
├── docker-compose.yml           # Khởi chạy Backend + PostgreSQL + Redis
├── .gitignore
└── README.md
```

---

## 🚀 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 3.1. Chạy Backend (FastAPI)

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Tạo virtual environment & kích hoạt
python3 -m venv venv
source venv/bin/activate  # Trên macOS / Linux

# 3. Cài đặt các thư viện
pip install -r requirements.txt

# 4. Sao chép biến môi trường
cp .env.example .env

# 5. Khởi động server phát triển
uvicorn backend.app.main:app --reload --port 8000
```
- API Docs (Swagger UI): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

*Hoặc chạy nhanh qua Docker:*
```bash
docker-compose up -d
```

---

### 3.2. Chạy Mobile App (React Native / Expo)

```bash
# 1. Di chuyển vào thư mục mobile
cd mobile

# 2. Khởi chạy Expo Dev Server
npx expo start
```
- Nhấn `i` để mở trên iOS Simulator.
- Nhấn `a` để mở trên Android Emulator.
- Nhấn `w` để mở xem thử trên Web Browser.
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại thật.

---

## 🔄 4. Khớp Luồng Hoạt Động (User Flow)

| Bước trong Flow | Màn hình / Module chịu trách nhiệm |
| :--- | :--- |
| **1. Mở SnapFit** | `mobile/src/app/index.tsx` (Inspiration Screen) |
| **2. Chọn loại ảnh** | Carousel chuyên mục (`Portrait`, `OOTD`, `Couple`, `Cafe`, `Group`, `Travel`) |
| **3. Tìm ảnh tham khảo** | Tích hợp Pinterest API qua `backend/app/services/pinterest_service.py` |
| **4. Chọn / Bỏ qua reference** | Nút *"Chọn mẫu này & Mở Camera"* hoặc *"Chụp tự do không cần mẫu"* |
| **5. AI phân tích reference** | `backend/app/services/ai_analyzer.py` (Trích xuất Pose, Grid, Góc máy, Ánh sáng) |
| **6. Mở camera** | `mobile/src/app/camera.tsx` (`CameraView` với Ghost & Skeleton Wireframe) |
| **7. AI hướng dẫn realtime** | `GuidanceBanner` + Thanh đo độ khớp % + Rung phản hồi (Haptics) khi đạt &gt;85% |
| **8. Chụp ảnh** | Shutter button viền sáng thông minh kích hoạt chụp & lưu ảnh |
| **9. Chỉnh sửa ảnh** | `FilterPicker` trong `mobile/src/app/compare.tsx` (Preset tông màu) |
| **10. So sánh với reference**| `ComparisonSlider` (Kéo thanh trượt Split-View trước/sau) |
| **11. Lưu / Chia sẻ** | Lưu vào thư viện ảnh máy (`expo-media-library`) & Chia sẻ mạng xã hội |

---

## 🛡️ 5. Kiểm Thử (Testing)

Chạy bộ kiểm thử tự động của Backend:
```bash
cd backend
pytest tests/ -v
```

---

## 📝 Giấy phép
Dự án được phát triển dưới giấy phép MIT.
