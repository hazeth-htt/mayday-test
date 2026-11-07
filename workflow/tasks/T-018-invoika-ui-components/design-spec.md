# Bản đặc tả kỹ thuật thiết kế T-018: Invoika UI Components Suite

## 1. Mục tiêu kiến trúc UI
Nâng cấp và chuẩn hóa toàn bộ các component dùng chung (Atoms & Molecules) trong hệ thống DrMayDay dựa trên ngôn ngữ thiết kế **Invoika Admin Dashboard** kết hợp với hệ thống Design Token **Uber Base Design System** và phông biểu tượng **Iconsax**.

## 2. Quy chuẩn Token & Component Class Mappings

### 2.1. Card System
- Container: `.base-card` (border 1px `#E2E8F0`, bg `#FFFFFF`, radius `8px-12px`, shadow tinh tế)
- Header: `.base-card-header` (border-bottom 1px `#F1F5F9`, padding `16px 20px`, flexbox căn giữa)
- Title: `.base-card-title` (Font Inter/Public Sans 16px, font-bold 600, color `#091F5B`)
- Body: `.base-card-body` (padding `20px`)
- Footer: `.base-card-footer` (border-top 1px `#F1F5F9`, padding `12px 20px`, bg `#F8FAFC`)

### 2.2. List Group System (Từ Invoika Reference)
- Standard: `.base-list-group` (border 1px, rounded 8px)
- Flush: `.base-list-group-flush` (border 0, border-bottom 1px giữa các phần tử)
- Item: `.base-list-group-item` (padding `12px 16px`, flexbox, transition `all 0.15s ease-out`)
- Actionable: `.base-list-group-item-action` (hover: bg `#F1F5F9`, active: bg `#E2E8F0`, cursor pointer)
- Contextual:
  - `.base-list-group-item-positive` (bg `#ECFDF5`, color `#065F46`, border-color `#A7F3D0`)
  - `.base-list-group-item-warning` (bg `#FFFBEB`, color `#92400E`, border-color `#FDE68A`)
  - `.base-list-group-item-negative` (bg `#FEF2F2`, color `#991B1B`, border-color `#FECACA`)
  - `.base-list-group-item-info` (bg `#EFF6FF`, color `#1E40AF`, border-color `#BFDBFE`)
- Custom Content Row:
  - Avatar container: 40x40px, rounded-lg, flex-center, bg soft brand tint
  - Meta info: Title 14px font-semibold, subtitle 12px text-muted, timestamp / tag status right-aligned

### 2.3. Badge / Tag System (Invoika Subtle & Solid)
- Subtle / Soft Tags:
  - Brand Navy: `.base-tag.base-tag-brand` (bg `rgba(9,31,91,0.08)`, color `#091F5B`)
  - Royal Blue: `.base-tag.base-tag-info` (bg `rgba(59,99,168,0.10)`, color `#2B4C85`)
  - Success/Controlled: `.base-tag.base-tag-positive` (bg `#ECFDF5`, color `#065F46`)
  - Warning/Moderate: `.base-tag.base-tag-warning` (bg `#FFFBEB`, color `#92400E`)
  - Danger/Emergency: `.base-tag.base-tag-negative` (bg `#FEF2F2`, color `#991B1B`)
- Rounded Pill vs Rounded Rect:
  - Mặc định: Rounded 6px (sắc nét, chuyên nghiệp)
  - Pill variant: `.rounded-full` khi hiển thị count badge hoặc trạng thái đặc biệt

### 2.4. Alert & Notification System
- Container: padding 16px, border 1px, rounded 8px, flexbox layout với icon Iconsax 24px bên trái
- Icon: Iconsax vector `<span class="isax icon-..."></span>`
  - Success: `icon-tick-circle`
  - Info: `icon-info-circle`
  - Warning: `icon-warning-2`
  - Error: `icon-danger`
- Link / Action: Font-medium, underline, transition color

### 2.5. Breadcrumb & Page Title Box
- Container: `.base-page-title-box`
- Breadcrumb list: `.base-breadcrumb`
- Separator: Iconsax `<span class="isax icon-arrow-right-3"></span>` (bỏ hoàn toàn inline SVG)

### 2.6. Modal / Dialog System
- Dialog: `.base-modal-dialog` (max-w-lg, bg `#FFFFFF`, rounded 12px, shadow 0 20px 25px -5px rgba(0,0,0,0.1))
- Close button: Iconsax `<span class="isax icon-close-circle"></span>`
- Content areas: Header, Body, Footer có nút hành động chuẩn Base Button

## 3. Danh sách tệp cần cập nhật
1. `admin_template/src/app/core/design-system/uber-base-tokens.css` (Mở rộng tokens list groups, badges, modals)
2. `admin_template/src/app/shared/components/common/component-card/component-card.component.html` & `.ts`
3. `admin_template/src/app/shared/components/common/page-breadcrumb/page-breadcrumb.component.html` & `.ts`
4. `admin_template/src/app/shared/components/ui/badge/badge.component.html` & `.ts`
5. `admin_template/src/app/shared/components/ui/alert/alert.component.html` & `.ts`
6. `admin_template/src/app/shared/components/ui/modal/modal.component.html` & `.ts`
7. `admin_template/src/app/shared/components/ui/button/button.component.html` & `.ts`
8. `admin_template/src/app/pages/design-system-showcase/design-system-showcase.component.html` & `.ts`
9. `admin_template/src/app/pages/doctor/waiting-queue/waiting-queue.component.html` (Nâng cấp list view)
10. `admin_template/src/app/pages/patient/patient-records/patient-records.component.html` (Nâng cấp list view)
