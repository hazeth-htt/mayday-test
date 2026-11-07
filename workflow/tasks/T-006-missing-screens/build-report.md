# Báo cáo Thực hiện (Builder) - Việc T-006

- Người thực hiện: Builder
- Thời gian: 2026-11-08 03:50
- Nhánh: `task/T-006-missing-screens`

## 1. Công việc đã làm
1. **Xây dựng màn hình Lịch sử ca khám (`PatientRecordsComponent`)**:
   - Đường dẫn: `/patient/records` (Lazy loaded component).
   - Tệp mã: `src/app/pages/drmayday/patient/patient-records/patient-records.component.{ts,html,spec.ts}`.
   - Hỗ trợ 3 bộ lọc theo đặc tả: Tất cả ca khám, Mày đay mạn tính (CSU), Mày đay cấp tính.
   - Định dạng mã hồ sơ chuẩn bệnh viện: `BA-2026-xxxx`.
   - Huy hiệu phân loại mạn/cấp có màu sắc chuẩn Base tokens (`status.negative` và `accent.blue`).
   - Modal xem đơn thuốc điện tử chuẩn Bộ Y Tế: tên hoạt chất (Fexofenadine, Levocetirizine, Cetirizine), liều dùng, hướng dẫn cách uống và số ngày dùng.
2. **Cập nhật Điều hướng Bệnh nhân**:
   - Thêm "Lịch sử ca khám" với icon `document-text` chuẩn Iconsax vào `PATIENT_NAV` trong `app-sidebar.component.ts`.
3. **Cập nhật Định tuyến (`app.routes.ts`)**:
   - Đăng ký route `patient/records` có guard `authGuard` và quyền `patient`.
4. **Kiểm thử tự động**:
   - Viết 3 ca kiểm thử: Khởi tạo component và tải danh sách từ `PatientApiService`, lọc danh sách theo thể bệnh mạn tính / cấp tính, mở modal xem chi tiết đơn thuốc.
   - Toàn bộ 27/27 unit tests chạy thành công.
   - Quét bundle `npm run scan:bundle` đạt 0 chuỗi cấm.

## 2. Danh sách tệp đã thay đổi / tạo mới
- Mới: `src/app/pages/drmayday/patient/patient-records/patient-records.component.ts`
- Mới: `src/app/pages/drmayday/patient/patient-records/patient-records.component.html`
- Mới: `src/app/pages/drmayday/patient/patient-records/patient-records.component.spec.ts`
- Sửa: `src/api/types/medical-record.types.ts` (thêm trường `diagnosis?: string`)
- Sửa: `src/app/app.routes.ts` (thêm route `/patient/records`)
- Sửa: `src/app/shared/layout/app-sidebar/app-sidebar.component.ts` (thêm menu item)
