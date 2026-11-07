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

### 2.2. Màu Sắc Chức Năng (Semantic & Accent Tokens)
*Phân biệt rạch ròi giữa Hành động Tương tác UI (Accent Teal) và Kết quả Lâm sàng Tốt (Positive Emerald) để loại bỏ nguy cơ nhầm lẫn nguy hiểm của Bác sĩ.*

| Trạng thái | Nền Fill / Border | Màu chữ (`content`) | Nền nhạt (`tint`) | Ý nghĩa nghiệp vụ lâm sàng |
| :--- | :---: | :---: | :---: | :--- |
| **Accent / Brand (Tương tác UI)** | `#0E7490` / `#0D9488` | `#0E7490` | `#F0FDFA` | Nút hành động chính, tab đang chọn, liên kết điều hướng |
| **Negative (Nguy hiểm)** | `#EF5C48` | `#B42318` | `#FFECEB` | Cảnh báo đỏ sốc phản vệ 115, dị ứng thuốc, UAS7 nặng |
| **Warning (Cảnh báo)** | `#F5CD47` | `#8A5309` | `#FFF7D6` | Ca khám chờ duyệt, UAS7 mức vừa, tương tác thuốc |
| **Positive (Lâm sàng tốt)** | `#4BCE97` / `#22A06B` | `#217954` | `#E7F8EF` | Điểm UAS7 $\le 6$ (kiểm soát tốt), lưu hồ sơ thành công |
| **Info (Thông tin)** | `#388BFF` | `#0055CC` | `#E9F2FF` | Nhắc lịch khám, thông báo chỉ định xét nghiệm |

### 2.3. Bề mặt & Semantic 3 Lớp (Surface Tokens)
| Token | Giá trị | Mục đích sử dụng |
| :--- | :--- | :--- |
| `--color-background-primary` | `#FFFFFF` | Nền trang chính, thẻ Card bệnh án |
| `--color-background-surface` | `#FAFAF9` | Bề mặt phụ, form điền thông tin, vùng nhập liệu |
| `--color-background-secondary` | `#F9FAFB` | Canvas nền toàn trang |

### 2.4. Chế độ Ban Đêm cho Bác sĩ Trực Đêm (Dark Mode Tokens)
Kích hoạt tự động qua `.dark` hoặc `[data-theme="dark"]`:
- Nền Canvas (`--base-bg-canvas`): `#090E17`
- Bề mặt Card (`--base-bg-surface`): `#0F172A`
- Bề mặt nhập liệu (`--color-background-surface`): `#1E293B`
- Chữ chính (`--base-content-primary`): `#F8FAFC`
- Chữ phụ (`--base-content-secondary`): `#94A3B8`
- Viền phân cách (`--base-border-opaque`): `#1E293B`
- Điểm nhấn tương tác (`--base-border-selected`): `#2DD4BF`

---

## 3. THANG KIỂU CHỮ (TYPOGRAPHY HIERARCHY)

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

## 4. HỆ THỐNG BIỂU TƯỢNG (ICONSAX SYSTEM — 895 GLYPHS)

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

## 5. HỆ THỐNG KHOẢNG CÁCH & ĐỔ BÓNG (SPACING & ELEVATION)

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

## 6. TRẢI NGHIỆM TRỰC TIẾP TRÊN ỨNG DỤNG

Truy cập trang giới thiệu và thử nghiệm tương tác tại:
👉 **[http://localhost:4200/design-system](http://localhost:4200/design-system)**

Tại đây bạn có thể:
1. Duyệt và tra cứu nhanh toàn bộ 895 icon Iconsax có ô tìm kiếm tức thì và nút copy mã HTML 1-click.
2. Kiểm tra các nút bấm Base Buttons (Primary, Secondary, Tertiary, Negative, Loading State).
3. Trải nghiệm mẫu hình tính điểm **UAS7 Interactive Calculator**.
4. Trải nghiệm trình kê đơn thuốc an toàn lâm sàng (Allergy Guard).
