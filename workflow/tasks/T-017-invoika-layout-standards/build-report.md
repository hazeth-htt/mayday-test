# Báo Cáo Thực Hiện (Build Report) - Việc T-017

- Người thực hiện: Builder (Antigravity)
- Ngày hoàn thành: 2026-11-08
- Nhánh công việc: `task/T-017-invoika-layout-standards`

## 1. Tóm Tắt Nhiệm Vụ
Chuẩn hóa kiến trúc Design System của dự án y tế **DrMayDay** theo mẫu bố cục trang Dashboard Invoika (Khối Card phân tách Header/Body/Footer, List Groups chuẩn mực, Page Title Box với Breadcrumb điều hướng phân cấp) trong khi bảo tồn 100% các giá trị cốt lõi:
- Giữ nguyên bộ 5 màu sắc thương hiệu (`#091F5B`, `#3B63A8`, `#6F96D1`, `#BAD6EB`, `#FFFFFF`).
- Giữ nguyên logo chính thức DrMayDay và toàn bộ asset ảnh y khoa.
- Sử dụng độc quyền font vector Iconsax (`.isax` / `.isax-b`).
- Giữ nguyên toàn bộ logic tính toán lâm sàng (UAS7, AAS7, WAO 2020) và model API.

## 2. Chi Tiết Các Hạng Mục Đã Thực Hiện

### A. Chuẩn Hóa Tokens & Molecules Trong `uber-base-tokens.css`
1. **Khối Card Kiến Trúc Phân Tách (Structured Cards)**:
   - `.base-card-header`: Padding `14px 20px`, đường kẻ phân cách dưới `1px solid var(--base-border-opaque)`, hiển thị flex hai đầu.
   - `.base-card-title`: Kích thước `15px`, `font-weight: 700`, sắc xanh nhận diện Deep Brand Navy `#091F5B` (`letter-spacing: -0.01em`). Hỗ trợ Dark Mode.
   - `.base-card-body`: Padding tiêu chuẩn `20px`.
   - `.base-card-footer`: Padding `12px 20px`, viền trên `1px solid var(--base-border-opaque)`, nền phụ `var(--base-bg-surface-alt)`.
2. **Bộ Lớp Danh Sách Chuyên Nghiệp (List Groups)**:
   - `.base-list-group`: Khối chứa danh sách, bo tròn theo `var(--base-radius-300)`, viền bao `1px solid var(--base-border-opaque)`.
   - `.base-list-group-flush`: Biến thể phẳng triệt tiêu viền ngoài và bo góc ngoài, chỉ giữ đường kẻ giữa các item.
   - `.base-list-group-item`: Hiển thị flex, padding `12px 16px`, đường phân cách dưới 1px.
   - `.base-list-group-item-action`: Hỗ trợ hover êm dịu và trạng thái active với thanh chỉ thị bên trái màu Royal Blue (`border-l-4 border-[var(--base-brand-blue)]`).
3. **Khung Tiêu Đề Trang & Breadcrumb (Page Title Box)**:
   - `.base-page-title-box`: Bố cục chia hai vế: tiêu đề trang và mô tả bên trái; Breadcrumb phân cấp và công cụ thao tác nhanh bên phải.
   - `.base-breadcrumb`, `.base-breadcrumb-item`, `.base-breadcrumb-separator`: Hệ thống Breadcrumb thanh thoát, hiển thị vị trí phân cấp rõ ràng trên toàn hệ thống.

### B. Áp Dụng Thực Tế Lên Các Màn Hình Ứng Dụng
1. **Cổng Người bệnh (`patient/`)**:
   - `patient-home`: Áp dụng `.base-page-title-box` cho tiêu đề chào hỏi; chuyển khối Biểu đồ cột UAS7 7 ngày sang chuẩn cấu trúc `.base-card-header` và `.base-card-body`.
   - `patient-records`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Trang chủ > Hồ sơ bệnh án`.
   - `emergency-screening`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Trang chủ > Sàng lọc khẩn cấp`.
   - `dynamic-intake`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Trang chủ > Khai thác bệnh sử`.
   - `lesion-tracker`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Trang chủ > Ảnh tổn thương 3 mốc`.
   - `patient-profile`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Trang chủ > Hồ sơ cá nhân`.
   - `uas7-scoring`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Trang chủ > Chấm điểm UAS7`.
2. **Phân hệ Bác sĩ (`doctor/`)**:
   - `waiting-queue`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Phân hệ Bác sĩ > Hàng đợi khám` và thanh tìm kiếm/nút tiếp nhận.
   - `consultation`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Hàng đợi khám > Khám bệnh án`.
3. **Phân hệ Quản trị (`admin/`)**:
   - `admin-dashboard`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Quản trị > Bảng điều khiển`; cấu trúc lại bảng ca khám gần nhất với `.base-card-header` và `.base-card-body`.
   - `topology`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Quản trị > Cơ cấu tổ chức`.
   - `rbac-matrix`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Quản trị > Phân quyền vai trò`.
   - `form-builder`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Quản trị > Biểu mẫu y tế động`.
   - `user-staff`: Áp dụng `.base-page-title-box` kèm Breadcrumb `Quản trị > Nhân sự y tế`.
