# HỆ THỐNG THIẾT KẾ UBER BASE (HEALTHCARE ADAPTED)
## TÀI LIỆU QUY CHUẨN DESIGN SYSTEM & COMPONENT LIBRARY
*Tham chiếu quy tắc: [https://base.uber.com/](https://base.uber.com/)*  
*Bộ thư viện biểu tượng tích hợp: Iconsax Font (895 Glyphs)*  
*Kỷ luật thương hiệu: Zero External Branding (Tuyệt đối không sử dụng logo/thương hiệu bên ngoài)*

---

## 1. TỔNG QUAN NGUYÊN TẮC THIẾT KẾ (UBER BASE PRINCIPLES)

Hệ thống thiết kế kế thừa 4 nguyên tắc nền tảng từ **Uber Base Web**:

1. **Directional, Bold, Minimal (Dứt khoát & Tối giản):**
   - Loại bỏ các thành phần trang trí không cần thiết.
   - Tập trung vào tính công năng (Function-driven) và ra quyết định lâm sàng nhanh chóng (đặc biệt trong các tình huống Báo động đỏ phản vệ).
2. **High-Contrast Accessibility (Chuẩn Tiếp cận WCAG 2.1 AAA):**
   - Độ tương phản chữ và nền luôn đạt tối thiểu **4.5:1 (AA)** cho nội dung thường và **7:1 (AAA)** cho các cảnh báo y tế khẩn cấp.
   - Vùng tương tác tối thiểu (Touch Target) đạt **44px x 44px**.
3. **Token-First Architecture (Kỷ Luật Token 3 Lớp):**
   - Không hard-code mã màu hex (#...) trong mã nguồn giao diện.
   - Cấu trúc 3 lớp:
     - **Primitives (Nguyên thủy):** Thang Gray 50 $\rightarrow$ 900, Accent Emerald, Semantic Fills.
     - **Semantic Role Tokens:** Phân tách rõ `contentPrimary`, `backgroundSurface`, `borderOpaque`.
     - **Component Tokens:** Gắn với nút bấm, ô nhập liệu, thẻ card, banner.
4. **Density Adaptability (Thích ứng Mật độ Hiển thị):**
   - **Clinician Mode (Compact):** Khoảng cách và font chữ gọn gàng để hiển thị tối đa dữ liệu bệnh án lâm sàng.
   - **Patient Mode (Spacious):** Nút to, chữ rõ ràng (16–18px) dành cho bệnh nhân và người cao tuổi.

---

## 2. BẢNG MÀU & THIẾT KẾ TOKEN (COLOR SYSTEM)

### 2.1. Thang Màu Đơn Sắc (Monochromatic Grayscale)
| Tên Token CSS | Giá trị Hex | Ứng dụng nghiệp vụ |
| :--- | :--- | :--- |
| `--base-gray-50` | `#F9FAFB` | Nền canvas ứng dụng (Background App) |
| `--base-gray-100` | `#F1F2F4` | Nền thứ cấp (Secondary Background), well, table header |
| `--base-gray-200` | `#E4E7EC` | Đường kẻ phân cách, viền Card chuẩn (`borderOpaque`) |
| `--base-gray-300` | `#DCDFE4` | Viền nút bấm thứ cấp, divider |
| `--base-gray-400` | `#B3B9C4` | Trạng thái vô hiệu hóa (`contentDisabled`) |
| `--base-gray-450` | `#8590A2` | Đường kẻ trang trí decorative |
| `--base-gray-500` | `#5E6878` | Text gợi ý, placeholder ô nhập liệu (Đạt chuẩn WCAG AA 5.2:1) |
| `--base-gray-600` | `#475467` | Nhãn mô tả phụ, thông tin thời gian, subtitle |
| `--base-gray-700` | `#344054` | Icon phụ, tiêu đề bảng dữ liệu |
| `--base-gray-800` | `#1D2939` | Chữ nhấn mạnh, tiêu đề mục nhỏ |
| `--base-gray-900` | `#091E42` | Màu chữ và icon chính (`contentPrimary`), nút Primary |

### 2.2. Bảng Màu Nhận Diện Thương Hiệu DrMayDay (Official Ministry of Health Spec)
*Bảng màu chính thức được chuẩn hóa từ nhận diện đề tài Bệnh viện Da liễu Trung ương:*

| # | Tên Token CSS | Giá trị Hex | Mẫu màu | Ứng dụng nghiệp vụ lâm sàng |
|---|:---|:---:|:---:|:---|
| 1 | `--base-brand-navy` | `#091F5B` | 🟦 | **Brand Deep Navy**: Màu nhận diện tối thượng, Logo DrMayDay, tiêu đề cấp cao, icon thương hiệu (Độ tương phản 13.5:1 đạt chuẩn WCAG AAA). |
| 2 | `--base-brand-blue` / `--base-accent-600` | `#3B63A8` | 🟦 | **Clinical Royal Blue**: Accent hành động chính, nút tương tác Primary, tab đang chọn, liên kết điều hướng (Tương phản 5.5:1 đạt chuẩn WCAG AA). |
| 3 | `--base-brand-sky` / `--base-accent-300` | `#6F96D1` | 🟦 | **Soft Sky Blue**: Điểm nhấn thứ cấp, viền hover, biểu đồ diễn tiến bệnh án. |
| 4 | `--base-brand-tint` / `--base-accent-100` | `#BAD6EB` | ⬜ | **Light Tint Blue**: Nền nhạt badge, thẻ card được chọn, vùng làm nổi bật kết quả. |
| 5 | `--base-bg-canvas` / `--base-brand-canvas` | `#F6F6F6` | ⬜ | **Clean Medical Canvas**: Nền ứng dụng phẳng, thanh nhã, giảm mỏi mắt cho bác sĩ. |

### 2.3. Màu Sắc Chức Năng Lâm Sàng (Semantic Clinical Tokens)
*Phân biệt rạch ròi giữa Hành động Tương tác UI (Clinical Blue `#3B63A8`) và Kết quả Lâm sàng Tốt (Positive Emerald `#217954` / `#4BCE97`) để loại bỏ nguy cơ nhầm lẫn nguy hiểm của Bác sĩ.*

| Trạng thái | Nền Fill / Border | Màu chữ (`content`) | Nền nhạt (`tint`) | Ý nghĩa nghiệp vụ lâm sàng |
| :--- | :---: | :---: | :---: | :--- |
| **Accent / Brand (Tương tác UI)** | `#3B63A8` / `#2A4C87` | `#3B63A8` | `#BAD6EB` | Nút hành động chính, tab đang chọn, liên kết điều hướng |
| **Negative (Nguy hiểm)** | `#EF5C48` | `#B42318` | `#FFECEB` | Cảnh báo đỏ sốc phản vệ 115, dị ứng thuốc, UAS7 nặng |
| **Warning (Cảnh báo)** | `#F5CD47` | `#8A5309` | `#FFF7D6` | Ca khám chờ duyệt, UAS7 mức vừa, tương tác thuốc |
| **Positive (Lâm sàng tốt)** | `#4BCE97` / `#22A06B` | `#217954` | `#E7F8EF` | Điểm UAS7 $\le 6$ (kiểm soát tốt), lưu hồ sơ thành công |
| **Info (Thông tin)** | `#3B63A8` | `#091F5B` | `#BAD6EB` | Nhắc lịch khám, thông báo chỉ định xét nghiệm |

### 2.4. Bề mặt & Semantic 3 Lớp (Surface Tokens)
| Token | Giá trị | Mục đích sử dụng |
| :--- | :--- | :--- |
| `--color-background-primary` | `#FFFFFF` | Nền trang chính, thẻ Card bệnh án |
| `--color-background-surface` | `#FAFAF9` | Bề mặt phụ, form điền thông tin, vùng nhập liệu |
| `--color-background-secondary` | `#F6F6F6` | Canvas nền toàn trang (`#F6F6F6`) |

### 2.5. Chế độ Ban Đêm cho Bác sĩ Trực Đêm (Dark Mode Tokens)
Kích hoạt tự động qua `.dark` hoặc `[data-theme="dark"]`:
- Nền Canvas (`--base-bg-canvas`): `#070D1E` (Deep Navy Tint)
- Bề mặt Card (`--base-bg-surface`): `#0C1836`
- Bề mặt nhập liệu (`--color-background-surface`): `#13234D`
- Chữ chính (`--base-content-primary`): `#F8FAFC`
- Chữ phụ (`--base-content-secondary`): `#94A3B8`
- Viền phân cách (`--base-border-opaque`): `#1E356E`
- Điểm nhấn tương tác (`--base-border-selected`): `#6F96D1`
- Nút tương tác chính (`--base-button-primary-bg`): `#3B63A8`

---

## 3. LOGO CHÍNH THỨC DRMAYDAY & KHẨU HIỆU LÂM SÀNG

Logo chính thức của Hệ thống Quản lý Bệnh án Mày Đay (DrMayDay) gồm:
- **Biểu tượng (Iconography)**: Ống nghe y tế chuyên khoa Da liễu - Miễn dịch lâm sàng.
- **Tên thương hiệu (Wordmark)**: Chữ in đậm dứt khoát `DRMAYDAY`.
- **Khẩu hiệu (Slogan)**: `Đồng hành - Tận tâm - Chia sẻ`.
- **Tệp tài nguyên**:
  - `public/images/logo/drmayday-logo.png` (Navy `#091F5B` trên nền trong suốt cho Light Mode).
  - `public/images/logo/drmayday-logo-white.png` (Màu trắng thuần khiết trên nền trong suốt cho Dark Mode).

---

## 4. THANG KIỂU CHỮ (TYPOGRAPHY HIERARCHY)

Sử dụng font hình học hiện đại **Be Vietnam Pro** kết hợp **JetBrains Mono**:

| Cấp bậc (Scale) | Kích thước / Line-height | Font-weight | Class CSS | Ứng dụng |
| :--- | :---: | :---: | :--- | :--- |
| **Display** | 52px / 60px | 800 (Extrabold) | `.base-display` | Điểm số lớn, màn hình cấp cứu |
| **Heading XXLarge** | 40px / 48px | 800 (Extrabold) | `.base-heading-xxl` | Tiêu đề phân hệ chính (Admin, EMR) |
| **Heading Medium** | 20px / 28px | 700 (Bold) | `.base-heading-md` | Tiêu đề thẻ Card, tên mục bệnh án |
| **Heading Small** | 17px / 24px | 700 (Bold) | `.base-heading-sm` | Tiêu đề phân đoạn nhỏ, popup |
| **Label Medium** | 14px / 20px | 600 (Semibold) | `.base-label-md` | Nhãn trường dữ liệu (Input label) |
| **Paragraph Medium** | 15px / 24px | 400 (Regular) | `.base-paragraph-md` | Nội dung câu hỏi bệnh án, lời dặn |
| **Paragraph Small** | 13px / 20px | 400 (Regular) | `.base-paragraph-sm` | Chú thích phụ, kết quả tham chiếu |
| **Mono** | 13px / 18px | JetBrains Mono, weight 500 | `.base-mono` | Mã ICD-10, mã hồ sơ, liều thuốc |
| **Patient Heading** | 24px / 32px | 700 (Bold) | `.patient-heading-lg` | Tiêu đề lớn cho bệnh nhân |
| **Patient Body** | 18px (1.125rem) / 28px | 400 (Regular) | `.patient-body-lg` | Chữ đọc dễ nhìn cho người lớn tuổi |
| **Patient Button** | Min-height 48px | 600 (Semibold) | `.patient-btn-lg` | Nút chạm cảm ứng cỡ lớn |

---

## 5. HỆ THỐNG BIỂU TƯỢNG (ICONSAX SYSTEM — 895 GLYPHS)

Toàn bộ font chữ biểu tượng đã được nhúng cục bộ tại `public/fonts/iconsax/` và định nghĩa trong `src/styles.css`.
- **Bản quyền & Giấy phép**: Iconsax Open Source License (Vuesax). Cho phép sử dụng miễn phí trong dự án thương mại và y tế không ràng buộc biểu trưng ngoài.
- **Phạm vi sử dụng**: 895 glyph vector y tế, định hướng và tác vụ hệ thống. Không phụ thuộc thư viện CDN bên ngoài.

### Cú pháp sử dụng trong mã nguồn HTML:
- **Dạng Nét Mảnh (Outline):**
  ```html
  <span class="isax icon-heart"></span>
  <span class="isax icon-hospital"></span>
  <span class="isax icon-document-text"></span>
  ```
- **Dạng Đậm Nét (Bold Solid):**
  ```html
  <span class="isax-b icon-heart"></span>
  <span class="isax-b icon-hospital"></span>
  <span class="isax-b icon-document-text"></span>
  ```

### Các nhóm icon tiêu biểu:
- **Y tế & Sức khỏe:** `icon-heart`, `icon-heart-tick`, `icon-activity`, `icon-health`, `icon-hospital`, `icon-shield-tick`, `icon-scanning`.
- **Hồ sơ & Dữ liệu:** `icon-document`, `icon-document-text`, `icon-clipboard-text`, `icon-task`, `icon-folder`, `icon-chart`, `icon-data`.
- **Thời gian & Lịch:** `icon-calendar`, `icon-calendar-tick`, `icon-clock`, `icon-timer`, `icon-alarm`.
- **Người dùng & Bác sĩ:** `icon-user`, `icon-profile-2user`, `icon-user-tick`, `icon-security-user`.
- **Thao tác & Hệ thống:** `icon-search-normal`, `icon-edit`, `icon-trash`, `icon-tick-circle`, `icon-close-circle`, `icon-setting-2`.

---

## 6. CẤU TRÚC BỀ MẶT LIỀN KỀ TRÊN NỀN TRẮNG (UNIFIED WHITE SEAMLESS WORKSPACE)

Nhằm loại bỏ hoàn toàn cảm giác rời rạc của các "hòn đảo thẻ card trôi nổi" (floating island cards), quy chuẩn DrMayDay ứng dụng kiến trúc **Bề Mặt Liền Mạch Thống Nhất (Unified Surface)** trên nền trắng tinh khiết (`#FFFFFF`):
- **Khối chứa Thống nhất (`.base-unified-surface`)**: Gom toàn bộ phân hệ thành một khối liền khối hoàn chỉnh trên nền trắng, bo góc chuẩn `radius400` và đổ bóng tối thiểu `elevation100`.
- **Khoang Liền Kề (`.base-section-flush`)**: Các khoang chức năng (tiêu đề, biểu đồ, danh sách) tiếp giáp sát nhau, triệt tiêu khoảng cách thừa (`gap`, `margin`), phân định bằng đường kẻ mảnh 1px (`var(--base-border-opaque)`).
- **Dải Chỉ Số Phân Cột (`.base-metrics-strip` / `.base-metrics-cell`)**: Chia cột liền khối với đường viền 1px (`divide-x`), tạo nhịp điệu dữ liệu lâm sàng cô đọng và trang trọng.
- **Dải Cảnh Báo Tiếp Giáp (`.base-alert-flush`)**: Nằm trực tiếp dưới phần Header, tiếp xúc 0 khoảng cách, hiển thị đường viền màu trạng thái bên trái rõ nét.

---

## 7. HỆ THỐNG KHOẢNG CÁCH & ĐỔ BÓNG (SPACING & ELEVATION)

### 5.1. Hệ Lưới 4px (Base Grid)
- `scale100`: `4px`
- `scale200`: `8px`
- `scale300`: `12px`
- `scale400`: `16px`
- `scale500`: `20px`
- `scale600`: `24px`
- `scale700`: `32px`
- `scale900`: `48px`

### 5.2. Góc Bo (Border Radii)
- `radius100`: `2px` (Tag nhỏ)
- `radius200`: `4px` (Badge mã số)
- `radius300`: `8px` (Nút bấm, ô Input chuẩn)
- `radius400`: `12px` (Card nhỏ, Dropdown menu)
- `radius500`: `16px` (Card chính, Sheet)
- `radiusPill`: `9999px` (Pill badges, Avatar tròn)

### 5.3. Đổ Bóng Phân Tầng (Elevation)
- `elevation100`: Card nội dung phẳng (`0 1px 2px rgba(0,0,0,0.05)`)
- `elevation200`: Thẻ tương tác có hover / Dropdown (`0 4px 6px rgba(0,0,0,0.08)`)
- `elevation300`: Floating action, Popover (`0 10px 15px rgba(0,0,0,0.08)`)
- `elevation400`: Hộp thoại Modal cấp cứu (`0 20px 25px rgba(0,0,0,0.1)`)

---

## 7. TRẢI NGHIỆM TRỰC TIẾP TRÊN ỨNG DỤNG

Truy cập trang giới thiệu và thử nghiệm tương tác tại:
👉 **[http://localhost:4200/design-system](http://localhost:4200/design-system)**

Tại đây bạn có thể:
1. Duyệt và tra cứu nhanh toàn bộ 895 icon Iconsax có ô tìm kiếm tức thì và nút copy mã HTML 1-click.
2. Kiểm tra các nút bấm Base Buttons (Primary, Secondary, Tertiary, Negative, Loading State).
3. Trải nghiệm mẫu hình tính điểm **UAS7 Interactive Calculator**.
4. Trải nghiệm trình kê đơn thuốc an toàn lâm sàng (Allergy Guard).
