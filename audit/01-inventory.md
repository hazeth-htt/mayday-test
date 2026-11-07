# BÁO CÁO KIỂM KÊ TOÀN DIỆN HỆ THỐNG (INVENTORY AUDIT)
**Dự án:** Hệ thống Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn:** Bệnh viện Da liễu Trung ương  
**Vai trò thực hiện:** Product Design Engineer & Information Architect  
**Ngày kiểm kê:** 08/11/2026  
**Trạng thái:** Bước 1 — Kiểm kê (Không can thiệp sửa đổi code)

---

## 1. Kiểm kê các Tuyến Đường (Routes) & Trang Ứng Dụng

Toàn bộ hệ thống định tuyến được cấu hình tại `admin_template/src/app/app.routes.ts`. Dưới đây là bảng kiểm kê chi tiết:

| STT | Tuyến đường (Route Path) | Component phụ trách | Mục đích nghiệp vụ | Cơ chế bảo vệ (Guards) | Ai đang truy cập được hiện tại |
|:---:|:---|:---|:---|:---|:---|
| 1 | `/login` | `LoginComponent` | Trang xác thực đăng nhập người dùng | Không có guard | **Công khai (Public)** |
| 2 | `/` (root) | Redirects to `/login` | Chuyển hướng người dùng vào cổng đăng nhập | Redirect | **Công khai (Public)** |
| 3 | `/admin/dashboard` | `AdminDashboardComponent` | Bảng điều khiển quản trị trung tâm, thống kê ca khám, hạ tầng, bác sĩ | `authGuard`, `data: { role: 'admin' }` | **Quản trị viên (Admin)** |
| 4 | `/admin/topology` | `TopologyComponent` | Quản lý cơ cấu hạ tầng: Chi nhánh, Khoa phòng, Phòng khám | `authGuard`, `data: { role: 'admin' }` | **Quản trị viên (Admin)** |
| 5 | `/admin/users` | `UserStaffComponent` | Quản trị nhân sự y tế, phân công công tác theo phòng | `authGuard`, `data: { role: 'admin' }` | **Quản trị viên (Admin)** |
| 6 | `/admin/rbac` | `RbacMatrixComponent` | Ma trận phân quyền vai trò (Admin, Doctor, Patient) và chức năng | `authGuard`, `data: { role: 'admin' }` | **Quản trị viên (Admin)** |
| 7 | `/admin/form-builder` | `FormBuilderComponent` | Bộ công cụ thiết kế biểu mẫu động 4 tầng (Templates, Sections, Questions, Options) | `authGuard`, `data: { role: 'admin' }` | **Quản trị viên (Admin)** |
| 8 | `/doctor/queue` | `WaitingQueueComponent` | Hàng đợi ca khám lâm sàng theo trạng thái (Chờ khám, Đang khám, Đã xong) | `authGuard`, `data: { role: 'doctor' }` | **Bác sĩ (Doctor)** |
| 9 | `/doctor/consultation/:id` | `ConsultationComponent` | Phòng khám chi tiết: Bệnh sử, Form động, UAS7, Ảnh 3 mốc AI, Đơn thuốc, Cận lâm sàng | `authGuard`, `data: { role: 'doctor' }` | **Bác sĩ (Doctor)** |
| 10 | `/patient/home` | `PatientHomeComponent` | Trang chủ bệnh nhân: Nhắc nhở chấm UAS7, tóm tắt ca khám gần nhất, phím tắt nhanh | `authGuard`, `data: { role: 'patient' }` | **Bệnh nhân (Patient)** |
| 11 | `/patient/emergency` | `EmergencyScreeningComponent` | Sàng lọc dấu hiệu báo động đỏ (Red Flags - nguy cơ phản vệ) & phân loại cấp/mạn | `authGuard`, `data: { role: 'patient' }` | **Bệnh nhân (Patient)** |
| 12 | `/patient/screening` | Redirects to `/patient/emergency` | Tuyến alias cho sàng lọc khẩn cấp | Redirect | **Bệnh nhân (Patient)** |
| 13 | `/patient/intake` | `DynamicIntakeComponent` | Phiếu khai báo bệnh án điện tử động theo mẫu bệnh viện | `authGuard`, `data: { role: 'patient' }` | **Bệnh nhân (Patient)** |
| 14 | `/patient/uas7` | `Uas7ScoringComponent` | Nhật ký chấm điểm sẩn phù (iss7) & ngứa (hss7) 24h và biểu đồ tuần | `authGuard`, `data: { role: 'patient' }` | **Bệnh nhân (Patient)** |
| 15 | `/patient/lesions` | `LesionTrackerComponent` | Kho ảnh tổn thương 3 mốc (Khởi phát, Đỉnh điểm, Hồi phục) và đợt bùng phát | `authGuard`, `data: { role: 'patient' }` | **Bệnh nhân (Patient)** |
| 16 | `/patient/profile` | `PatientProfileComponent` | Hồ sơ cá nhân bệnh nhân, CCCD, thông tin liên hệ khẩn cấp | `authGuard`, `data: { role: 'patient' }` | **Bệnh nhân (Patient)** |
| 17 | `/design-system` | `DesignSystemShowcaseComponent` | **Design System PulseCore Hub**: Tài liệu token, màu sắc, typography, button, icon | **KHÔNG CÓ GUARD** | **MỌI NGƯỜI (Ai truy cập cũng thấy, link trực tiếp trên sidebar Bác sĩ & Admin)** |
| 18 | `/demo/forms` | `FormElementsComponent` | Trang demo linh kiện biểu mẫu TailAdmin | **KHÔNG CÓ GUARD** | **MỌI NGƯỜI (Public via URL)** |
| 19 | `/demo/tables` | `BasicTablesComponent` | Trang demo linh kiện bảng biểu TailAdmin | **KHÔNG CÓ GUARD** | **MỌI NGƯỜI (Public via URL)** |
| 20 | `**` | `NotFoundComponent` | Trang báo lỗi không tìm thấy tài nguyên | Catch-all | **Mọi người dùng** |

