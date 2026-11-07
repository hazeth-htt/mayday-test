# Báo cáo thực hiện: T-002 (Vòng 1)

## Đã làm theo từng AC
- **AC-1: Toàn bộ route dùng `loadComponent: () => import(...)`**
  - Đã tái cấu trúc toàn diện `app.routes.ts`: Xóa bỏ 100% các import tĩnh của 15 page components.
  - Áp dụng `loadComponent: () => import(...).then(m => m.Component)` cho toàn bộ routes.
- **AC-2: Phân tách lazy chunks độc lập**
  - Chạy `npm run build:prod`: Sinh ra các chunk độc lập (`consultation-component`, `form-builder-component`, `topology-component`, `waiting-queue-component`, `patient-home-component`, v.v.).
  - Dung lượng `main.js` giảm mạnh từ 856 kB xuống còn **228 kB** (giảm gần 75% tải ban đầu).
- **AC-3: Màn hình 403 Forbidden chuẩn Base Web**
  - Tạo mới `ForbiddenComponent` tại `src/app/pages/other-page/forbidden/` và route `/forbidden`.
  - Thiết kế chuẩn Uber Base (`design-spec.md`): Tiêu đề tiếng Việt y tế "Khu Vực Giới Hạn Chuyên Môn", icon khiên bảo mật, hộp hiển thị chức danh tài khoản hiện tại, nút quay về trang phù hợp với vai trò.
- **AC-4: `authGuard` chuyển hướng 403**
  - Cập nhật `auth.guard.ts`: Khi vai trò hoặc quyền không khớp, chuyển hướng thẳng sang `/forbidden` thay vì redirect im lặng.
- **AC-5: Unit test**
  - Đã viết 4 test cases kiểm thử độc lập cho `auth.guard.spec.ts`.
  - Tổng số unit tests tăng lên 14/14 PASS.
- **AC-6: Build & scan**
  - Build production thành công 100%. `npm run scan:bundle` xanh 100% trên cả 33 lazy chunk files.

## Lệnh đã chạy và kết quả
| Lệnh | Kết quả |
|---|---|
| `npm test -- --watch=false --browsers=ChromeHeadless` | 14 passed, 0 failed |
| `npm run build:prod` | Thành công trong 4.9s, main.js giảm còn 228 kB |
| `npm run scan:bundle` | 0 chuỗi cấm trên 33 tệp production |
