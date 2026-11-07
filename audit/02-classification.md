# BẢNG PHÂN LOẠI TÀI NGUYÊN HỆ THỐNG (CLASSIFICATION AUDIT)
**Dự án:** Hệ thống Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn:** Bệnh viện Da liễu Trung ương  
**Vai trò thực hiện:** Product Design Engineer & Information Architect  
**Ngày thực hiện:** 08/11/2026  
**Trạng thái:** Bước 2 — Phân loại (Không can thiệp sửa đổi code)

---

## 1. Nguyên Tắc Phân Loại 4 Nhãn

1. **`PUBLIC-USER`**: Giao diện hoặc tài nguyên dành cho người dùng đại chúng (hoặc người dùng chưa đăng nhập). Ngôn ngữ bắt buộc phải đời thường, thân thiện, trấn an, độ tương phản cao, dễ hiểu cho cả bệnh nhân lớn tuổi.
2. **`ROLE-GATED`**: Giao diện dành riêng cho một vai trò cụ thể (Bệnh nhân, Bác sĩ điều trị, Quản trị viên). Bắt buộc được bảo vệ bởi bộ lọc xác thực (`authGuard`) và phân quyền vai trò.
3. **`INTERNAL-DEV`**: Công cụ, tài liệu, bảng token, showcase thiết kế, môi trường thử nghiệm chỉ dành cho đội ngũ kỹ thuật/thiết kế nội bộ. Tuyệt đối không xuất hiện trên menu người dùng và phải bị vô hiệu hóa trên môi trường production.
4. **`REMOVE`**: Thành phần rác, trang thừa từ template ban đầu, dữ liệu giả lập không khớp nghiệp vụ, thương hiệu bên ngoài hoặc file bỏ hoang cần dọn dẹp hoặc cách ly.

---

## 2. Bảng Phân Loại Chi Tiết Tuyến Đường & Màn Hình

