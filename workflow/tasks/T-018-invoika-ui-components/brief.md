# Nhiệm vụ T-018: Chuẩn hóa toàn diện bộ UI Components theo quy chuẩn Invoika Template & Uber Base Design System

## 1. Bối cảnh & Yêu cầu
Người dùng cung cấp mẫu Invoika Dashboard Template (`Lists___Invoika_-_Admin_&_Dashboard_Template.html` và bản chụp cấu trúc `themesbrand_com_invoika_layouts_1470w_default.h2d`) và yêu cầu:
> "cập nhật thêm cả các component nữa"
> "tự thực hiện theo rule"

## 2. Mục tiêu trọng tâm
1. **Chuẩn hóa các Shared UI Components (`admin_template/src/app/shared/components/...`):**
   - **Component Card (`component-card.component`):** Chuyển đổi từ raw tailwind sang hệ thống Invoika `.base-card`, `.base-card-header`, `.base-card-title`, `.base-card-body`, `.base-card-footer`.
   - **Page Breadcrumb (`page-breadcrumb.component`):** Áp dụng `.base-page-title-box` và `.base-breadcrumb`, thay thế toàn bộ SVG mũi tên bằng Iconsax `<span class="isax icon-arrow-right-3"></span>`.
   - **Badges / Tags (`badge.component`):** Bổ sung phong cách badge Invoika subtle/soft (nền nhạt, chữ tương phản cao chuẩn AAA), các biến thể trạng thái lâm sàng (`positive`, `warning`, `negative`, `info`, `brand`), loại bỏ SVG sang Iconsax.
   - **Alerts / Notifications (`alert.component`):** Chuyển đổi hoàn toàn các icon SVG nhúng cứng sang biểu tượng Iconsax vector chuẩn (`icon-tick-circle`, `icon-info-circle`, `icon-danger`, `icon-warning-2`), phong cách Invoika/Uber Base thanh lịch, sắc nét.
   - **Modals / Dialogs (`modal.component`):** Đồng bộ cấu trúc `.base-modal`, `.base-modal-dialog`, `.base-modal-content`, `.base-modal-header`, `.base-modal-body`, `.base-modal-footer`, thay thế nút đóng SVG bằng Iconsax `<span class="isax icon-close-circle"></span>`.
   - **Buttons (`button.component`):** Hỗ trợ đầy đủ biến thể Invoika (Primary Brand Navy, Royal Blue Secondary, Soft/Subtle, Outline, Danger), kết hợp tactile micro-interactions (press state, active state).
   - **Dropdowns & Tables:** Củng cố border sắc nét `1px solid rgba(0,0,0,0.08)`, border-radius chuẩn `8px`, hiệu ứng hover êm mượt.

2. **Mở rộng Design System Showcase (`design-system-showcase.component`):**
   - Bổ sung phòng trưng bày chuyên sâu "Invoika UI Component Suite" hiển thị trực quan và tương tác đầy đủ các thành phần: List Groups (Default, Flush, Actionable, Contextual, Custom Content với Avatar + Badge), Badges, Buttons, Modals, Alerts, Page Breadcrumbs.

3. **Cập nhật màn hình lâm sàng & quản trị:**
   - Đồng bộ hóa các khối danh sách ca khám, hàng đợi bệnh nhân (`waiting-queue.component`), và hồ sơ bệnh án (`patient-records.component`) sang Invoika custom-content list groups.

## 3. Ràng buộc bất di bất dịch (Project Rules)
1. **Màu sắc thương hiệu cốt lõi:**
   - Deep Brand Navy: `#091F5B` (Primary)
   - Royal Blue: `#3B63A8` (Secondary)
   - Soft Sky: `#6F96D1` (Tertiary)
   - Light Tint: `#BAD6EB` (Surface tint)
   - Pure White Canvas: `#FFFFFF` (Backgrounds)
2. **Iconsax Vector Font duy nhất:**
   - Toàn bộ icon sử dụng `.isax.icon-...` / `.isax-b.icon-...`. Không dùng SVG rời rạc hoặc logo ngoài.
3. **Quy chuẩn y tế & lâm sàng:**
   - Giữ nguyên 100% logic y tế (UAS7, AAS7, WAO 2020), API contracts và định dạng PII.
4. **Kiểm thử & Thẩm định:**
   - `npx tsc --noEmit` đạt 0 lỗi.
   - Karma test runner 37/37 tests PASS.
   - `scan:bundle` không chứa từ khóa vi phạm quy chuẩn.
