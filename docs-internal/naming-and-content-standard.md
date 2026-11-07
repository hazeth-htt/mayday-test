# QUY CHUẨN ĐẶT TÊN VÀ NỘI DUNG HỆ THỐNG (NAMING & CONTENT STANDARD)
**Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn chủ trì:** Bệnh viện Da liễu Trung ương  
**Phiên bản tài liệu:** v1.0 — Chuẩn hóa cấp Bệnh viện & Bộ Y Tế  
**Ngày ban hành:** 08/11/2026  
**Đơn vị áp dụng:** Toàn bộ Đội ngũ Kỹ thuật, Lập trình viên Frontend/Backend, Chuyên viên Thiết kế UX/UI, Quản trị viên và Chuyên viên Nhập liệu.

---

## 1. MỤC TIÊU & NGUYÊN TẮC CỐT LÕI

Tài liệu này xác lập ranh giới bất biến giữa hai thế giới trong hệ thống DrMayDay:
1. **Thế giới Kỹ thuật (Internal Engineering):** Codebase, cơ sở dữ liệu, API, design tokens, routing nội bộ, công cụ kiểm thử.
2. **Thế giới Người dùng cuối (End-User Experience):** Giao diện hiển thị trực tiếp cho Bệnh nhân, Bác sĩ chuyên khoa Da liễu, và Ban Quản trị Bệnh viện.

### Nguyên Tắc Bất Biến (The Golden Rules):
* **Zero Technical Jargon on UI:** Không bao giờ để lộ tên biến (`snake_case`, `camelCase`, `kebab-case`), tên trường CSDL, tên bảng, câu lệnh SQL, mã enum thô, chuỗi key i18n, hoặc mã định danh nội bộ (UUID, mã ID kỹ thuật dạng `rec-001`, `pat-102`) lên bất kỳ vị trí nào trên giao diện (kể cả tooltip, placeholder hay thông báo lỗi).
* **Single Source of Truth:** Mọi chuỗi hiển thị phải được đối chiếu từ `content-dictionary.ts` hoặc bộ từ điển nội dung chuẩn hóa. Không tùy tiện hardcode chuỗi hiển thị rải rác.
* **Clinical Accuracy & Empathy:** Ngôn từ y tế phải tuyệt đối chính xác theo quy chuẩn Bệnh viện Da liễu Trung ương và Bộ Y Tế, nhưng phải thể hiện sự đồng cảm, trấn an khi hướng đến Bệnh nhân.
* **Uber Base Design System & Iconsax Strictness:** Tuân thủ chuẩn thiết kế Uber Base và sử dụng độc quyền hệ thống biểu tượng Iconsax Font (`.isax` và `.isax-b`). Tuyệt đối không dùng logo thương mại ngoài (như TailAdmin) hoặc Emoji thô (`🩺`, `🛡️`, `👤`).

---

## 2. QUY ƯỚC ĐẶT TÊN KỸ THUẬT NỘI BỘ (INTERNAL NAMING CONVENTIONS)

Tất cả thành viên trong nhóm phát triển bắt buộc áp dụng thống nhất phong cách định danh sau:

