# QUY CHUẨN UBER BASE DESIGN SYSTEM & ICONOGRAPHY — DRMAYDAY
*Đặc tả kỹ thuật thiết kế giao diện cho Đội ngũ Frontend & Designer*

---

## 1. Nguyên tắc cốt lõi
1. **Tuyệt đối tuân thủ Uber Base Design System (base.uber.com)**:
   - Toàn bộ màu sắc, typography, kích thước, bo góc sử dụng token tại `src/app/core/design-system/uber-base-tokens.css`.
   - Không được phép tự ý sinh mã màu hex tự do (hardcoded `#...`) trong HTML hoặc component styles.
2. **Hệ thống Biểu tượng Vector Độc quyền (Iconsax Font)**:
   - 895 biểu tượng vector đồng nhất.
   - Trạng thái thông thường: `<span class="isax icon-..."></span>`.
   - Trạng thái active/hover/bold: `<span class="isax-b icon-..."></span>`.
   - Tuyệt đối không dùng icon rời rạc bên ngoài (FontAwesome, Material Icons, Bootstrap Icons) để giữ tính đồng bộ cấp viện.
3. **Kỷ luật thương hiệu (Zero External Branding)**:
   - Không sử dụng logo, watermark hay nhận diện của bên thứ ba.
   - Thể hiện sự tôn nghiêm, tin cậy của Đề tài Nghiên cứu Khoa học Bệnh viện Da liễu Trung ương.

---

## 2. Hệ thống Token Semantic chuẩn
- **Nền & Bề mặt (Background)**:
  - `--color-background-primary`: `#FFFFFF`
  - `--color-background-secondary`: `#F6F6F6`
  - `--color-background-tertiary`: `#E2E2E2`
- **Nội dung & Văn bản (Content)**:
  - `--color-content-primary`: `#000000`
  - `--color-content-secondary`: `#545454`
  - `--color-content-tertiary`: `#757575`
- **Đường viền (Border)**:
  - `--color-border-opaque`: `#E2E2E2`
  - `--color-border-selected`: `#000000`
- **Trạng thái & Y tế (Status)**:
  - `--color-status-negative` (Cảnh báo đỏ phản vệ, ngứa nặng): `#E11900`
  - `--color-status-warning` (Mức độ trung bình, lưu ý): `#FFC043`
  - `--color-status-positive` (Kiểm soát tốt, khỏi bệnh): `#048848`
  - `--color-accent-blue` (Điểm nhấn y tế, chủ đạo): `#276EF1`

---

## 3. Mật độ hiển thị kép (Dual-Density System)
- **Mật độ Thoáng (Patient Spacious)**:
  - Dành cho Bệnh nhân: Font chữ lớn (`text-base`, `text-lg`), khoảng cách đệm rộng (`p-6`, `gap-4`), nút bấm cao tối thiểu 48px hỗ trợ người lớn tuổi và thao tác chạm cảm ứng di động.
- **Mật độ Gọn (Clinician Compact)**:
  - Dành cho Bác sĩ & Quản trị viên: Font chữ cô đọng (`text-sm`, `text-xs`), khoảng cách đệm hẹp (`p-3`, `gap-2`), tối ưu hóa hiển thị tối đa dữ liệu trên một màn hình làm việc mà không cần cuộn trang nhiều.