| STT | Tên mục / Tuyến đường | Nhãn phân loại | Lý do phân loại | Mức độ rủi ro nếu để lộ | Đề xuất xử lý |
|:---:|:---|:---:|:---|:---:|:---|
| 1 | `/login` | `PUBLIC-USER` | Điểm tiếp cận đầu tiên của mọi người dùng hệ thống. Cần ngôn ngữ trang trọng, thuần Việt, chuẩn mực y tế. | **Trung bình** (hiện đang lộ thuật ngữ kỹ thuật "RBAC 3 cấp" và các nút mock login "admin", "doctor") | Giữ lại; sửa ngôn ngữ "RBAC" thành "Phân quyền theo chức năng y tế", ẩn các nút mock login khi build production. |
| 2 | `/patient/home` | `ROLE-GATED` (Patient) | Màn hình chính của bệnh nhân để xem lời dặn, lịch sử khám và nhắc nhở chấm điểm. | **Thấp** | Bảo vệ bằng `authGuard (role: patient)`, chuẩn hóa lời nhắc nhở không dùng mã biến kỹ thuật. |
| 3 | `/patient/emergency` | `ROLE-GATED` (Patient) | Cổng sàng lọc khẩn cấp phát hiện sốc phản vệ và phân loại thời gian bệnh. | **Cao** (nếu bệnh nhân hiểu sai do thuật ngữ y khoa phức tạp có thể nguy hiểm tính mạng) | Bảo vệ bằng `authGuard (role: patient)`, bỏ từ tiếng Anh "RED FLAGS", dùng từ ngữ thuần Việt khẩn cấp, dễ hiểu cho người cao tuổi. |
| 4 | `/patient/intake` | `ROLE-GATED` (Patient) | Biểu mẫu khai báo tiền sử dị ứng và triệu chứng mày đay của người bệnh. | **Thấp** | Bảo vệ bằng `authGuard (role: patient)`, gỡ bỏ mã hồ sơ cứng `BA-2026-0101`, dùng dữ liệu động. |
| 5 | `/patient/uas7` | `ROLE-GATED` (Patient) | Nhật ký theo dõi hoạt động bệnh hàng ngày theo chuẩn quốc tế. | **Trung bình** (bệnh nhân bối rối trước mã biến `iss7`, `hss7`, `EMR`) | Bảo vệ bằng `authGuard (role: patient)`, thay toàn bộ tên biến kỹ thuật bằng nhãn trực quan ("Điểm sẩn phù", "Điểm ngứa ngáy"). |
| 6 | `/patient/lesions` | `ROLE-GATED` (Patient) | Giao diện tải ảnh tổn thương 3 thời điểm và ghi nhận đợt bùng phát. | **Trung bình** (lộ thuật ngữ `AUAS`, `Milestone`, `Body Map`) | Bảo vệ bằng `authGuard (role: patient)`, dịch chuẩn sang tiếng Việt thân thiện ("Vị trí tổn thương", "Giai đoạn chụp ảnh"). |
| 7 | `/patient/profile` | `ROLE-GATED` (Patient) | Quản lý thông tin định danh cá nhân và số điện thoại người thân khẩn cấp. | **Thấp** (đang lộ dòng chữ kỹ thuật "Chuẩn API HL7/FHIR") | Bảo vệ bằng `authGuard (role: patient)`, thay bằng câu cam kết bảo mật thông tin chuẩn quy định Bộ Y Tế. |
| 8 | `/doctor/queue` | `ROLE-GATED` (Doctor) | Hàng đợi tiếp nhận ca khám phân luồng theo thời gian thực dành cho bác sĩ. | **Trung bình** (chỉ bác sĩ được xem danh sách bệnh nhân) | Bảo vệ nghiêm ngặt bằng `authGuard (role: doctor)`. |
| 9 | `/doctor/consultation/:id` | `ROLE-GATED` (Doctor) | Buồng khám bệnh lâm sàng chuyên sâu, kê đơn thuốc và chỉ định xét nghiệm. | **Cao** (chứa hồ sơ bệnh án, dữ liệu lâm sàng nhạy cảm) | Bảo vệ nghiêm ngặt bằng `authGuard (role: doctor)`, chuẩn hóa các thuật ngữ viết tắt tiếng Anh thành thuật ngữ chuyên khoa chuẩn. |
| 10 | `/admin/dashboard` | `ROLE-GATED` (Admin) | Trung tâm giám sát toàn bộ hoạt động khám chữa bệnh và cơ sở vật chất. | **Cao** (chỉ dành riêng cho quản trị viên bệnh viện) | Bảo vệ nghiêm ngặt bằng `authGuard (role: admin)`, thay các từ tiếng Anh ("Form Builder Studio", "sections") bằng tiếng Việt. |
| 11 | `/admin/topology` | `ROLE-GATED` (Admin) | Quản lý cơ cấu phân cấp chi nhánh, khoa phòng và phòng khám. | **Cao** (ảnh hưởng cấu trúc tổ chức bệnh viện) | Bảo vệ bằng `authGuard (role: admin)`, loại bỏ ngôn ngữ kỹ thuật CSDL (`RESTRICT`, `ON DELETE SET NULL`, `department_id = NULL`). |
| 12 | `/admin/users` | `ROLE-GATED` (Admin) | Quản lý hồ sơ công tác, phân công phòng khám cho bác sĩ và tài khoản người dùng. | **Cao** (quyền quản trị nhân sự và tài khoản) | Bảo vệ bằng `authGuard (role: admin)`, loại bỏ thuật ngữ CSDL (`created_by = NULL`). |
| 13 | `/admin/rbac` | `ROLE-GATED` (Admin) | Cấu hình ma trận vai trò và phân quyền chức năng. | **Cao** (ảnh hưởng an ninh hệ thống) | Bảo vệ bằng `authGuard (role: admin)`, chuẩn hóa hiển thị mã quyền thành mô tả hành động rõ ràng. |
| 14 | `/admin/form-builder` | `ROLE-GATED` (Admin) | Công cụ tạo lập và hiệu chỉnh bộ câu hỏi phiếu khám y tế động. | **Cao** (ảnh hưởng cấu trúc thu thập bệnh án) | Bảo vệ bằng `authGuard (role: admin)`, loại bỏ việc hiển thị tên cột kỹ thuật (`parent_question_id`, `show_if_answer`, `filled_by`). |
| 15 | `/design-system` | `INTERNAL-DEV` | **Trang Design System Hub (915 dòng)** giới thiệu quy chuẩn Base Web, bảng token, mã hex, font glyphs. | **Cao** (lộ toàn bộ cấu trúc công nghệ, token, làm rối mắt người dùng cuối, hiện đang nằm công khai trên thanh menu của bác sĩ) | **Cách ly hoàn toàn**: Gỡ khỏi sidebar người dùng cuối, di chuyển route sang `/internal/design-system`, áp dụng Guard nội bộ và cờ môi trường chỉ hiển thị trong môi trường development. Thêm thẻ meta `noindex, nofollow`. |
| 16 | `/demo/forms` & `/demo/tables` | `REMOVE` | Hai trang demo linh kiện gốc của TailAdmin không phục vụ nghiệp vụ y tế bệnh viện. | **Trung bình** (người dùng truy cập gây hoang mang, làm phân tán trải nghiệm sản phẩm) | Loại bỏ khỏi `app.routes.ts` trong đợt refactor bước 4. |
| 17 | Thư mục trang mẫu template (`blank`, `calender`, `charts`, `dashboard/ecommerce`, `invoices`, `profile`, `ui-elements`) | `REMOVE` | Các component tàn dư từ template TailAdmin ban đầu (thương mại điện tử, hóa đơn, linh kiện mẫu). | **Thấp** (tăng dung lượng bundle build không cần thiết) | Đánh dấu xóa/cách ly trong bước xử lý. |
| 18 | `app-notification-dropdown` (Dữ liệu mẫu TailAdmin) | `REMOVE` | Chứa dữ liệu tiếng Anh giả lập về "Terry Franci", "Project - Nganter App". | **Cao** (làm mất tính nghiêm túc của hệ thống y tế cấp Bộ) | Thay thế bằng dữ liệu thông báo y tế thực tế từ `DrmaydayService.notifications()`. |
| 19 | Tiêu đề TailAdmin trong `app.component.ts` & `not-found.component.html` | `REMOVE` | Chuỗi `Angular Ecommerce Dashboard | TailAdmin` và bản quyền `© TailAdmin`. | **Cao** (vi phạm quy tắc Zero External Branding) | Thay bằng tiêu đề chuẩn hóa `DrMayDay - Bệnh viện Da liễu Trung ương`. |
| 20 | 42 lệnh `console.log` trong code | `REMOVE` | Ghi log trình duyệt các thao tác click và thông tin mật khẩu cũ. | **Cao** (rủi ro bảo mật và rò rỉ dữ liệu bảng điều khiển DevTools) | Xóa sạch trong bản build production. |