| Đối tượng | Quy ước cú pháp | Cấu trúc & Tiền tố bắt buộc | Ví dụ mẫu chuẩn | Chống chỉ định (Cấm) |
|:---|:---|:---|:---|:---|
| **Design Tokens** | `kebab-case` | Tiền tố `--base-` + nhóm ngữ nghĩa (`color`, `font`, `space`, `radius`) | `--base-color-primary-default`, `--base-space-400`, `--base-font-label-md` | `--color1`, `btn-blue`, `spacing-16` |
| **Component Name** | `PascalCase` (File: `kebab-case`) | Bắt đầu bằng tên chức năng + hậu tố phân loại | `Uas7ScoringComponent`, `ConsultationComponent` | `Form1`, `TestComp`, `MayDayUI` |
| **CSS Classes** | `kebab-case` | Tuân thủ Uber Base Tokens hoặc Tailwind ngữ nghĩa | `.base-card`, `.base-heading-lg`, `.isax-b.icon-health` | `.my-custom-box`, `.text-blue-hack` |
| **Biến & Thuộc tính (JS/TS)** | `camelCase` | Động từ/Danh từ rõ nghĩa, trạng thái bắt đầu bằng `is`, `has`, `can` | `patientScore`, `isEmergencyActive`, `currentMedicalRecord` | `iss7_val`, `temp_1`, `P_DATA` |
| **Trường CSDL (Backend)** | `snake_case` | Tên danh từ số ít, khóa ngoại có hậu tố `_id` | `patient_id`, `record_code`, `total_uas7`, `hospital_code` | `PatientID`, `tbl_rec`, `Id` |
| **Mã Enum / Trạng thái** | `SCREAMING_SNAKE` | Tên nhóm trạng thái + giá trị cụ thể | `STATUS_COMPLETED`, `ROLE_DOCTOR`, `STAGE_REMISSION` | `Doctor`, `status1`, `ok` |
| **Đường dẫn Route (URL)** | `kebab-case` | Cấu trúc phân cấp theo phân hệ người dùng | `/patient/uas7-scoring`, `/doctor/queue`, `/admin/topology` | `/PatientForm`, `/doc_queue`, `/uas7_calc` |
| **Route Nội bộ (Internal/Dev)** | `kebab-case` | Bắt buộc bắt đầu bằng `/internal/` | `/internal/design-system`, `/internal/preview-tokens` | `/design-hub`, `/test-ui`, `/dev/form` |

---

## 3. BẢNG ĐỐI CHIẾU: TÊN KỸ THUẬT ➔ NHÃN HIỂN THỊ THEO TỪNG VAI TRÒ

Tuyệt đối không render trực tiếp các giá trị ở cột **"Tên Kỹ thuật / Mã Code"** ra giao diện. Thay vào đó, dùng hàm chuyển đổi hoặc dictionary để ánh xạ sang nhãn người dùng tương ứng:

| Tên Kỹ thuật / Mã Code | Nhãn cho BỆNH NHÂN (`PATIENT`) | Nhãn cho BÁC SĨ (`DOCTOR`) | Nhãn cho QUẢN TRỊ (`ADMIN`) |
|:---|:---|:---|:---|
| `ROLE_ADMIN` | *(Không hiển thị)* | Ban Quản Trị Hệ Thống | Quản Trị Viên Toàn Quyền |
| `ROLE_DOCTOR` | Bác sĩ Chuyên khoa | Bác sĩ Khám & Điều trị | Bác sĩ Lâm sàng |
| `ROLE_PATIENT` | Bệnh nhân | Bệnh nhân Khám | Tài khoản Người bệnh |
| `STATUS_PENDING` | Đang chờ tiếp nhận | Chờ khám lâm sàng | Chờ xử lý điều phối |
| `STATUS_IN_PROGRESS` | Đang được khám | Đang thực hiện tư vấn | Ca khám đang diễn ra |
| `STATUS_COMPLETED` | Đã hoàn thành khám | Đã kết luận bệnh án | Hồ sơ đã khóa kết luận |
| `STATUS_EMERGENCY` | Cảnh báo: Cần cấp cứu ngay | Báo động Đỏ: Nguy cơ sốc phản vệ | Ca nguy cấp: Đã chuyển cấp cứu |
| `iss7` / `wheals_score` | Mức độ nổi nốt sẩn phù (0 - 3) | Điểm số sẩn phù (0 - 3 điểm) | Chỉ số sẩn phù ISS7 |
| `hss7` / `pruritus_score` | Cảm giác ngứa ngáy (0 - 3) | Mức độ ngứa lâm sàng (0 - 3 điểm) | Chỉ số ngứa HSS7 |
| `daily_score` | Tổng điểm khó chịu trong ngày (0 - 6) | Điểm UAS ngày (0 - 6 điểm) | Tổng điểm ngày UAS (ISS7 + HSS7) |
| `total_uas7` | Điểm bệnh tuần qua (0 - 42) | Tổng điểm hoạt tính UAS7 (0 - 42 điểm) | Điểm UAS7 tích lũy |
| `CSU` / `urticaria_chronic` | Mày đay mạn tính | Mày đay mạn tính tự phát (CSU) | Hồ sơ mày đay mạn tính |
| `urticaria_acute` | Mày đay cấp tính | Mày đay cấp tính | Bệnh án cấp tính |
| `angioedema` | Sưng phù mí mắt, môi hoặc họng | Dấu hiệu phù mạch (Angioedema) | Phù mạch lâm sàng |
| `milestone_start` | Khi nốt đỏ bắt đầu xuất hiện | Giai đoạn khởi phát tổn thương | Mốc bắt đầu nổi thương tổn |
| `milestone_peak` | Khi nốt đỏ nổi nhiều và ngứa nhất | Giai đoạn đỉnh điểm tổn thương | Mốc đỉnh điểm bùng phát |
| `milestone_normal` | Khi da dịu đi và nốt đỏ lặn | Giai đoạn thoái lui / lặn sẩn | Mốc tổn thương thuyên giảm |
| `RESTRICT` | *(Không bao giờ hiển thị)* | *(Không áp dụng)* | Ràng buộc bảo toàn: Chặn xóa khi còn dữ liệu trực thuộc |
| `ON_DELETE_SET_NULL` | *(Không bao giờ hiển thị)* | *(Không áp dụng)* | Quy tắc an toàn: Tự động chuyển về trạng thái Chưa phân bổ |
| `created_by = NULL` | *(Không bao giờ hiển thị)* | *(Không áp dụng)* | Quy tắc bảo tồn: Giữ nguyên lịch sử bệnh án khi hủy tài khoản nhân sự |
| `JSON Tree` | *(Không hiển thị)* | *(Không hiển thị)* | Cấu trúc dữ liệu biểu mẫu chuẩn |
| `TMPL_MAY_DAY_MAN_V2` | Phiếu khảo sát tiền sử mày đay | Mẫu bệnh án Mày đay Mạn tính | Mẫu khảo sát lâm sàng CSU v2.0 |

