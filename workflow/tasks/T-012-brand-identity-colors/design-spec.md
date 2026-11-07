# Đặc tả Thiết kế (Design Spec) - Việc T-012

- Chế độ: `spec T-012`
- Người lập: Designer

## 1. Bản sắc màu sắc chính thức DrMayDay
Bảng màu y tế chính quy của Đề tài Bệnh viện Da liễu Trung ương:
- **Brand Navy (`#091F5B`)**:
  - Tương phản trên nền trắng: **13.5:1** (Đạt chuẩn WCAG 2.1 AAA - vượt ngưỡng 7:1).
  - Sử dụng cho: Logo, tiêu đề chính cấp cao, icon thương hiệu, viền active quan trọng.
- **Clinical Blue (`#3B63A8`)**:
  - Tương phản trên nền trắng: **5.5:1** (Đạt chuẩn WCAG 2.1 AA).
  - Sử dụng cho: Nút bấm chính (Base Button Primary), tab đang hoạt động, đường dẫn liên kết, thanh tiến trình.
- **Soft Sky Blue (`#6F96D1`)**:
  - Sử dụng cho: Biểu đồ, đường viền tương tác hover, icon phụ trợ.
- **Light Tint Blue (`#BAD6EB`)**:
  - Sử dụng cho: Nền badge, thẻ card được chọn (`bg-accent-tint`), khu vực hiển thị kết quả.
- **Canvas Off-White (`#F6F6F6`)**:
  - Nền toàn trang ứng dụng, dịu mắt cho nhân viên y tế và bệnh nhân.

## 2. Quy chuẩn ứng dụng Logo
- **Tỷ lệ hiển thị**:
  - Tệp gốc: 450x120px (Tỉ lệ 3.75:1).
  - Hiển thị trên Sidebar: Chiều cao tối ưu `h-9` hoặc `h-10` (~36-40px), chiều rộng auto `w-auto`.
  - Hiển thị trên Màn hình Đăng nhập: Chiều cao `h-12` (~48px), căn giữa cân đối.
- **Tương thích chế độ tối (Dark Mode)**:
  - Khi giao diện ở chế độ sáng (Light): Hiển thị `drmayday-logo.png` (Navy `#091F5B`).
  - Khi giao diện ở chế độ tối (`.dark`): Tự động chuyển sang `drmayday-logo-white.png`.
