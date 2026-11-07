# Đề bài (Brief) - Việc T-017

- Tên việc: Chuẩn hóa kiến trúc Design System theo quy chuẩn Invoika Dashboard (Borders, Card Header/Body, List Groups, Page Title Box, Flush Lists)
- Phân hệ: UI/UX & Design System Architecture
- Yêu cầu người dùng:
  - "tạo promt tự thực hiện để chỉnh sửa design system theo thiết kế này (bao gồm rule, border...) tuy nhiên không sửa các cốt lõi như màu sắc, logo, asset" -> "tự thực hiện theo rule"
- Ràng buộc bất biến (Hard Constraints):
  - Tuyệt đối không thay đổi bộ 5 màu cốt lõi: `#091F5B` (Deep Brand Navy), `#3B63A8` (Royal Blue), `#6F96D1` (Soft Sky), `#BAD6EB` (Light Tint), `#FFFFFF` (Pure White Canvas).
  - Giữ nguyên logo DrMayDay chính thức (Light/Dark) và toàn bộ kho asset ảnh lâm sàng.
  - Sử dụng độc quyền font vector Iconsax (`.isax` / `.isax-b`).
  - Giữ nguyên toàn bộ logic tính toán lâm sàng (UAS7, AAS7, WAO 2020) và API models.
- Mục tiêu kiến trúc:
  1. Bổ sung các chuẩn thiết kế từ Invoika vào `uber-base-tokens.css`:
     - Phân định rõ ràng `.base-card-header` (có border phân cách dưới `border-b border-[var(--base-border-opaque)]`, padding `16px 20px`, tiêu đề bên trái và công cụ/badge bên phải), `.base-card-title`, `.base-card-body` (padding `20px`), `.base-card-footer`.
     - Bộ lớp danh sách chuyên nghiệp: `.base-list-group`, `.base-list-group-item`, `.base-list-group-item-action`, `.base-list-group-flush`, `.base-list-check`.
     - Khung tiêu đề trang có Breadcrumbs: `.base-page-title-box`, `.base-breadcrumb`, `.base-breadcrumb-item`.
  2. Áp dụng chuẩn hóa này lên các màn hình giao diện chính:
     - `patient-home`: Chuẩn hóa card biểu đồ UAS7 7 ngày với `.base-card-header` + `.base-card-body`.
     - `patient-records`: Áp dụng `.base-page-title-box` với Breadcrumb và chuẩn card/list.
     - `doctor/waiting-queue`: Áp dụng `.base-page-title-box` với Breadcrumb và card header chuẩn.
     - `admin-dashboard`: Chuẩn hóa tiêu đề trang và các card bảng điều khiển.
  3. Đảm bảo mọi bài kiểm tra tự động (TypeScript, Karma, Production Build, Mock Scanner) đạt 100% PASS.