---

## 4. TỪ ĐIỂN THUẬT NGỮ Y TẾ CHUẨN HÓA (CLINICAL GLOSSARY)

Trong toàn bộ hệ thống, **mỗi khái niệm lâm sàng chỉ được dùng đúng MỘT cụm từ tiếng Việt chuẩn hóa duy nhất**. Nghiêm cấm dùng từ ngữ tùy tiện hoặc lai tạp:

| Khái niệm y tế | Từ chuẩn hóa DUY NHẤT | Từ cấm dùng (Bị loại bỏ) | Ngữ cảnh áp dụng |
|:---|:---|:---|:---|
| Đơn thuốc | **Đơn thuốc điện tử** | Toa thuốc, Toa, Prescription, RX | Hướng dẫn điều trị cho bệnh nhân và bác sĩ kê đơn |
| Thuốc kháng histamine | **Thuốc kháng dị ứng (Kháng Histamin H1)** | Histamine, Anti-histamine, Thuốc ngứa | Hướng dẫn dùng thuốc cho bệnh nhân |
| Bệnh án điện tử | **Hồ sơ bệnh án điện tử** | EMR, EHR, Bệnh án mềm, Hồ sơ online | Hồ sơ dữ liệu bệnh nhân lưu tại bệnh viện |
| Tình trạng khẩn cấp | **Báo động nguy cấp (115)** | Red Flag, Red Flags, Cờ đỏ, Alert 1 | Sàng lọc phản vệ và khó thở |
| Nốt sẩn ngoài da | **Nốt sẩn phù** | Nốt mề đay, Cục mề đay, Wheals, Mụn phù | Tổn thương nổi gồ trên mặt da |
| Cơn ngứa da | **Cảm giác ngứa ngáy** | Pruritus, Itchiness, Rát ngứa | Mô tả triệu chứng cho bệnh nhân |
| Tái khám | **Lịch hẹn tái khám** | Follow up, Tái hẹn, Khám lại | Lịch hẹn định kỳ đánh giá hiệu quả thuốc |
| Xét nghiệm | **Chỉ định cận lâm sàng** | Lab tests, Test máu, Xét nghiệm lab | Phiếu bác sĩ chỉ định và bệnh nhân xem kết quả |
| Khảo sát ban đầu | **Phiếu khai thác bệnh sử ban đầu** | Dynamic Intake, Form intake, Khai bệnh | Bộ câu hỏi 183 biến lâm sàng |
| Nhật ký theo dõi | **Nhật ký theo dõi mày đay hàng ngày** | UAS7 Log, Bảng chấm điểm UAS, Daily tracker | Bệnh nhân ghi nhận hàng ngày trong 7 ngày |

