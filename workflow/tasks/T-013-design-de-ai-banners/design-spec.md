# Đặc tả Thiết kế (Design Spec) - Việc T-013

- Chế độ: `spec T-013`
- Người lập: Designer

## 1. Định hướng Thiết kế Phi Khuôn Mẫu (De-AI Aesthetic)
- **Vấn đề đã nhận diện**: Khuôn mẫu thiết kế AI phổ biến (AI SaaS Tropes) thường lạm dụng thẻ pill nhỏ bo tròn (`rounded-full bg-white/10`) đặt phía trên tiêu đề, đi kèm nền phẳng đơn điệu thiếu tính thực tiễn.
- **Giải pháp chuyển đổi**:
  - Tiêu đề chính (Page Title) đứng trực tiếp, dứt khoát, mang tính định danh phân hệ rõ ràng theo Uber Base Typography (`base-heading-xl` / `base-heading-lg`).
  - Phụ đề (Subtitle) mang thông tin nghiệp vụ thực tiễn, phân cấp màu sắc rõ ràng (`text-blue-100/80` hoặc `text-gray-300`).

## 2. Nghệ thuật Hậu Cảnh (Background Asset & Texture Integration)
- **Lớp 1 (Nền dốc thương hiệu)**: `linear-gradient(135deg, #091F5B 0%, #153275 60%, #3B63A8 100%)`.
- **Lớp 2 (Tư liệu hình ảnh lâm sàng)**:
  - Tích hợp ảnh chụp thực tế chuyên khoa Da liễu (`clinic-consultation-01.jpg`, `clinic-consultation-02.jpg`, `clinic-examination.jpg`, `clinic-urticaria-rash.jpg`).
  - Áp dụng kỹ thuật mặt nạ chuyển mờ `gradient-to-r from-[var(--base-brand-navy)] via-[var(--base-brand-navy)]/70 to-transparent` kết hợp hòa trộn sắc độ `mix-blend-luminosity` ở độ mờ 15-25%.
- **Lớp 3 (Họa tiết hình học vi mô)**:
  - Lưới kỹ thuật y tế vector `grid-01.svg` mờ 15% tạo cảm giác chuẩn xác, khoa học và hiện đại.
- **Đảm bảo Khả năng Đọc (A11y)**: Mọi chữ và nút thao tác được nâng lên lớp `z-10`, bảo đảm độ tương phản tối thiểu 7.0:1 (WCAG 2.1 AAA).
