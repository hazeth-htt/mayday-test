# Đặc tả Thiết kế (Design Spec) - Việc T-017

- Người lập: Designer (Antigravity)
- Tài liệu quy chuẩn đối chiếu: Invoika Dashboard Architecture, Uber Base Design System (`uber-base-tokens.css`).

## 1. Thành Phần Card Kiến Trúc Phân Tách (Structured Cards)

### A. Khối Card (`.base-card`)
- `background-color: var(--base-primitive-white);`
- `border: 1px solid var(--base-border-opaque);`
- `border-radius: var(--base-radius-400);` (10px)
- `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);`
- `overflow: hidden;`

### B. Card Header (`.base-card-header`)
- `display: flex; align-items: center; justify-content: space-between;`
- `padding: 14px 20px;`
- `border-bottom: 1px solid var(--base-border-opaque);`
- `background-color: var(--base-primitive-white);`
- Tiêu đề `.base-card-title`:
  - `font-size: 15px; font-weight: 700; color: var(--base-brand-navy); margin: 0;`

### C. Card Body (`.base-card-body`)
- `padding: 20px;`

### D. Card Footer (`.base-card-footer`)
- `padding: 12px 20px;`
- `border-top: 1px solid var(--base-border-opaque);`
- `background-color: var(--base-bg-surface-alt);`

---

## 2. Hệ Thống Danh Sách Chuẩn Mực (List Groups System)

### A. `.base-list-group`
- Khối chứa danh sách, bo tròn theo `var(--base-radius-300)`, viền bao `1px solid var(--base-border-opaque)`.
- Các item con nối nhau qua viền đáy.

### B. `.base-list-group-flush`
- Biến thể phẳng: Loại bỏ viền ngoài và bán kính bo góc ngoài, chỉ giữ đường kẻ phân tách 1px giữa các item (`border-b`). Phù hợp gắn chìm vào thân Card.

### C. `.base-list-group-item`
- `display: flex; align-items: center; justify-content: space-between; gap: 12px;`
- `padding: 12px 16px;`
- `border-bottom: 1px solid var(--base-border-opaque);`
- `background-color: transparent;`
- `&:last-child { border-bottom: none; }`

### D. `.base-list-group-item-action`
- `cursor: pointer; transition: background-color 0.15s ease, border-color 0.15s ease;`
- Hover: `background-color: var(--base-bg-surface-alt);`
- Active: `border-left: 4px solid var(--base-brand-blue); background-color: var(--base-accent-50);`

---

## 3. Khung Tiêu Đề Trang & Breadcrumb (Page Title Box)

### A. `.base-page-title-box`
- Bố cục flex: `display: flex; flex-direction: column; gap: 8px; pb-6; border-b: 1px solid var(--base-border-opaque);`
- Tại màn hình `>= 640px` (sm): `flex-direction: row; align-items: center; justify-content: space-between;`

### B. `.base-breadcrumb`
- Danh sách vị trí phân cấp: `display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--base-content-secondary);`
- Item: `.base-breadcrumb-item` với icon ngăn cách mảnh, liên kết hover đổi màu Royal Blue `#3B63A8`.
