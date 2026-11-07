# Báo cáo thực hiện: T-005 (Vòng 1)

## Đã làm theo từng AC
- **AC-1: Bổ sung method `resetPassword` vào `AuthApiService`**
  - Đã thêm method `resetPassword` gọi endpoint `auth/reset_password` với body `{ phone, otp, new_password, confirm_password }`.
- **AC-2: Màn hình `/forgot-password` luồng 2 bước**
  - Step 1: Nhập số điện thoại 10 số &rarr; Gửi mã OTP.
  - Step 2: Nhập mã OTP 6 số + Mật khẩu mới + Xác nhận mật khẩu.
  - Step 3: Màn hình thông báo đổi mật khẩu hoàn tất & nút Đăng Nhập Ngay.
- **AC-3: Kiểm tra hợp lệ client-side**
  - Regex SĐT Việt Nam `/^(03|05|07|08|09)\d{8}$/`.
  - Mật khẩu mới tối thiểu 6 ký tự.
  - Kiểm tra mật khẩu xác nhận trùng khớp 100%.
- **AC-4: Thông báo thành công và điều hướng**
  - Có step 3 hiển thị thông báo y tế thành công, liên kết về `/login`.
- **AC-5: Thiết kế chuẩn Uber Base**
  - Tuân thủ `design-spec.md`, nút bấm Base Web, inputBase, icon Iconsax.
- **AC-6: Unit test**
  - 4 test cases trong `forgot-password.component.spec.ts`.
  - Tổng số test cases toàn dự án: 25/25 PASS.
- **AC-7: Build & scan**
  - `forgot-password-component` tách thành lazy chunk riêng (12 kB). Quét 35 production files sạch 100%.

## Lệnh đã chạy và kết quả
| Lệnh | Kết quả |
|---|---|
| `npm test -- --watch=false --browsers=ChromeHeadless` | 25 passed, 0 failed |
| `npm run build:prod` | Thành công trong 3.9s |
| `npm run scan:bundle` | 0 chuỗi cấm trên 35 files |
