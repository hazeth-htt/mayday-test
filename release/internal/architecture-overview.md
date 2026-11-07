# KIẾN TRÚC KỸ THUẬT HỆ THỐNG — DRMAYDAY FRONTEND
*Tài liệu nội bộ dành cho Kỹ sư Phát triển & Vận hành (Staff & DevOps Engineers)*

---

## 1. Tổng quan Công nghệ
- **Framework**: Angular 21 (Standalone Components, Signals & Computed Reactivity, New Control Flow `@if`, `@for`, `@switch`).
- **Styling Architecture**: Uber Base Design System (base.uber.com) kết hợp Tailwind CSS engine. Toàn bộ thông số màu sắc, khoảng cách, bo góc tuân thủ token semantic tại `src/app/core/design-system/uber-base-tokens.css`.
- **Iconography**: Iconsax Vector Font System (895 biểu tượng y tế và điều hướng đồng bộ).
- **TypeScript**: Chế độ Strict Mode đạt 100% không cảnh báo lỗi type.

---

## 2. Kiến trúc Phân vùng & Tối ưu Bundle (Lazy-Loading)
Hệ thống loại bỏ hoàn toàn việc nạp đồng loạt tất cả các module vào một gói ban đầu:
- **Core Bundle ban đầu (`main.js`)**: ~235 kB (transfer: ~57 kB), chỉ chứa mã thiết yếu của ứng dụng (Router, Guards, Core Providers, Design Tokens).
- **Phân tách Lazy Chunks theo vai trò và chức năng**:
  - `consultation-component`: 26 kB (chỉ nạp khi Bác sĩ mở khám bệnh).
  - `patient-records-component`: 14 kB (chỉ nạp khi Bệnh nhân mở lịch sử ca khám).
  - `form-builder-component`: 23 kB (chỉ nạp khi Quản trị viên truy cập cấu hình biểu mẫu).
  - `uas7-scoring-component`: 13 kB (chỉ nạp khi Bệnh nhân chấm điểm UAS7).
  - `forgot-password-component`: 12 kB (chỉ nạp khi người dùng yêu cầu khôi phục mật khẩu).

---

## 3. Hệ thống Bảo mật & Kiểm soát Ranh giới (Boundary Control)
1. **Phân quyền Route (`authGuard`)**:
   - Kiểm tra trạng thái xác thực và vai trò người dùng (`role`).
   - Nếu người dùng truy cập trái thẩm quyền (ví dụ: Bệnh nhân cố vào route Admin), hệ thống không chuyển hướng về trang chủ một cách mập mờ mà chặn đứng tại màn hình 403 chuyên biệt `/forbidden`.
2. **Khóa an toàn phiên làm việc (`IdleTimeoutService`)**:
   - Theo dõi sự kiện người dùng (`mousemove`, `keydown`, `click`, `scroll`).
   - Tự động cảnh báo đếm ngược 60s sau 14 phút không hoạt động và tự động đăng xuất sau 15 phút đối với Bác sĩ và Quản trị viên.
3. **Cách ly Công cụ Nội bộ & Tài liệu Mẫu (`internalDevGuard`)**:
   - Design System Hub (`/internal/design-system`) và công cụ thử nghiệm được cô lập hoàn toàn, chỉ cho phép truy cập khi biến môi trường `production === false` và có cờ dev bí mật.
4. **Bảo mật Dữ liệu Riêng tư Cá nhân (Zero-PII Compliance)**:
   - `LoggingService` và `GlobalErrorHandler` tích hợp bộ lọc Regex tự động thay thế số điện thoại, số thẻ BHYT 15 ký tự, Bearer Token và mật khẩu bằng chuỗi ẩn danh `[REDACTED]`.
   - Script quét an ninh độc lập `scripts/scan-bundle.js` chạy kiểm tra tự động trên toàn bộ file sinh ra trong thư mục `dist/` để ngăn chặn rò rỉ chuỗi cấm.

---

## 4. Cơ chế Thay thế Tệp Build (File Replacements)
Trong `angular.json`, khi biên dịch ở chế độ production (`--configuration production`):
- `http-interceptors.provider.ts` được thay thế bằng `http-interceptors.provider.prod.ts` (loại bỏ hoàn toàn Mock DB, Interceptor mock ra khỏi gói production).
- `login-dev-tools.component.ts` được thay thế bằng `login-dev-tools.component.prod.ts` (loại bỏ toàn bộ các nút tài khoản mẫu, thông tin đăng nhập tự động).
