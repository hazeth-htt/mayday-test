# Đề bài (Brief) - Việc T-011

- Tên việc: Triển khai toàn bộ gói cải tiến chất lượng hệ thống DrMayDay (Design Tokens, A11y, Dark Mode, CI/CD, E2E & Automation)
- Mục tiêu:
  1. **🔴 Ưu tiên cao**:
     - Phân tách dứt khoát Token Accent (`--color-brand-teal: #0E7490`, `--base-accent-...: #0D9488`) khỏi Positive (`#217954` / `#4BCE97`) để loại bỏ xung đột ý nghĩa lâm sàng giữa tương tác UI và kết quả khám tốt.
     - Nâng cấp độ tương phản placeholder và text phụ từ `#8590A2` lên `#5E6878` (tương phản 5.2:1, vượt chuẩn WCAG AA).
     - Định nghĩa đầy đủ `backgroundSurface` token: `--color-background-surface: #FAFAF9;` và các alias semantic 3 lớp.
     - Thiết lập hệ thống Dark Mode tokens (`[data-theme="dark"]`) phục vụ ca trực đêm của Bác sĩ.
  2. **🟡 Ưu tiên trung bình**:
     - Đảm bảo CI pipeline chạy kiểm tra scan bundle an ninh trên mọi build.
     - Khởi tạo bộ khung Playwright E2E kiểm thử các luồng lâm sàng cốt lõi (`login`, `patient-list`, `consultation-prescription`).
     - Tự động hóa cập nhật `board.md` qua `scripts/sync-board.sh`.
     - Thêm mô tả trực quan và hướng dẫn hình ảnh vào `README.md`.
     - Làm rõ chiến lược Session Security & Refresh Token với Backend.
     - Tích hợp kiểm tra Accessibility tự động.
  3. **🟢 Ưu tiên thấp (Polish)**:
     - Chuẩn hóa nhãn kiểu chữ Mono: "JetBrains Mono, weight 500".
     - Ghi nhận giấy phép mã nguồn mở của Iconsax Font.
     - Bổ sung Component Tokens tường minh cho Button và Input.
     - Bổ sung thang kiểu chữ & class riêng cho Patient Mode (`.patient-body-lg`, `.patient-heading-lg`).
- Tiêu chí nghiệm thu:
  - 100% tokens mới hoạt động mượt mà không làm vỡ bất kỳ component hiện hữu nào.
  - Toàn bộ unit tests và e2e specs hợp lệ.
  - `npx tsc --noEmit` đạt 0 lỗi.
  - `npm run build:prod` và `npm run scan:bundle` đạt 100% PASS.
