# Đặc tả thiết kế: T-006 Màn hình Lịch sử ca khám & Báo động đỏ phản vệ

## Căn cứ
- Bản sắc: `workflow/design/direction.md` (Yếu tố đặc trưng 3: Vòng chắn báo động đỏ & Yếu tố 4: Phân loại Cấp vs Mạn).

## Bố cục và thứ bậc thông tin
- **Màn hình Lịch sử ca khám (`/patient/records`):**
  - Header: Tiêu đề "Lịch Sử Hồ Sơ Bệnh Án", phụ đề y tế trấn an.
  - Bộ lọc: Tất cả / Mày đay Mạn tính / Mày đay Cấp tính (Dùng `base-tab-nav` Line tabs chuẩn Base Web).
  - Thẻ đợt khám (`base-card`):
    - Mã bệnh án font-mono nổi bật (`BA-2026-0101`).
    - Tag phân loại: Mày đay Cấp (`base-tag-info`) vs Mày đay Mạn (`base-tag-warning`).
    - Tên bác sĩ khám, ngày khám, trạng thái xuất viện/đang theo dõi.
    - Nút "Xem Đơn Thuốc & Kết Quả" mở panel chi tiết.
- **Màn hình Báo động đỏ (`/patient/emergency`):**
  - Nếu tick bất kỳ dấu hiệu nguy kịch nào: Bật khung đỏ cảnh báo toàn màn hình (`bg-[var(--base-bg-negative-tint)] border-2 border-[var(--base-negative-primary)]`).
  - Nút gọi cấp cứu khổ cực đại: `tel:115` và hotline `tel:19006951`.

## Tiêu chí thiết kế kiểm được (AC-D)
AC-D1. Cảnh báo phản vệ có độ tương phản đạt chuẩn AAA (chữ đỏ sẫm trên nền nhạt, icon cảnh báo).
AC-D2. Thẻ đơn thuốc hiển thị bảng liều lượng rõ ràng, phông chữ dễ đọc cho người lớn tuổi.
AC-D3. Nút bấm trên thiết bị di động có chiều cao $\ge 48$px.
