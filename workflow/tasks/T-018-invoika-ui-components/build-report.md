# Báo Cáo Xây Dựng (Build Report) - Nhiệm vụ T-018

## 1. Mục tiêu công việc
Chuẩn hóa toàn diện bộ UI Components theo thiết kế Invoika Dashboard Template (`Lists___Invoika_-_Admin_&_Dashboard_Template.html` và bản chụp layout `themesbrand_com_invoika_layouts_1470w_default.h2d`) kết hợp Uber Base Design System & Iconsax vector font.

## 2. Các tệp đã thực hiện thay đổi
1. `admin_template/src/app/core/design-system/uber-base-tokens.css`:
   - Bổ sung hệ thống biến thể trạng thái List Groups: `.base-list-group-item-positive`, `.base-list-group-item-warning`, `.base-list-group-item-negative`, `.base-list-group-item-info`.
   - Bổ sung cấu trúc danh sách ngang `.base-list-group-horizontal`.
   - Bổ sung biến thể thẻ nhạt Invoika Subtle / Soft Badges: `.base-tag-soft-primary`, `.base-tag-soft-secondary`, `.base-tag-soft-positive`, `.base-tag-soft-warning`, `.base-tag-soft-negative`, `.base-tag-soft-info`.
   - Bổ sung bộ nút Invoika Soft Buttons: `.base-btn-soft`, `.base-btn-soft-primary`, `.base-btn-soft-negative`.
   - Bổ sung cấu trúc Modal Invoika/Uber Base: `.base-modal-backdrop`, `.base-modal-dialog`, `.base-modal-header`, `.base-modal-title`, `.base-modal-close`, `.base-modal-body`, `.base-modal-footer`.
   - Bổ sung lớp bảng dữ liệu lâm sàng Invoika: `.base-table-container`, `.base-table`, `th`, `td`, `tr:hover`.

2. `admin_template/src/app/shared/components/common/component-card/component-card.component.html`:
   - Chuyển đổi từ raw tailwind `rounded-2xl` sang `.base-card`, `.base-card-header`, `.base-card-title`, `.base-card-body`.

3. `admin_template/src/app/shared/components/common/page-breadcrumb/page-breadcrumb.component.html`:
   - Thay thế hoàn toàn inline SVG bằng Iconsax vector font `<span class="isax icon-arrow-right-3"></span>`.
   - Ứng dụng lớp chuẩn `.base-page-title-box` và `.base-breadcrumb`.

4. `admin_template/src/app/shared/components/ui/badge/badge.component.ts` & `badge.component.html`:
   - Tích hợp thuộc tính `isaxIcon` hỗ trợ nhúng trực tiếp biểu tượng Iconsax font.
   - Chuẩn hóa màu sắc độ tương phản cao WCAG 2.1 AAA (Brand Navy `#091F5B`, Royal Blue `#3B63A8`, Emerald, Amber, Rose, Slate).

5. `admin_template/src/app/shared/components/ui/alert/alert.component.ts` & `alert.component.html`:
   - Loại bỏ toàn bộ các chuỗi inline SVG nhúng cứng.
   - Thay thế bằng thuộc tính `iconClass` trả về biểu tượng Iconsax font vector (`icon-tick-circle`, `icon-info-circle`, `icon-warning-2`, `icon-danger`).
   - Cập nhật màu nền, viền và kiểu chữ đạt chuẩn WCAG AAA.

6. `admin_template/src/app/shared/components/ui/modal/modal.component.html`:
   - Thay thế nút đóng inline SVG bằng Iconsax `<span class="isax icon-close-circle"></span>`.
   - Chuẩn hóa backdrop làm mờ nhẹ với Brand Navy tint (`bg-[#091F5B]/50`), viền thẻ sắc nét `1px`, bóng đổ nổi khối tinh tế.

7. `admin_template/src/app/shared/components/ui/button/button.component.ts` & `button.component.html`:
   - Bổ sung các biến thể Invoika (`primary`, `secondary`, `soft`, `outline`, `danger`, `ghost`).
   - Hỗ trợ `isaxIcon` cho icon vector đi kèm.
   - Tích hợp hiệu ứng chạm xúc giác (tactile micro-interactions: press scale 0.985).

8. `admin_template/src/app/shared/components/ui/dropdown/`:
   - Chuẩn hóa menu dropdown với viền `1px`, góc bo `rounded-lg`, đổ bóng `shadow-xl`.

9. `admin_template/src/app/pages/design-system/design-system-showcase/`:
   - Mở rộng tab "Components" thành phòng trưng bày chuyên sâu 7 cụm thành phần Invoika & Uber Base:
     - 1. Cấu trúc Khối Card Chuẩn Invoika
     - 2. Danh Sách Nhóm Invoika (Default, Active/Disabled, Actionable, Contextual, Custom Content với Avatar & Badge)
     - 3. Huy Hiệu & Thẻ Trạng Thái (Subtle Soft & Solid)
     - 4. Bộ Nút Thao Tác (Button Variants, Sizes & Tactile Motion)
     - 5. Cảnh Báo Lâm Sàng (Alerts Suite)
     - 6. Hộp Thoại Modal Tương Tác (Interactive Modal Demo)
     - 7. Bảng Dữ Liệu Hành Động (Data Table với hover & status badges)

10. `admin_template/src/app/pages/drmayday/doctor/waiting-queue/waiting-queue.component.html` & `patient-records.component.html`:
    - Nâng cấp modal "Tiếp nhận bệnh nhân mới" và modal "Đơn thuốc điện tử" sang chuẩn `.base-modal-backdrop` và `.base-modal-dialog` với nút đóng Iconsax.
