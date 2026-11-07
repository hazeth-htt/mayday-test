# T-005: Luồng Quên & Đặt lại mật khẩu với xác thực OTP

## Mục tiêu
Xây dựng trọn vẹn màn hình Quên mật khẩu và Đặt lại mật khẩu (`/forgot-password`) theo đúng đặc tả API 14 (`auth/forgot_password`) và API 15 (`auth/reset_password`) trong `api-spec/api_spec.csv`. Luồng 2 bước mượt mà: Nhập SĐT &rarr; Nhận mã OTP &rarr; Đặt mật khẩu mới an toàn.

## Căn cứ
- Hợp đồng API: `api-spec/api_spec.csv:20` (API 14 & 15).
- Mã lỗi y tế: `lib/errors/error-codes.ts` (mã 3008, 3009).
- Bản sắc thiết kế: `workflow/design/direction.md`.

## Phạm vi
- `admin_template/src/api/services/auth/auth-api.service.ts`
- `admin_template/src/app/pages/auth/forgot-password/**`
- `admin_template/src/app/app.routes.ts`
- File tests liên quan

## Tiêu chí nghiệm thu (AC)
- AC-1: Bổ sung method `resetPassword` vào `AuthApiService`.
- AC-2: Màn hình `/forgot-password` hỗ trợ Step 1 (Gửi mã OTP qua SĐT 10 số VN) và Step 2 (Nhập OTP 6 số + Mật khẩu mới tối thiểu 6 ký tự + Xác nhận mật khẩu).
- AC-3: Kiểm tra hợp lệ client-side: SĐT chuẩn regex VN, OTP không rỗng, mật khẩu xác nhận phải khớp 100% với mật khẩu mới.
- AC-4: Xử lý thông báo thành công và chuyển hướng về `/login` sau khi đổi mật khẩu thành công.
- AC-5: Thiết kế chuẩn Uber Base (`design-spec.md`), có nút quay lại màn đăng nhập.
- AC-6: Viết unit test cho component quên mật khẩu.
- AC-7: Build production và typecheck xanh 100%.
