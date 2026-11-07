# Đề bài (Brief) - Việc T-012

- Tên việc: Cập nhật nhận diện thương hiệu DrMayDay chính thức (Logo và Bảng màu chuẩn) vào Design System
- Căn cứ:
  - Bảng màu nhận diện DrMayDay chính thức do người dùng cung cấp:
    1. `#091F5B`: Primary Brand Navy Blue (Màu sắc thương hiệu chủ đạo, tiêu đề chính, icon logo)
    2. `#3B63A8`: Clinical Royal Blue (Accent tương tác chính, nút hành động, tab đang chọn)
    3. `#6F96D1`: Soft Sky Blue (Điểm nhấn thứ cấp, viền highlight, hover trạng thái)
    4. `#BAD6EB`: Light Tint Blue (Nền nhạt badge, thẻ card active, vùng chọn)
    5. `#F6F6F6`: Base Canvas / Surface Neutral (Nền ứng dụng sạch sẽ, chuẩn y tế)
  - Logo chính thức dự án DrMayDay:
    - Logo sáng: `Frame 9.png` (Biểu tượng ống nghe y tế Navy `#091F5B` + DRMAYDAY + Slogan "Đồng hành - Tận tâm - Chia sẻ")
    - Logo tối: `Frame 10.png` (Phiên bản màu trắng thuần khiết trên nền trong suốt cho Dark Mode)
- Phạm vi thực hiện:
  - Sao chép và tổ chức tệp logo vào `admin_template/public/images/logo/drmayday-logo.png` và `drmayday-logo-white.png`.
  - Cập nhật các token trong `admin_template/src/app/core/design-system/uber-base-tokens.css`:
    - Thay thế dải Accent bằng bảng màu DrMayDay chuẩn (`#091F5B`, `#3B63A8`, `#6F96D1`, `#BAD6EB`, `#F6F6F6`).
    - Đồng bộ màu `brand-navy`, `accent-blue`, `accent-tint`, `bg-canvas`.
  - Cập nhật logo chính thức vào Sidebar (`app-sidebar`), Header, và Màn hình đăng nhập (`login.component`).
  - Cập nhật tài liệu quy chuẩn [DESIGN_SYSTEM_UBER_BASE.md](file:///Users/hazeth/BTL_CNWEB/DESIGN_SYSTEM_UBER_BASE.md) và [README.md](file:///Users/hazeth/BTL_CNWEB/README.md).
- Tiêu chí nghiệm thu:
  - Toàn bộ token chuẩn xác theo 5 mã màu: `#091F5B`, `#3B63A8`, `#6F96D1`, `#BAD6EB`, `#F6F6F6`.
  - Logo DrMayDay hiển thị sắc nét, tỉ lệ chuẩn trên cả Light Mode và Dark Mode.
  - Tuân thủ nghiêm ngặt chuẩn WCAG 2.1 AAA (độ tương phản `#091F5B` trên trắng đạt 13.5:1, vượt xa chuẩn AAA).
  - `npx tsc --noEmit`, `npm test` (27 tests PASS), `npm run build:prod` và `npm run scan:bundle` đạt 100% PASS.
