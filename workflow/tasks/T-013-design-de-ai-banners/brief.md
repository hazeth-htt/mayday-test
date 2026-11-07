# Đề bài (Brief) - Việc T-013

- Tên việc: Loại bỏ khuôn mẫu giao diện AI (De-AI Banners & Rounded Pill Tags), lồng ảnh asset y khoa sinh động
- Phân hệ: UI/UX & Design System
- Căn cứ phản hồi người dùng:
  - "style kiểu này sặc mùi AI (bỏ tất cả các kiểu title nhỏ xong bo vào trong thẻ tròn như dòng 'Bệnh viện da liệu...' như kia, lồng thềm ảnh asset vào nền cho sinh động"
  - Hình ảnh phản hồi: Banner Quản trị với thẻ tròn bo tròn (`inline-flex items-center gap-2 rounded-full bg-white/10 ...`) và nền phẳng đơn điệu.
- Phạm vi thực hiện:
  1. Loại bỏ 100% các thẻ tròn/pill badge kiểu AI (`inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs ...`) trên các banner chính:
     - Admin Dashboard (`admin-dashboard.component.html`)
     - Phiếu khai thác bệnh sử (`dynamic-intake.component.html`)
     - Sàng lọc khẩn cấp (`emergency-screening.component.html`)
     - Kho ảnh tổn thương (`lesion-tracker.component.html`)
     - Cổng bệnh nhân (`patient-home.component.html`)
     - Hồ sơ bệnh nhân (`patient-profile.component.html`)
     - Nhật ký UAS7 (`uas7-scoring.component.html`)
     - Màn đăng nhập, đăng ký, quên mật khẩu (`login.component.html`, `register.component.html`, `forgot-password.component.html`)
     - Trang Design System Showcase (`design-system-showcase.component.html`)
  2. Nâng cấp `.base-banner-dark` trong `uber-base-tokens.css`:
     - Chuyển từ màu xám phẳng sang dải Gradient sâu của thương hiệu DrMayDay: `#091F5B` (Brand Navy) &rarr; `#153275` &rarr; `#3B63A8` (Clinical Royal Blue).
  3. Lồng ghép hình ảnh tư liệu lâm sàng thực tế (`/images/clinic/*`) và họa tiết lưới kỹ thuật y tế (`/images/shape/grid-01.svg`):
     - Hòa trộn mềm mại (mix-blend luminosity, gradient masking) vào hậu cảnh banner, tạo chiều sâu thị giác chuyên nghiệp, chân thực và chuẩn mực hệ thống y tế thực tế.
- Tiêu chí nghiệm thu:
  - Không còn bất kỳ thẻ pill tròn generic AI nào xuất hiện trên đầu tiêu đề.
  - Các banner có ảnh asset y khoa hòa trộn tinh tế, có chiều sâu, tương phản đạt chuẩn WCAG 2.1 AAA.
  - Kiểm thử `npm test` (37/37 tests PASS), `npx tsc --noEmit` và `npm run build:prod && npm run scan:bundle` đạt 100% PASS.
