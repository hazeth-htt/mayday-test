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

## 2. Hệ thống Token Semantic chuẩn DrMayDay (Bộ Y Tế)
- **Bảng màu nhận diện thương hiệu DrMayDay**:
  - `--base-brand-navy`: `#091F5B` (Brand Navy Blue - Logo, header, tiêu đề chính, độ tương phản 13.5:1 đạt AAA)
  - `--base-brand-blue` / `--color-accent-blue`: `#3B63A8` (Clinical Royal Blue - Accent tương tác chính, nút hành động)
  - `--base-brand-sky`: `#6F96D1` (Soft Sky Blue - Viền hover, biểu đồ, icon phụ trợ)
  - `--base-brand-tint`: `#BAD6EB` (Light Tint Blue - Nền badge, card active, selection)
  - `--base-bg-canvas`: `#F6F6F6` (Clean Medical Neutral Canvas - Nền trang ứng dụng)
- **Nền & Bề mặt (Background)**:
  - `--color-background-primary`: `#FFFFFF`
  - `--color-background-secondary`: `#F6F6F6`
  - `--color-background-surface`: `#FAFAF9`
- **Nội dung & Văn bản (Content)**:
  - `--color-content-primary`: `#091E42` (Hoặc `#091F5B`)
  - `--color-content-secondary`: `#475467`
  - `--color-content-tertiary`: `#5E6878` (WCAG AA 5.2:1)
- **Trạng thái & Y tế (Status)**:
  - `--color-status-negative` (Cảnh báo đỏ phản vệ, ngứa nặng): `#EF5C48` / `#B42318`
  - `--color-status-warning` (Mức độ trung bình, lưu ý): `#F5CD47` / `#8A5309`
  - `--color-status-positive` (Kiểm soát tốt UAS7, khỏi bệnh): `#4BCE97` / `#217954`
- **Logo chính thức**:
  - `public/images/logo/drmayday-logo.png` (Navy `#091F5B` trên nền trong suốt cho Light Mode)
  - `public/images/logo/drmayday-logo-white.png` (Trắng trên nền trong suốt cho Dark Mode)

---

## 3. Mật độ hiển thị kép (Dual-Density System)
- **Mật độ Thoáng (Patient Spacious)**:
  - Dành cho Bệnh nhân: Font chữ lớn (`text-base`, `text-lg`), khoảng cách đệm rộng (`p-6`, `gap-4`), nút bấm cao tối thiểu 48px hỗ trợ người lớn tuổi và thao tác chạm cảm ứng di động.
- **Mật độ Gọn (Clinician Compact)**:
  - Dành cho Bác sĩ & Quản trị viên: Font chữ cô đọng (`text-sm`, `text-xs`), khoảng cách đệm hẹp (`p-3`, `gap-2`), tối ưu hóa hiển thị tối đa dữ liệu trên một màn hình làm việc mà không cần cuộn trang nhiều.
