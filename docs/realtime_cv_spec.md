# Hướng Dẫn Kỹ Thuật Computer Vision & Realtime Guidance trong SnapFit

## 1. Tổng quan cơ chế hướng dẫn chụp ảnh thông minh

SnapFit kết hợp hai luồng dữ liệu chính để hỗ trợ người dùng căn chỉnh góc máy và dáng chụp theo thời gian thực:
1. **Dữ liệu Hình ảnh (Vision Stream)**: Nhận diện tư thế người, khung xương (Skeleton), vị trí khuôn mặt và cơ thể.
2. **Dữ liệu Cảm biến Thiết bị (Sensor Stream)**: Đọc góc nghiêng (Pitch) và độ nghiêng trục ngang (Roll) từ Accelerometer & Gyroscope.

```
+-------------------------------------------------------------------+
|                           CAMERA PREVIEW                          |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |  [Ghost Overlay: Ảnh mẫu mờ 25%]                         |   |
|   |                                                           |   |
|   |         O  <- Đầu (Nose / Eyes)                           |   |
|   |        /|\ <- Vai & Cánh tay                              |   |
|   |        / \ <- Chân                                        |   |
|   |                                                           |   |
|   |  [Đường lưới 1/3 (Rule of Thirds Grid)]                   |   |
|   +-----------------------------------------------------------+   |
|                                                                   |
|  [Thước đo thăng bằng / Leveler: Con quay hồi chuyển (0°)]        |
|  [Hộp nhắc nhở Realtime: "Lùi lại 2 bước & nghiêng đầu nhẹ"]      |
|  [Vòng tròn điểm tương thích: 88% - Bố cục hoàn hảo!]             |
|                                                                   |
|                     [ NÚT CHỤP ẢNH ]                             |
+-------------------------------------------------------------------+
```

---

## 2. Các chế độ hỗ trợ trên Camera (Overlay Modes)

### 2.1. Ghost Overlay (Hình bóng mờ)
- Hiển thị hình ảnh mẫu đã tách nền hoặc điều chỉnh độ mờ (Opacity: 15% - 40%) đè trực tiếp lên camera.
- Người chụp hoặc người được chụp có thể căn chỉnh hình thể của mình lồng vào bóng mờ một cách trực quan nhất mà không cần tính toán số học phức tạp.

### 2.2. Skeleton Wireframe (Khung xương AI)
- Hiển thị 17 điểm mốc (Keypoints) và các đường nối (Connections) của tư thế mẫu.
- Điểm mốc đổi màu theo trạng thái:
  - **Màu đỏ**: Độ lệch lớn so với tư thế mẫu (> 25% sai số).
  - **Màu vàng**: Đang điều chỉnh đúng hướng (sai số 10% - 25%).
  - **Màu xanh lục (Emerald Green)**: Đã khớp chuẩn xác (< 10% sai số).

### 2.3. Rule-of-Thirds Grid & Power Points
- 4 giao điểm vàng của khung hình được làm sáng khi đầu hoặc mắt của chủ thể tiến vào vùng điểm mạnh.

### 2.4. Smart Tilt & Roll Leveler (Góc máy)
- Dựa vào con quay hồi chuyển của smartphone để xác định:
  - Máy ảnh có đang chụp thẳng ngang tầm mắt (Eye-level) không.
  - Máy ảnh có đang hạ thấp để chụp hất lên (Low-angle cho ảnh OOTD kéo dài chân) không.
  - Thiết bị có bị nghiêng lệch đường chân trời không.

---

## 3. Thuật toán Realtime Feedback Engine

```typescript
// Pseudo-code đánh giá độ tương thích
function evaluateAlignment(referencePose, livePose, deviceOrientation) {
  const poseScore = computeNormalizedProcrustesDistance(referencePose, livePose);
  const distanceScore = computeBoundingBoxScaleRatio(referencePose, livePose);
  const angleScore = computeOrientationDelta(referenceOrientation, deviceOrientation);

  const overallScore = (poseScore * 0.45) + (distanceScore * 0.3) + (angleScore * 0.25);

  let guidanceText = "";
  if (distanceScore < 0.7) guidanceText = "Hãy bước lại gần hơn một chút";
  else if (distanceScore > 1.3) guidanceText = "Lùi lại 1-2 bước để lấy trọn khung hình";
  else if (Math.abs(deviceOrientation.roll) > 5) guidanceText = "Cân bằng lại điện thoại (tránh nghiêng)";
  else if (poseScore < 0.75) guidanceText = "Căn chỉnh vai và tay theo đường khung xương";
  else guidanceText = "Tuyệt đẹp! Giữ nguyên tư thế và chụp ngay!";

  return { overallScore, guidanceText, readyToCapture: overallScore >= 85 };
}
```

---

## 4. Tích hợp Rung phản hồi (Haptic Feedback) & Giọng nói (Voice Cue)
- Khi điểm tương thích đạt **>= 85%**, thiết bị sẽ rung nhẹ (`Haptics.notificationAsync(Success)`) báo hiệu thời điểm hoàn hảo để bấm chụp.
- Tính năng Voice Guidance (Text-to-Speech) tùy chọn giúp người cầm máy không cần nhìn chằm chằm vào màn hình mà chỉ cần nghe hiệu lệnh: *"Lùi lại một chút"*, *"Giữ nguyên, chụp!"*.