### Các module & trang mồ côi (Unrouted / Dead Pages) trong source code:
Các thư mục trang tồn tại trong `src/app/pages/` nhưng không được khai báo trong `app.routes.ts`:
- `src/app/pages/auth-pages/sign-in` & `sign-up` (Dư thừa từ template gốc TailAdmin).
- `src/app/pages/blank` (Trang mẫu trắng TailAdmin).
- `src/app/pages/calender` (Lịch cá nhân mẫu).
- `src/app/pages/charts/bar-chart` & `line-chart` (Biểu đồ mẫu không gắn nghiệp vụ).
- `src/app/pages/dashboard/ecommerce` (Trang thương mại điện tử gốc TailAdmin).
- `src/app/pages/invoices` (Hóa đơn bán hàng thương mại).
- `src/app/pages/profile` (Trang hồ sơ cá nhân Musharof từ template).
- `src/app/pages/ui-elements/...` (`alerts`, `avatar-element`, `badges`, `buttons`, `images`, `videos`).

---

## 2. Kiểm kê Các Điểm Hiển Thị Chuỗi Văn Bản Ra Giao Diện Người Dùng (UI Strings)

### 2.1. Thanh điều hướng & Menu (Sidebar & Header)
- **Sidebar Header Brand:**
  - Văn bản: `DrMayDay` / `BV Da Liễu Trung Ương`
  - Biểu tượng logo: Ký tự văn bản thô `+` (chưa dùng icon vector Iconsax chuẩn).
- **Sidebar Menu Section:**
  - Tiêu đề nhóm: `MENU` (Tiếng Anh lẫn lộn trong giao diện tiếng Việt).
  - Mục `Design System Hub` (Đang nằm trong menu của Bác sĩ và Admin).
  - Tuyến cố định trong menu Bác sĩ: `/doctor/consultation/rec-001` (Lộ mã ID mock `rec-001`).
- **Sidebar Footer Widget:**
  - `Bệnh viện Da liễu TW`, `Hotline hỗ trợ & Cấp cứu: 1900 6951`, `Hệ thống Quản lý Bệnh án DrMayDay v1.0`.
  - Icon: Ký tự dấu cộng `+` thô.
- **Header:**
  - Huy hiệu vai trò: Chứa emoji không đồng bộ (`🩺 BÁC SĨ`, `🛡️ Quản trị viên`, `👤 Bệnh nhân`).
  - Dropdown Thông báo (`app-notification-dropdown`): Hiển thị chuỗi tiếng Anh và dữ liệu mẫu template ("Terry Franci requests permission to change Project - Nganter App", "5 min ago", "View All Notifications").

