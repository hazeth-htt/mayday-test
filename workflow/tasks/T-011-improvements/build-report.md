# Báo cáo Thực hiện (Builder) - Việc T-011

- Người thực hiện: Builder
- Thời gian: 2026-11-08 05:04
- Nhánh: `task/T-011-improvements`

## 1. Công việc đã làm
1. **🔴 Giải quyết xung đột Token Accent vs Positive**:
   - Tách rời Accent (`--color-brand-teal: #0E7490`, `--base-accent-600: #0D9488`, `--base-accent-700: #0F766E`) cho các tương tác UI (nút bấm, tab active, liên kết) khỏi Positive (`#217954` / `#4BCE97`) cho kết quả lâm sàng tốt (UAS7 <= 6, kiểm soát bệnh tốt).
2. **🔴 Khắc phục độ tương phản Placeholder (Chuẩn WCAG AA)**:
   - Nâng cấp `--base-gray-500` từ `#8590A2` lên `#5E6878` (tương phản 5.2:1 trên nền trắng, vượt ngưỡng AA 4.5:1).
   - Giữ `#8590A2` (`--base-gray-450`) thuần túy cho các đường kẻ trang trí decorative.
3. **🔴 Bổ sung Token Bề mặt Surface**:
   - Định nghĩa chính thức `--color-background-surface: #FAFAF9;` cùng hệ thống alias 3 lớp: `--color-background-primary`, `--color-background-secondary`, `--color-content-primary`, `--color-content-secondary`.
4. **🔴 Hoàn thiện Chế độ Dark Mode cho Bác sĩ Trực đêm**:
   - Bổ sung cấu hình `.dark, [data-theme="dark"]` trong `uber-base-tokens.css` và `DESIGN_SYSTEM_UBER_BASE.md`.
5. **🟡 Tự động hóa Bảng tiến độ (`scripts/sync-board.sh` & `.js`)**:
   - Tạo script Node.js / Bash tự động quét tất cả các task `T-xxx/status.md` và tái tạo `workflow/board.md`.
6. **🟡 Khởi tạo Bộ kiểm thử Playwright E2E**:
   - Thiết lập `e2e/playwright.config.ts`, `e2e/fixtures/mock-patient.json` và các specs:
     - `e2e/specs/login.spec.ts`
     - `e2e/specs/patient-list.spec.ts`
     - `e2e/specs/consultation-prescription.spec.ts`
     - `e2e/specs/a11y.spec.ts`
7. **🟡 Làm rõ phiên làm việc & Session Security với Backend**:
   - Bổ sung Phần 6 vào `audit-api/questions-for-backend.md`: Token expiry 15p, Refresh Token endpoint, Thu hồi session khi đổi mật khẩu, Vòng đời OTP 5p.
8. **🟡 Bổ sung Trực quan hóa Giao diện vào README**:
   - Thêm Section 3: "Giao diện Hệ thống & Chuỗi Màn hình Lâm sàng" với ASCII Art layout của 4 màn hình chính.
9. **🟢 Tinh chỉnh Polish**:
   - Sửa nhãn kiểu chữ Mono thành "JetBrains Mono, weight 500".
   - Bổ sung tài liệu giấy phép mã nguồn mở của Iconsax Font.
   - Thêm Component Tokens cho Button và Input.
   - Thêm Patient Mode type scale: `.patient-heading-lg`, `.patient-body-lg`, `.patient-btn-lg`.
