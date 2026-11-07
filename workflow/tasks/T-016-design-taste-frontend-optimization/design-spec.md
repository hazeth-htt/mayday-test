# Đặc tả Thiết kế (Design Spec) - Việc T-016

- Người lập: Designer (Antigravity)
- Tài liệu đối chiếu: `design-taste-frontend` (`motion.md`, `cards.md`, `system.md`), `uber-base-tokens.css`.

## 1. Hệ thống Vi tương tác (Micro-Interactions Layer)

### A. Nút bấm (.base-btn)
- **Transition**: `transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease`.
- **Hover**: `transform: translateY(-1px);` kèm bóng mờ nhẹ.
- **Active (Click / Press)**: `transform: translateY(1px) scale(0.985);`.

### B. Thẻ tương tác (Interactive Cards)
- Áp dụng cho: `a.base-card`, `button.base-card`, `.base-card-interactive`.
- **Transition**: `transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.15s ease, box-shadow 0.18s ease`.
- **Hover**:
  - `transform: translateY(-2px);`
  - `border-color: var(--base-brand-blue);`
  - `box-shadow: 0 8px 24px -4px rgba(9, 31, 91, 0.08);`
- **Active**:
  - `transform: translateY(0) scale(0.995);`
- **Thẻ tĩnh (.base-card không có link)**:
  - Giữ nguyên trạng thái phẳng nghỉ ngơi, chỉ đổi nhẹ màu viền khi hover nếu có nhu cầu chú ý.

### C. Mũi tên động lực học (.icon-arrow-right-1, .icon-arrow-right)
- **Rest**: `display: inline-block; transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);`.
- **Hover** (khi hover vào phần tử cha thẻ hoặc nút bấm): `transform: translateX(3px);`.

### D. Biểu đồ cột UAS7 Mini-Chart
- Cột diễn tiến: Bo góc đầu cột `rounded-t-md`.
- Hover cột: `hover:brightness-110 cursor-pointer transition-all duration-150`.
- Tooltip trực quan tự nhiên qua thuộc tính HTML `title="Ngày {score_date}: {daily_score}/6 điểm"`.

### E. Giảm chuyển động (Accessibility / prefers-reduced-motion)
- Khi người dùng bật cài đặt trợ năng giảm chuyển động, toàn bộ `transform` và `transition` được tắt về `none` tức thì.
