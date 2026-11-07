# CẨM NANG HƯỚNG DẪN DÀNH CHO BÁC SĨ — DRMAYDAY
*Phân hệ Khám lâm sàng & Quản lý Ca bệnh — Bệnh viện Da liễu Trung ương*

---

## 1. Hàng đợi ca khám (Waiting Queue)
- **Danh sách bệnh nhân**: Hiển thị toàn bộ ca khám theo mức độ ưu tiên thời gian thực:
  - Báo động đỏ (Khẩn cấp): Luôn đẩy lên đầu danh sách kèm nhãn cảnh báo đỏ nổi bật.
  - Phân loại ca: Mày đay mạn tính (CSU - thời gian > 6 tuần) hoặc Mày đay cấp tính (< 6 tuần).
- **Thao tác**: Nhấn "Tiếp nhận ca khám" để chuyển trạng thái sang `in_progress` và mở màn hình Khám lâm sàng chi tiết.

---

## 2. Màn hình Khám lâm sàng (Clinical Consultation)
Bác sĩ được cung cấp giao diện tích hợp mật độ cao (Clinician Compact) gồm các phân khu nghiệp vụ:

### 2.1. Thông tin hành chính & Chỉ số sinh tồn
- Họ tên, mã bệnh án (`BA-2026-xxxx`), giới tính, số điện thoại, số thẻ BHYT (đã được ẩn giấu an toàn PII).
- Nhịp tim, huyết áp, nhiệt độ, chỉ số SpO2.

### 2.2. Dải nhiệt hoạt động bệnh 7 ngày (7-day UAS7 Heat Strip)
- Trực quan hóa điểm số từng ngày trong tuần của bệnh nhân bằng dải màu trực quan (Xanh lá &rarr; Vàng &rarr; Đỏ gạch).
- Tự động hiển thị tổng điểm UAS7 và mức độ kiểm soát bệnh theo chuẩn khuyến cáo quốc tế EAACI/GA²LEN/EDF/WAO.

### 2.3. Biên niên sử tổn thương 3 giai đoạn (Tri-phase Lesion Chronicle)
- Xem ảnh chụp thực tế của bệnh nhân theo 3 mốc: Sẩn phù &rarr; Hồng ban &rarr; Thoái lui kèm mốc thời gian chi tiết.
- Hỗ trợ phóng to ảnh để soi các đặc điểm bờ viền, kích thước sẩn và sắc tố.

### 2.4. Kê đơn thuốc điện tử chuẩn Bệnh viện Da liễu TW
- Danh mục thuốc kháng histamin thế hệ 2 chuẩn phác đồ bậc 1 & bậc 2:
  - Fexofenadine Hydrochloride (180mg)
  - Levocetirizine (5mg)
  - Desloratadine (5mg)
  - Cetirizine (10mg)
- Hỗ trợ ghi chú dặn dò bệnh nhân về chế độ ăn kiêng, tránh các yếu tố kích ứng vật lý (nhiệt, cọ xát).

### 2.5. Hoàn tất & Ký số bệnh án điện tử (EMR Clinical Seal)
- Bác sĩ kiểm tra lại chẩn đoán xác định và nhấn **"Hoàn tất ca khám"**.
- Bệnh án được niêm phong trạng thái `completed`, ghi nhận thời gian hoàn tất và bác sĩ chịu trách nhiệm.

---

## 3. Khóa an toàn phiên làm việc (Auto-lock 15 phút)
- Để bảo vệ bí mật thông tin bệnh án theo quy định của Bộ Y Tế, nếu bác sĩ không có thao tác trên bàn phím/chuột trong 15 phút liên tục, hệ thống sẽ tự động khóa giao diện và hiển thị thông báo đếm ngược 60 giây trước khi đăng xuất bảo mật.
