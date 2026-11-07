# Đề bài (Brief) - Việc T-015

- Tên việc: Chuyển toàn bộ nền ứng dụng sang Nền Trắng tinh khiết chuẩn Design System và bố trí các thẻ chức năng độc lập tự nhiên
- Phân hệ: UI/UX & Design System
- Yêu cầu người dùng (Phản hồi trực tiếp):
  - "bạn sai rồi, ý tôi không phải gộp hết như vậy, ý tôi là hãy bỏ hết các kiểu là border vào xong chia khoảng trôi nổi, mà hãy đặt tất cả trên 1 nền trắng đấy, còn các ô bên trong trôi nổi o sao"
- Căn cứ & Quy chuẩn:
  - Nền không gian làm việc (Canvas / App Body): Phải là **NỀN TRẮNG TINH KHIẾT (`#FFFFFF`)** thay vì xám đục (`#F6F6F6` hay `bg-gray-50`).
  - Cấu trúc trang: Không bọc cứng toàn trang vào một khối border khổng lồ (bỏ kiểu đóng khung cưỡng ép), mà để trang thở trên nền trắng rộng rãi.
  - Các ô bên trong (Metric Cards, Chart, Navigation, Alert): Là các thẻ độc lập (standalone cards) hiển thị tự nhiên trên nền trắng với viền mảnh 1px (`var(--base-border-opaque)`) và đổ bóng nhẹ (`elevation100`), tạo độ sâu thanh lịch và không gian thông thoáng.
  - Header: Hiển thị tự nhiên trên nền trắng với tiêu đề Deep Navy `#091F5B` và nút hành động chuẩn Base Button.
  - Quy tắc bất biến:
    - Tuân thủ nghiêm ngặt Uber Base Design System (base.uber.com).
    - Biểu tượng hệ thống sử dụng độc quyền font vector Iconsax (`.isax` / `.isax-b`).
    - Giữ nguyên toàn bộ logic lâm sàng, data-binding và unit tests (chỉ sửa style và layout HTML/CSS).
- Phạm vi thực hiện:
  1. Cập nhật nền hệ thống (`styles.css` & `uber-base-tokens.css`):
     - `body` chuyển sang `bg-white dark:bg-gray-900`.
     - `--base-bg-canvas: #ffffff;`
     - `--base-brand-canvas: #ffffff;`
     - `--color-background-surface: #ffffff;`
     - Tinh chỉnh `.base-card` thanh thoát trên nền trắng.
  2. Bố cục lại Cổng Người Bệnh (`patient-home.component.html`):
     - Tháo bỏ khối bọc kín `.base-unified-surface`.
     - Header trang nằm trực tiếp trên nền trắng, có đường kẻ phân tách đáy thanh thoát.
     - Dải nhắc nhở Alert độc lập, bo viền nhẹ.
     - 3 thẻ chỉ số lâm sàng (UAS hôm nay, Tổng điểm tuần, Bệnh án gần nhất) là 3 thẻ độc lập trên lưới `grid grid-cols-1 md:grid-cols-3 gap-5`.
     - Thẻ biểu đồ diễn tiến 7 ngày là thẻ độc lập (`base-card p-6`).
     - Lưới liên kết phân hệ chức năng là các thẻ độc lập (`base-card p-4`).
- Tiêu chí nghiệm thu:
  - Nền trang hiển thị 100% trắng sáng (`#FFFFFF`), không còn viền hộp bao bọc cưỡng bức toàn bộ màn hình.
  - Các ô/thẻ nội dung độc lập, thanh thoát, cân đối.
  - `npx tsc --noEmit` đạt 0 lỗi, Karma `npm test` 37/37 tests PASS, `npm run build:prod && npm run scan:bundle` 100% PASS.