### 2.2. Trang Đăng Nhập (`LoginComponent`)
- Tiêu đề & Giới thiệu: "Hệ Thống Quản Lý Lâm Sàng Mày Đay", "Phân quyền RBAC 3 cấp (Admin, Bác sĩ, Bệnh nhân)" (Lộ thuật ngữ kỹ thuật `RBAC`).
- Nút truy cập nhanh: "Tài Khoản Thử Nghiệm Nhanh", nhãn phụ hiển thị mã role kỹ thuật dạng monospace: `admin`, `doctor`, `patient`.

### 2.3. Phân Hệ Bệnh Nhân (Patient Portal)
- **Sàng lọc khẩn cấp (`EmergencyScreeningComponent`):**
  - Tiêu đề khối: `BƯỚC 0: SÀNG LỌC DẤU HIỆU "BÁO ĐỘNG ĐỎ" (RED FLAGS — NGUY CƠ PHẢN VỆ)`. Lộ thuật ngữ tiếng Anh `RED FLAGS`.
  - Nhãn phân loại: `Mày đay Cấp tính (Acute)`, `Mày đay Mạn tính (Chronic)`, `Tiêu chuẩn EAACI / GA²LEN`, `Phù mạch thanh quản (Angioedema)`.
- **Nhật ký UAS7 (`Uas7ScoringComponent`):**
  - Phụ đề banner: `Theo dõi mức độ nổi sẩn phù (iss7) và cơn ngứa (hss7) trong 24 giờ`.
  - Nhãn câu hỏi: `1. Số lượng nốt sẩn phù trong ngày (iss7: 0 - 3)`, `2. Mức độ ngứa da (hss7: 0 - 3)`.
  - Tổng điểm: `TỔNG ĐIỂM NGÀY HÔM NAY (Daily UAS = iss7 + hss7)`.
  - Chân trang: `* Dữ liệu tự động đồng bộ vào Bệnh án EMR của bác sĩ` (Lộ từ viết tắt CNTT y tế `EMR`).
  - Tiêu đề bảng: `Điểm Sẩn (iss7)`, `Điểm Ngứa (hss7)`.
- **Nhật ký tổn thương (`LesionTrackerComponent`):**
  - Banner: `AI Assisted` (Thuật ngữ tiếng Anh).
  - Phụ đề: `Khởi phát (start) → Đỉnh điểm (peak) → Hồi phục (normal)`.
  - Nhãn bộ phận: `Vị trí cơ thể xuất hiện tổn thương (Body Map):` (Lộ thuật ngữ `Body Map`).
  - Nhãn mốc: `Mốc thời gian chụp ảnh (Milestone):` (Lộ thuật ngữ `Milestone`).
  - Mô tả thuật toán AI: `Hệ thống AI tự động phát hiện viền sẩn, đếm số lượng nốt sẩn và tính điểm AUAS` (Lộ từ viết tắt kỹ thuật `AUAS`).
- **Phiếu khai báo động (`DynamicIntakeComponent`):**
  - Thông báo thành công: `Hệ thống đã tự động liên kết câu trả lời với hồ sơ bệnh án BA-2026-0101` (Mã hồ sơ tĩnh `BA-2026-0101`).
- **Hồ sơ bệnh nhân (`PatientProfileComponent`):**
  - Chân trang: `* Chuẩn API HL7/FHIR đồng bộ cơ sở dữ liệu quốc gia` (Lộ thuật ngữ giao thức CNTT y tế `API HL7/FHIR`).

### 2.4. Phân Hệ Bác Sĩ (Doctor Portal)
- **Hàng đợi khám (`WaitingQueueComponent`):**
  - Thẻ ca khám: Hiển thị mã thô `rec.record_code` (e.g. `BA-2026-0101`).
  - Toast thông báo: `Đã tiếp nhận ca khám BA-2026-0101 cho TS.BS. Nguyễn Văn Hùng!`.
