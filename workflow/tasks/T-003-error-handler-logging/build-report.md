# Báo cáo thực hiện: T-003 (Vòng 1)

## Đã làm theo từng AC
- **AC-1: LoggingService & Zero-PII sanitization**
  - Xây dựng `LoggingService` tại `src/app/core/services/logging.service.ts`.
  - Tự động nhận diện và che mờ:
    - Số điện thoại Việt Nam 10 số: `0988776655` &rarr; `098****655`
    - Số thẻ BHYT y tế 15 ký tự: `GD4010123456789` &rarr; `GD40*******6789`
    - Token xác thực HTTP: `Bearer eyJ...` &rarr; `Bearer [REDACTED_TOKEN]`
    - Các trường nhạy cảm trong object (`password`, `token`, `secret`, `auth`) thành `[REDACTED]`.
- **AC-2: GlobalErrorHandler**
  - Tạo `GlobalErrorHandler` implements `ErrorHandler` tại `src/app/core/errors/global-error-handler.ts`. Bắt mọi runtime exception chưa được xử lý và ghi log đã lọc sạch PII.
- **AC-3: Đăng ký tập trung trong appConfig**
  - Cập nhật `app.config.ts`: Cung cấp `{ provide: ErrorHandler, useClass: GlobalErrorHandler }`.
- **AC-4: Unit test Zero-PII**
  - Viết 4 ca test trong `logging.service.spec.ts`.
  - Kết quả: 18/18 test cases toàn dự án PASS.
- **AC-5: Build & scan**
  - Production build thành công, 0 chuỗi cấm.

## Lệnh đã chạy và kết quả
| Lệnh | Kết quả |
|---|---|
| `npm test -- --watch=false --browsers=ChromeHeadless` | 18 passed, 0 failed |
| `npm run build:prod` | Thành công trong 4.4s |
| `npm run scan:bundle` | 0 chuỗi cấm trên 33 files |
