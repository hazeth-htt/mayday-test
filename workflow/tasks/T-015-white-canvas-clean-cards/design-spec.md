# Đặc tả Thiết kế (Design Spec) - Việc T-015

- Chế độ: `spec T-015`
- Người lập: Designer

## 1. Triết lý Thiết kế: Pure White Canvas with Elevated Standalone Cards
- **Loại bỏ hai thái cực sai lầm**:
  - Thái cực 1 (Cũ): Nền xám đục (`#F6F6F6` / `bg-gray-50`) khiến các thẻ trông như bị dính bẩn hoặc trôi nổi lạc lõng trong không gian tối màu.
  - Thái cực 2: Ép toàn bộ giao diện vào trong một hộp viền cứng khổng lồ (`divide-y`) gây ngột ngạt và gò bó.
- **Chuẩn mực Uber Base Đích thực**:
  - **Nền Không Gian (Canvas Background)**: Sử dụng thuần túy màu **Trắng Tinh Khiết (`#FFFFFF`)**. Không gian nền trắng tạo cảm giác y tế trong trẻo, sạch sẽ, chuẩn mực của các hệ thống lâm sàng hiện đại.
  - **Header Trang**: Đặt tự nhiên trên đầu trang nền trắng, không đóng hộp, tiêu đề mang sắc Deep Navy `#091F5B` (`base-heading-xl`), phụ đề thanh nhã, phân cách nhẹ nhàng với khu vực làm việc bằng một đường viền đáy 1px (`border-b border-[var(--base-border-opaque)] pb-6`).
  - **Các Thẻ Độc Lập (Standalone Cards)**:
    - Nằm trực tiếp trên nền trắng canvas.
    - Màu nền thẻ: Trắng (`#FFFFFF`), viền mảnh 1px (`var(--base-border-opaque)` hoặc `#E4E7EC`), đổ bóng dịu mắt `0 1px 3px 0 rgba(0, 0, 0, 0.05)`.
    - Khi hover: Viền chuyển màu xanh thương hiệu nhẹ `var(--base-brand-blue)` (`#3B63A8`), đổ bóng nhẹ `0 4px 6px -1px rgba(9, 31, 91, 0.08)`.
  - **Dải Nhắc Nhở (Alert Box)**:
    - Độc lập, bo góc nhẹ 12px, nền vàng hổ phách nhạt `bg-amber-50/80` viền `border-amber-200/80`.

## 2. Token & Lớp CSS
- App Canvas: `bg-white dark:bg-gray-900`
- Base Card: `.base-card` tinh gọn trên nền trắng.
- Khoảng cách nhịp nhàng: `space-y-6`, `gap-5`.
