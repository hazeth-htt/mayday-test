# Báo Cáo Thực Hiện (Build Report) - Việc T-015

- Người thực hiện: Builder (Antigravity)
- Ngày hoàn thành: 2026-11-08
- Nhánh công việc: `task/T-015-white-canvas-clean-cards`

## 1. Tóm Tắt Mục Tiêu
Đáp ứng chính xác phản hồi chỉ đạo của người dùng:
> "bạn sai rồi, ý tôi không phải gộp hết như vậy, ý tôi là hãy bỏ hết các kiểu là border vào xong chia khoảng trôi nổi, mà hãy đặt tất cả trên 1 nền trắng đấy, còn các ô bên trong trôi nổi o sao"

- Chuyển toàn bộ nền ứng dụng sang **NỀN TRẮNG TINH KHIẾT (`#FFFFFF`)**.
- Loại bỏ hoàn toàn kiểu khung viền bao bọc cưỡng bức toàn trang (bỏ khối bọc kín `.base-unified-surface`) và các khối banner tối màu trôi nổi giả tạo kiểu AI.
- Đặt tiêu đề trang mở rộng, thoáng đãng trực tiếp trên nền trắng với sắc xanh Deep Navy `#091F5B` và đường kẻ đáy thanh thoát.
- Để các ô/thẻ chức năng bên trong (UAS hôm nay, Tổng điểm tuần, Bệnh án gần nhất, Biểu đồ diễn tiến, Thẻ điều hướng) hiển thị độc lập (`.base-card`), tự nhiên trên nền trắng với viền mảnh 1px và bóng đổ nhẹ.

## 2. Chi Tiết Thay Đổi Mã Nguồn

### A. Hạ tầng Design System & Nền Ứng Dụng
1. `admin_template/src/styles.css`:
   - Cập nhật quy chuẩn `body`: `@apply relative font-normal font-outfit z-1 bg-white dark:bg-gray-900;` (thay vì `bg-gray-50`).
2. `admin_template/src/app/shared/layout/app-layout/app-layout.component.html`:
   - Cập nhật thẻ bọc và container chính thành `bg-white dark:bg-gray-900`.
3. `admin_template/src/app/core/design-system/uber-base-tokens.css`:
   - Token nền canvas: `--base-bg-canvas: #ffffff;`, `--color-background-secondary: #ffffff;`, `--color-background-surface: #ffffff;`.
   - Loại bỏ các class gộp khối không còn sử dụng (`.base-unified-surface`, `.base-section-flush`, `.base-metrics-strip`, `.base-alert-flush`).
   - Tinh chỉnh `.base-card` đạt độ tương phản và viền mảnh sắc nét trên nền trắng.

### B. Tái cấu trúc Giao diện các Màn hình

1. **Trang Chủ Người Bệnh (`patient-home.component.html`)**:
   - Tiêu đề "Xin chào, Nguyễn Thị Mai" mở thoáng trực tiếp trên nền trắng với màu Deep Navy `#091F5B` kèm đường kẻ đáy `border-b border-[var(--base-border-opaque)] pb-6`.
   - Dải cảnh báo nhắc nhở UAS7 hiển thị như một thẻ độc lập nền hổ phách dịu (`bg-amber-50`).
   - 3 thẻ chỉ số lâm sàng (UAS hôm nay, Tổng điểm tuần, Bệnh án gần nhất) là 3 thẻ độc lập `.base-card p-6` trên lưới `grid grid-cols-1 md:grid-cols-3 gap-5`.
   - Biểu đồ diễn tiến cột 7 ngày là thẻ độc lập `.base-card p-6`.
   - Lưới 4 phân hệ chức năng lâm sàng là các thẻ độc lập `.base-card p-4`.

2. **Các màn hình Bệnh Nhân khác**:
   - `uas7-scoring.component.html`: Thay khối hero đen trôi nổi bằng tiêu đề thoáng trên nền trắng.
   - `patient-records.component.html`: Bỏ card bao bọc header, đưa tiêu đề về dạng thoáng chuẩn.
   - `emergency-screening.component.html`: Bỏ hero banner trôi nổi, đưa về tiêu đề mở chuẩn.
   - `dynamic-intake.component.html`: Tiêu đề mở trên nền trắng.
   - `lesion-tracker.component.html`: Tiêu đề mở trên nền trắng.
   - `patient-profile.component.html`: Tiêu đề mở trên nền trắng.

3. **Màn hình Bác Sĩ & Quản Trị**:
   - `waiting-queue.component.html`: Header mở thoáng với đường phân cách chuẩn.
   - `admin-dashboard.component.html`: Bỏ hero banner tối màu trôi nổi, tiêu đề quản trị mở thoáng với Deep Navy `#091F5B`.
   - `topology.component.html`, `rbac-matrix.component.html`, `form-builder.component.html`, `user-staff.component.html`: Đồng bộ cấu trúc header mở trực tiếp trên nền trắng.

## 3. Quy Tắc Tuân Thủ
- **Uber Base Design System**: Toàn bộ kích thước, khoảng cách cơ số 4px, typography scale, semantic tokens được giữ vững.
- **Iconsax Vector Font**: Toàn bộ icon sử dụng `.isax` / `.isax-b`.
- **An toàn Lâm sàng**: Tuyệt đối không thay đổi logic tính toán lâm sàng (UAS7, AAS7, WAO 2020) hay cấu trúc dữ liệu API.
