# T-003: Global Error Handler & Dịch vụ ghi log y tế Zero-PII

## Mục tiêu
Xây dựng bộ xử lý lỗi tập trung `GlobalErrorHandler` implements `ErrorHandler` của Angular để bắt mọi lỗi runtime chưa xử lý. Tích hợp `LoggingService` có cơ chế tự động che mờ (redact) 100% thông tin định danh cá nhân y tế (PII: Số điện thoại, CCCD, Mã thẻ BHYT, Mật khẩu, Token) trước khi ghi log hoặc gửi về máy chủ giám sát.

## Căn cứ
- Tiêu chuẩn bảo mật y tế: Quyền riêng tư dữ liệu sức khỏe (Zero-PII).
- Mục 6 trong `release/02-readiness-gap.md`.
- `DATA_DICTIONARY_SPECIFICATION_v2.0`.

## Phạm vi
- `admin_template/src/app/core/services/logging.service.ts`
- `admin_template/src/app/core/errors/global-error-handler.ts`
- `admin_template/src/app/app.config.ts`
- File tests liên quan

## Tiêu chí nghiệm thu (AC)
- AC-1: Tạo `LoggingService` với hàm `sanitize(payload: any): any` tự động che mờ SĐT Việt Nam (chỉ giữ 2 số đầu và 2 số cuối), mã thẻ BHYT 15 ký tự, token Authorization Bearer.
- AC-2: Tạo `GlobalErrorHandler` implements `ErrorHandler` bắt toàn bộ lỗi runtime chưa xử lý trong ứng dụng Angular.
- AC-3: Đăng ký `{ provide: ErrorHandler, useClass: GlobalErrorHandler }` vào `appConfig` trong `app.config.ts`.
- AC-4: Viết unit test chứng minh các chuỗi nhạy cảm (SĐT, BHYT, token) được che mờ hoàn toàn khi ghi log.
- AC-5: Build production và typecheck xanh 100%.
