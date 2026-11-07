# Báo cáo thực hiện: T-004 (Vòng 1)

## Đã làm theo từng AC
- **AC-1: Lắng nghe sự kiện người dùng**
  - Tạo `IdleTimeoutService` lắng nghe các sự kiện: `mousemove`, `keydown`, `click`, `scroll`, `touchstart` chạy ngoài NgZone để tối ưu hiệu năng.
- **AC-2: Kích hoạt theo vai trò**
  - Chỉ kích hoạt giám sát khi người dùng mang vai trò `doctor` hoặc `admin`. Không làm phiền bệnh nhân.
- **AC-3: Modal cảnh báo đếm lùi 60 giây**
  - Tạo `IdleTimeoutModalComponent` chuẩn Base Web (`design-spec.md`): Đồng hồ đếm lùi `00:ss`, nút "Tiếp Tục Phiên Khám" (reset bộ đếm) và nút "Đăng xuất ngay".
- **AC-4: Tự động logout khi hết thời gian**
  - Khi đếm lùi về 0, tự động gọi `auth.logout()`, thu hồi token, giải phóng listener.
- **AC-5: Unit test**
  - Viết 3 test cases với `fakeAsync` và `tick` mô phỏng tua nhanh 14 phút và 60 giây đếm lùi.
  - Tổng số test cases toàn dự án: 21/21 PASS.
- **AC-6: Build & scan**
  - Build production thành công 100%, 0 chuỗi cấm.

## Lệnh đã chạy và kết quả
| Lệnh | Kết quả |
|---|---|
| `npm test -- --watch=false --browsers=ChromeHeadless` | 21 passed, 0 failed |
| `npm run build:prod` | Thành công trong 4.5s |
| `npm run scan:bundle` | 0 chuỗi cấm |