---

## 5. QUY TẮC GIỌNG ĐIỆU (TONE OF VOICE) THEO TỪNG VAI TRÒ

### 5.1. Dành cho Bệnh Nhân (`PATIENT`)
* **Đặc điểm tâm lý:** Đang khó chịu vì ngứa ngáy, lo lắng bệnh kéo dài hoặc tái phát, có thể là người cao tuổi hoặc ít quen dùng phần mềm.
* **Nguyên tắc giọng điệu:**
  * **Trấn an và đồng cảm:** Dùng câu văn ấm áp, ân cần (ví dụ: *"Bác sĩ luôn đồng hành cùng bạn"* thay vì *"Hệ thống ghi nhận ca khám"*).
  * **Đơn giản, dễ hiểu:** Diễn giải từ ngữ chuyên môn thành biểu hiện thực tế (ví dụ: *"nốt sẩn phù"* kèm mô tả *"nốt gồ đỏ như muỗi cắn"*).
  * **Rõ ràng và chỉ dẫn hành động kế tiếp:** Luôn cho bệnh nhân biết sau bước này họ cần làm gì (ví dụ: *"Đã lưu nhật ký hôm nay. Bạn nhớ uống thuốc đúng giờ và tái khám sau 7 ngày nhé"*).
  * **Cấm:** Không dùng từ viết tắt y khoa (`EAACI`, `CSU`, `iss7`, `hss7`, `EMR`, `AUAS`).

### 5.2. Dành cho Bác Sĩ (`DOCTOR`)
* **Đặc điểm tâm lý:** Cường độ làm việc cao, cần tra cứu nhanh, ra quyết định lâm sàng chính xác, tiết kiệm từng giây thao tác.
* **Nguyên tắc giọng điệu:**
  * **Ngắn gọn, súc tích:** Ưu tiên bảng dữ liệu, biểu đồ xu hướng, thông số trực quan.
  * **Chính xác theo chuẩn thuật ngữ Y khoa:** Dùng chuẩn thuật ngữ Bộ Y Tế và Hội Da liễu (ví dụ: *"Hoạt tính bệnh theo UAS7: 28/42 điểm (Mức độ nặng)"*).
  * **Cảnh báo tức thì:** Nổi bật ngay lập tức các chỉ số bất thường hoặc dấu hiệu chuyển nặng.

### 5.3. Dành cho Quản Trị Viên (`ADMIN`)
* **Đặc điểm:** Chịu trách nhiệm về bảo mật dữ liệu, phân quyền tài khoản, và cơ cấu tổ chức khoa phòng.
* **Nguyên tắc giọng điệu:**
  * **Minh bạch và chuẩn xác về quyền hạn:** Mô tả rõ hành động có tác động gì đến hệ thống.
  * **Cảnh báo hệ quả trước khi thực hiện thao tác nhạy cảm:** (Ví dụ: *"Xóa khoa phòng này sẽ chuyển các phòng khám trực thuộc về trạng thái chưa phân khoa. Dữ liệu bệnh án của bệnh nhân không bị ảnh hưởng"* thay vì *"ON DELETE SET NULL"*).
  * **Tôn trọng tính toàn vẹn dữ liệu:** Tuyệt đối không để xảy ra thao tác xóa nhầm làm mất mát dữ liệu bệnh án.

---

## 6. QUY TẮC ĐỊNH DẠNG DỮ LIỆU CHUẨN HÓA (FORMATTING RULES)

1. **Định dạng Ngày & Giờ:**
   * Chuẩn ngày tháng hiển thị: `DD/MM/YYYY` (ví dụ: `08/11/2026`).
   * Chuẩn ngày giờ đầy đủ: `HH:mm, DD/MM/YYYY` (ví dụ: `14:30, 08/11/2026`).
   * *Nghiêm cấm định dạng kiểu Mỹ (`MM/DD/YYYY` hoặc `YYYY-MM-DD` hiển thị ra UI).*