- **Khám lâm sàng (`ConsultationComponent`):**
  - Nhãn tag: `TMPL_MAY_DAY_MAN_V2` (Lộ mã code template kỹ thuật).
  - Phụ đề: `Khai thác tự động từ bộ câu hỏi Form động (Từ điển 183 biến lâm sàng)` (Lộ ghi chú nghiên cứu nội bộ).
  - Thuật ngữ: `Phù mạch (Angioedema)`, `(iss7: 0-3)`, `(hss7: 0-3)`, `AI: 24 nốt sẩn (AUAS: 3.8)`, `khuyến cáo EAACI`, `CSU`.

### 2.5. Phân Hệ Quản Trị (Admin Portal)
- **Bảng điều khiển (`AdminDashboardComponent`):**
  - Lối tắt: `Form Builder Studio` (Tiếng Anh).
  - Thống kê hạ tầng: `Topology kiểm soát RESTRICT` (Lộ thuật ngữ ràng buộc CSDL).
  - Thống kê mẫu phiếu: `{{ drmayday.templates()[0].sections?.length || 0 }} sections` (Lẫn chữ `sections` tiếng Anh), `TMPL_MAY_DAY_MAN_V2`.
- **Hạ tầng (`TopologyComponent`):**
  - Phụ đề trang: `(Ràng buộc toàn vẹn RESTRICT và SET NULL)`.
  - Phụ đề tab: `Ràng buộc: RESTRICT khi xóa — chặn xóa nếu còn khoa hoặc nhân sự trực thuộc`.
  - Nút bấm: `Xóa (RESTRICT)`, `Xóa (SET NULL)`.
  - Phụ đề tab 2: `Ràng buộc: ON DELETE SET NULL tại bảng rooms — khi xóa khoa, phòng giữ nguyên và department_id = NULL`.
  - Dropdown: `-- Chưa phân khoa (Có thể SET NULL) --`.
  - Hộp thoại confirm JS: `Xóa khoa này sẽ kích hoạt ON DELETE SET NULL cho các phòng trực thuộc. Tiếp tục?`.
- **Nhân sự (`UserStaffComponent`):**
  - Phụ đề danh sách: `Ràng buộc toàn vẹn: Khi xóa User, giữ nguyên hồ sơ bệnh án (created_by = NULL)`.
  - Badge role: Hiển thị mã monospace in hoa `ADMIN`.
- **Bộ tạo mẫu phiếu (`FormBuilderComponent`):**
  - Phụ đề: `Template → Sections (filled_by) → Questions → Options kèm điều kiện rẽ nhánh (parent_question_id, show_if_answer)`.
  - Nút: `Xuất JSON Tree`.
  - Tag role: Hiển thị trực tiếp enum CSDL `patient`, `doctor`, `both`.
  - Điều kiện rẽ nhánh: `↳ Rẽ nhánh: Chỉ hiện khi câu cha = "true"`.
  - Giá trị lựa chọn: `{{ opt.label }} ({{ opt.value }})` ví dụ `(opt_01)`.
- **Ma trận phân quyền (`RbacMatrixComponent`):**
  - Tiêu đề: `Ma Trận Phân Quyền Vai Trò (RBAC Matrix)`.
  - Mã vai trò: Hiển thị mã kỹ thuật `ROLE_ADMIN`, `ROLE_DOCTOR`, `ROLE_PATIENT`.
  - Mã quyền: Hiển thị mã kỹ thuật `PERM_TOPOLOGY_WRITE`, `PERM_USER_WRITE`, v.v.

### 2.6. Trang Lỗi 404 (`NotFoundComponent`)
- Tiêu đề: `ERROR`
- Mô tả: `We can’t seem to find the page you are looking for!`
- Nút bấm: `Back to Home Page`
- Bản quyền chân trang: `© 2026 - TailAdmin` (Lộ tên thương hiệu template bên thứ ba).

---

## 3. Kiểm kê Toàn Bộ Tài Liệu & Cấu Trúc Nội Bộ

1. **Trang Design System Hub trên web:**
   - Vị trí: `admin_template/src/app/pages/design-system/design-system-showcase/`
   - Kích thước: 915 dòng HTML / TypeScript.
   - Nội dung: Toàn bộ bảng màu hex, token semantics, cấu trúc CSS classes, hướng dẫn lập trình viên, bảng glyphs 895 icon Iconsax. Đang bị mở công khai.
