# Đề bài (Brief) - Việc T-007

- Tên việc: Dọn dẹp mã nguồn thừa (Template Cleanup) và chuẩn hóa kiểm tra TypeScript
- Mục tiêu:
  1. Loại bỏ toàn bộ các component mồ côi thừa từ mẫu giao diện ban đầu (TailAdmin template) không thuộc về DrMayDay (`shared/components/cards/`, `shared/components/ui-example/`, `shared/layout/generator-layout/`).
  2. Loại bỏ các trang mẫu không sử dụng (`calender`, `charts`, `dashboard`, `forms`, `invoices`, `profile`, `tables`, `ui-elements`, `blank`, `auth-pages`).
  3. Đảm bảo `npx tsc --noEmit` hoàn tất với 0 lỗi (clean TypeScript check).
  4. Đảm bảo `npm test` và `npm run build:prod` đạt 100% PASS và bundle sạch hoàn toàn.
- Tiêu chí nghiệm thu:
  - `npx tsc --noEmit` thoát với exit code 0 (không có bất kỳ lỗi TS nào).
  - Tất cả các trang lâm sàng của DrMayDay (Admin, Doctor, Patient) không bị ảnh hưởng.
  - Toàn bộ 27 unit tests PASS.
  - `scan:bundle` báo cáo PASSED.
