# T-002: Chuyển đổi Lazy-Loading toàn bộ Route, Cô lập phân hệ & Trang 403 Forbidden

## Mục tiêu
Tái cấu trúc toàn bộ định tuyến `app.routes.ts` sang cơ chế `loadComponent: () => import(...)` độc lập. Đảm bảo bundle tải của Bệnh nhân không chứa mã nguồn của Bác sĩ hay Quản trị viên. Xây dựng trang cảnh báo 403 (`ForbiddenComponent`) thân thiện chuẩn Uber Base.

## Căn cứ
- Bản sắc thiết kế: `workflow/design/direction.md`.
- Đặc tả phân quyền: `DATA_DICTIONARY_SPECIFICATION_v2.0` và `from hospital/`.
- Tiêu chuẩn Angular Architecture: Standalone component lazy loading.

## Phạm vi
Được sửa:
- `admin_template/src/app/app.routes.ts`
- `admin_template/src/app/core/guards/auth.guard.ts`
- `admin_template/src/app/pages/other-page/forbidden/**` (tạo mới trang 403)
- File test liên quan

## Tiêu chí nghiệm thu (AC)
- AC-1: Tất cả các route trong `app.routes.ts` đều dùng `loadComponent: () => import(...)`. Không còn bất kỳ component trang nào được import tĩnh ở đầu file.
- AC-2: Khi chạy `ng build --configuration production`, Angular sinh ra các lazy chunk riêng biệt cho từng phân hệ (vd: `chunk-patient-...`, `chunk-doctor-...`, `chunk-admin-...`).
- AC-3: Tạo mới màn hình `ForbiddenComponent` tại route `/forbidden` (hoặc chặn tại guard chuyển hướng đến `/forbidden`), giao diện chuẩn Base Web, thông báo tiếng Việt không dùng mã kỹ thuật ("Bạn không có quyền truy cập khu vực chuyên môn này").
- AC-4: `authGuard` hoạt động chặt chẽ: Khi tài khoản vai trò Bệnh nhân cố tình nhập URL `/doctor/queue` hoặc `/admin/dashboard`, hệ thống chuyển hướng ngay sang `/forbidden` kèm nút "Quay lại trang của bạn".
- AC-5: Viết unit test kiểm thử route guard và khả năng chuyển hướng 403.
- AC-6: Build production và typecheck xanh 100%.