2. **File Tài liệu trong kho lưu trữ:**
   - `admin_template/README.md`: Tài liệu gốc của bên thứ ba "TailAdmin Angular - Free Angular Tailwind Admin Dashboard Template".
   - `DESIGN_SYSTEM_UBER_BASE.md`: Tài liệu quy chuẩn thiết kế nội bộ dành cho đội ngũ lập trình & UI designer.
   - `TAI_LIEU_NGHIEP_VU_HE_THONG_DRMAYDAY.md`: Đặc tả nghiệp vụ lâm sàng, luồng khám bệnh và sơ đồ CSDL.
   - `GEMINI.md`: Quy tắc cấu hình AI và dự án.
3. **Các file Token & Stylesheet nội bộ:**
   - `admin_template/src/app/core/design-system/uber-base-tokens.css`: File định nghĩa 100% biến CSS `--base-...`.
   - `admin_template/public/fonts/iconsax/iconsax.css`: File font vector icon.
4. **Các ghi chú code / Comment nội bộ:**
   - Trong `admin_template/src/app/core/services/drmayday.service.ts`: Comment ghi mã API (`// API tmpl03: Xuất trọn vẹn cây lồng nhau...`, `// ON DELETE SET NULL...`, `// RESTRICT...`).

---

## 4. Kiểm kê Dữ Liệu Mẫu (Mock / Seed Data)

Toàn bộ dữ liệu mẫu hiện được lưu tại `admin_template/src/app/core/services/mock-data.ts` và tiêm qua `DrmaydayService`:
- **Người dùng mẫu (6 tài khoản):**
  - `u-admin-01`: Quản trị viên Hệ thống (`admin@drmayday.vn`)
  - `u-doc-01`: TS.BS. Nguyễn Văn Hùng (`bshung@dalieu.vn`)
  - `u-doc-02`: ThS.BS. Trần Mai Anh (`maianh.tran@dalieu.vn`)
  - `u-pat-01`: Nguyễn Thị Mai (`nguyenmai@gmail.com`)
  - `u-pat-02`: Trần Quốc Bảo (`quocbao.tran@gmail.com`)
  - `u-pat-03`: Lê Hoàng Long (`hoanglong.le@gmail.com`)
- **Cơ sở hạ tầng mẫu:** 2 Chi nhánh (`CN-HN-01`, `CN-HN-02`), 4 Khoa phòng, 5 Phòng khám.
- **Bệnh án mẫu:** 4 Bệnh án (`rec-001`, `rec-002`, `rec-003`, `rec-004`), mã bệnh án dạng `BA-2026-0101` đến `BA-2026-0104`.
- **Dữ liệu giả lập thông báo (`INITIAL_NOTIFICATIONS`):** Chứa thông báo giả lập cho bệnh nhân và bác sĩ. (Tuy nhiên, dropdown thông báo trên header hiện đang hiển thị dữ liệu tĩnh hardcoded từ TailAdmin: "Terry Franci", "Project - Nganter App").
- **Ảnh tổn thương mẫu:** Liên kết tới các ảnh placeholder trong `public/images/cards/card-01.jpg` đến `card-03.jpg`.

---

## 5. Kiểm kê Cấu Hình Build & Môi Trường

Tại `admin_template/angular.json`:
- **Debug Mode & Source Maps:**
  - Cấu hình `development`: `"sourceMap": true`, `"optimization": false`.
  - Cấu hình `production`: `"outputHashing": "all"`. Chưa cấu hình tắt source map tường minh (`"sourceMap": false`).
- **Biến môi trường (Environment files):**
  - Dự án **CHƯA CÓ** thư mục `src/environments/` hoặc file `environment.ts` / `environment.prod.ts`.
  - Không có cờ môi trường (`isProduction: boolean`) để ẩn các route nội bộ (như `/design-system`) khi build production.
- **Tiêu đề mặc định trong `app.component.ts`:**
  - Dòng 14: `title = 'Angular Ecommerce Dashboard | TailAdmin';` (Tiêu đề gốc thương mại điện tử TailAdmin).
- **Console Log rò rỉ:**
  - 42 vị trí gọi `console.log` trong các component demo/template (`admin_template/src/app/shared/...`), bao gồm cả log nhạy cảm `console.log('Password:', this.password)` trong các form auth cũ.