---

## 3. Bảng Phân Loại Chuỗi Văn Bản & Thuật Ngữ

| Nhóm chuỗi / Thuật ngữ | Nhãn phân loại | Mức độ rủi ro | Đề xuất xử lý |
|:---|:---:|:---:|:---|
| Tên biến kỹ thuật: `iss7`, `hss7`, `daily_score`, `auas_score` | `INTERNAL-DEV` | **Cao** | Chuyển đổi sang từ ngữ thuần Việt trên lớp giao diện: "Điểm sẩn phù", "Điểm ngứa", "Tổng điểm ngày", "Chỉ số hoạt động tự động". |
| Thuật ngữ CSDL: `RESTRICT`, `ON DELETE SET NULL`, `created_by = NULL`, `parent_question_id` | `INTERNAL-DEV` | **Cao** | Thay bằng câu thông báo nghiệp vụ rõ ràng: "Không thể xóa khi còn phòng trực thuộc", "Tự động chuyển trạng thái Chưa phân khoa", v.v. |
| Mã enum kỹ thuật: `ROLE_ADMIN`, `ROLE_DOCTOR`, `ROLE_PATIENT`, `filled_by: both` | `INTERNAL-DEV` | **Trung bình** | Sử dụng từ điển nhãn hiển thị: "Quản trị viên", "Bác sĩ", "Người bệnh", "Người bệnh & Bác sĩ". |
| Thuật ngữ tiếng Anh lẻ tẻ: `RED FLAGS`, `Acute`, `Chronic`, `Body Map`, `Milestone`, `sections` | `INTERNAL-DEV` | **Trung bình** | Việt hóa hoàn toàn phù hợp với tâm lý người bệnh: "Dấu hiệu nguy hiểm", "Cấp tính", "Mạn tính", "Vị trí cơ thể", "Giai đoạn ảnh". |
| Thuật ngữ công nghệ: `API HL7/FHIR`, `JSON Tree`, `AES-256`, `EMR` | `INTERNAL-DEV` | **Trung bình** | Đơn giản hóa thành lời khẳng định an tâm cho bệnh nhân: "Dữ liệu được lưu trữ an toàn theo tiêu chuẩn Bộ Y Tế". |
| Emoji thô: `🩺 BÁC SĨ`, `🛡️ Quản trị viên`, `👤 Bệnh nhân` | `REMOVE` | **Trung bình** | Thay thế bằng biểu tượng vector Iconsax chuẩn theo quy chuẩn Uber Base Design System (`.isax-b.icon-health`, `.isax-b.icon-shield-tick`, `.isax-b.icon-user`). |
