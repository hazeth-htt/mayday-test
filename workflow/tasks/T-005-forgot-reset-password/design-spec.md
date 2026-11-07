# Đặc tả thiết kế: T-005 Màn hình Quên & Đặt lại mật khẩu

## Căn cứ
- Bản sắc: `workflow/design/direction.md` (Mục 2 - Trấn an & An toàn nhận thức).

## Bố cục và thứ bậc thông tin
- Thiết kế layout đồng bộ màn Đăng nhập (2 cột trên Desktop: Cột trái giới thiệu Bệnh viện Da liễu TW, Cột phải form nhập liệu).
- Step indicator 2 bước rõ ràng:
  - Bước 1: Xác nhận số điện thoại
  - Bước 2: Nhập OTP & Đặt lại mật khẩu
- Trạng thái thành công: Icon tích xanh lớn (`.isax-b.icon-tick-circle text-4xl text-[var(--base-positive-primary)]`), thông báo chúc mừng và nút "Đăng Nhập Ngay".
- Liên kết quay lại: `<a routerLink="/login">` với icon mũi tên trái.

## Tiêu chí thiết kế kiểm được (AC-D)
AC-D1. Nút "Gửi mã OTP" và "Xác nhận đổi mật khẩu" khóa khi đang gọi API để chống bấm trùng.
AC-D2. Ô nhập OTP có thuộc tính `inputmode="numeric"`, `maxlength="6"`.
AC-D3. Không có giá trị màu/khoảng cách ngoài bộ token `uber-base-tokens.css`.