2. **Định dạng Số & Điểm Y Tế:**
   * Phân cách phần thập phân bằng dấu phẩy `,` trong văn bản hoặc dấu chấm `.` trên biểu đồ.
   * Thang điểm phải luôn đi kèm khoảng giá trị cực đại để người xem hiểu bối cảnh:
     * Điểm ngày: `4 / 6 điểm`
     * Điểm tuần: `28 / 42 điểm (Hoạt tính nặng)`
3. **Đơn vị Đo Lường Y Tế:**
   * Sử dụng ký hiệu chuẩn quốc tế: `mg`, `ml`, `viên/ngày`, `tuần`, `tháng`.
   * Luôn có dấu cách giữa số và đơn vị: `10 mg`, `1 viên`, `3 lần/ngày`.
4. **Quy Tắc Viết Hoa (Capitalization):**
   * Tiêu đề trang / Phân mục chính: **Title Case Tiếng Việt** (Viết hoa chữ cái đầu mỗi từ chính, ví dụ: *Nhật Ký Đánh Giá Hoạt Tính Mày Đay*).
   * Nhãn form / Label / Mô tả: **Sentence case** (Chỉ viết hoa chữ đầu câu, ví dụ: *Đánh giá số lượng nốt sẩn trong ngày*).
   * Nút bấm hành động: Viết hoa từ chính (ví dụ: *Lưu Đánh Giá*, *Chỉ Định Xét Nghiệm*, *Kê Đơn Thuốc*).

---

## 7. CHECKLIST KIỂM SOÁT TRƯỚC KHI BÀN GIAO & RELEASE (PRE-RELEASE GATE)

Trước khi đóng gói phiên bản đưa lên môi trường Chẩn đoán (Staging) hoặc Vận hành chính thức (Production), Đội ngũ Kiểm thử (QA) và Release Engineer bắt buộc rà soát đạt 100% các tiêu chí sau:

- [ ] **1. Không rò rỉ mã code / biến trên UI:** Quét không còn bất kỳ ký tự `snake_case`, `camelCase`, tên biến CSDL (`iss7`, `hss7`, `record_id`, `created_by`), câu lệnh SQL (`RESTRICT`, `SET NULL`) hiển thị ra màn hình người dùng.
- [ ] **2. Cách ly tuyệt đối khu vực nội bộ (`INTERNAL-DEV`):**
  - [ ] Trang Design System Hub đã chuyển sang `/internal/design-system`.
  - [ ] Đã kích hoạt `internalDevGuard` chặn người dùng cuối truy cập.
  - [ ] Biến môi trường production (`environment.prod.ts`) đặt `enableInternalDevRoutes: false`.
  - [ ] Không có link dẫn đến `/internal/...` trên thanh Menu Sidebar của Bác sĩ và Bệnh nhân.
- [ ] **3. Vô hiệu hóa Debug & Source Maps trên Production:**
  - [ ] Tệp `angular.json` cấu hình `"sourceMap": false` cho bản production.
  - [ ] File `main.ts` đã gắn cờ vô hiệu hóa `console.log`, `console.debug`, `console.info`.
  - [ ] Không rò rỉ mật khẩu hay token xác thực trong mã nguồn hoặc DevTools console.
- [ ] **4. Loại bỏ 100% dữ liệu mẫu ngoại lai (Third-party Branding):**
  - [ ] Không còn tên "TailAdmin", "Pimjo LLC", "Terry Franci", "Nganter App".
  - [ ] Tiêu đề trang `<title>` và thông báo lỗi 404 hiển thị chuẩn thương hiệu Bệnh viện Da liễu Trung ương.
- [ ] **5. Đồng bộ Icon Vector:** Toàn bộ icon sử dụng đúng bộ font Iconsax (`.isax`, `.isax-b`). Không còn dấu `+` text thô hay Emoji không đồng bộ.
- [ ] **6. Build Thành Công:** Lệnh `npm run build` chạy thành công với mã thoát 0, không có lỗi cảnh báo TypeScript hoặc CSS vỡ.
