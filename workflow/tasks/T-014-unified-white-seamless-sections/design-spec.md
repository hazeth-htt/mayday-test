# Đặc tả Thiết kế (Design Spec) - Việc T-014

- Chế độ: `spec T-014`
- Người lập: Designer

## 1. Triết lý Thiết kế: Unified White Clinical Workspace
- **Loại bỏ mô hình "Floating Island Cards"**:
  - Không xếp chồng các hộp thẻ bài độc lập với viền bo tròn rời rạc và khoảng cách lơ lửng (`space-y-6`, `gap-4`).
  - Thay thế bằng **Bề mặt Liền mạch Thống nhất (Unified White Surface)**: Toàn bộ bảng điều khiển là một cấu trúc khối hoàn chỉnh nền trắng (`#FFFFFF`), được phân chia thành các khoang chức năng (sections) tiếp giáp sát nhau bằng đường phân cách mảnh 1px (`var(--base-border-opaque)`).
- **Phân bổ cấu trúc dọc liền kề**:
  - **Khoang 1 - Header Chào đón**:
    - Nền: Trắng tinh khiết (`bg-white dark:bg-gray-900`).
    - Tiêu đề: `Xin chào, [Tên]` bằng màu Deep Navy `#091F5B` (`text-[var(--base-brand-navy)]`), kiểu chữ `base-heading-xl`.
    - Phụ đề: Ngày tháng hiện tại có icon lịch Iconsax, màu sắc trung tính dịu nhẹ.
    - Cụm nút hành động: Nút chính Chấm điểm UAS7 (Accent Royal Blue `#3B63A8`), nút phụ Tải ảnh (Secondary White/Outline).
    - Đường phân cách: 1px viền đáy liền mạch (`border-b border-[var(--base-border-opaque)]`).
  - **Khoang 2 - Dải Nhắc nhở Cảnh báo (Alert Strip)**:
    - Tiếp giáp trực tiếp dưới Header (không khoảng cách).
    - Nền: Vàng nhạt y khoa chuẩn cảnh báo (`bg-amber-50/70 dark:bg-amber-950/20`), viền trái điểm nhấn màu cam hổ phách (`border-l-4 border-amber-500`).
    - Nội dung: Icon đồng hồ Iconsax, thông báo nhắc nhở và nút "Chấm ngay &rarr;".
    - Đường phân cách: 1px viền đáy.
  - **Khoang 3 - Dải Chỉ số Lâm sàng 3 Cột (Metrics Strip)**:
    - Tiếp giáp trực tiếp dưới dải nhắc nhở.
    - Bố cục lưới 3 cột liền kề nhau (`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--base-border-opaque)]`).
    - Mỗi ô chỉ số có padding đều đặn 24px (`p-6`), phân cấp typography số liệu lớn `base-heading-xl`, nhãn phụ `base-label-sm` và link chuyển tiếp.
    - Đường phân cách: 1px viền đáy.
  - **Khoang 4 - Biểu đồ Tiến triển Lâm sàng (Timeline Chart)**:
    - Tiếp giáp trực tiếp dưới dải chỉ số.
    - Padding 24px (`p-6`), hiển thị biểu đồ cột 7 ngày, chú giải phân tầng mức độ ngứa sẩn (Kiểm soát tốt / Nhẹ - Vừa / Nặng).
    - Kết thúc khối thống nhất với góc bo đáy mượt mà.

## 2. Token & Lớp CSS Quy chuẩn
- Khối bao ngoài: `.base-unified-surface`
- Khoang liền kề: `.base-section-flush`
- Dải chỉ số liền kề: `.base-metrics-strip` & `.base-metrics-cell`
- Dải cảnh báo liền kề: `.base-alert-flush`
