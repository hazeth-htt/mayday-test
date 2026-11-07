# T-004: Tự động khóa màn hình khi không hoạt động (Idle Timeout 15p)

## Mục tiêu
Triển khai `IdleTimeoutService` theo dõi tương tác người dùng (chuột, bàn phím, chạm) và tự động đăng xuất / khóa phiên sau 15 phút không thao tác cho Bác sĩ và Quản trị viên để bảo mật hồ sơ bệnh án EMR. Cung cấp modal đếm lùi 60 giây trước khi khóa để người dùng có thể gia hạn phiên chỉ với 1 click.

## Căn cứ
- Tiêu chuẩn bảo mật bệnh viện: Phiên làm việc trạm máy khám lâm sàng tự động khóa sau 15 phút.
- Mục 2 trong `release/02-readiness-gap.md`.
- `workflow/design/direction.md`.

## Phạm vi
- `admin_template/src/app/core/services/idle-timeout.service.ts`
- `admin_template/src/app/shared/components/idle-modal/idle-timeout-modal.component.ts`
- `admin_template/src/app/shared/layout/app-layout/app-layout.component.html`
- File tests liên quan

## Tiêu chí nghiệm thu (AC)
- AC-1: `IdleTimeoutService` lắng nghe các sự kiện `mousemove`, `keydown`, `click`, `scroll`, `touchstart` và tự động reset bộ đếm thời gian khi có thao tác.
- AC-2: Chỉ kích hoạt theo dõi khi người dùng đã đăng nhập với vai trò Bác sĩ (`doctor`) hoặc Quản trị viên (`admin`).
- AC-3: Khi còn 60 giây trước thời hạn 15 phút, hiển thị modal cảnh báo chuẩn Base Web với đồng hồ đếm lùi giây và nút "Tiếp tục làm việc".
- AC-4: Khi hết thời gian mà không có phản hồi, gọi `auth.logout()`, xóa token, chuyển hướng về `/login` với thông báo "Phiên làm việc đã tự động kết thúc để bảo mật dữ liệu y tế."
- AC-5: Viết unit test kiểm thử logic đếm lùi, reset timer và kích hoạt logout.
- AC-6: Build production và typecheck xanh 100%.
