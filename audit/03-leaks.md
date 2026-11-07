# BẢNG TẬP HỢP CÁC ĐIỂM RÒ RỈ THUẬT NGỮ KỸ THUẬT (LEAK DETECTION)
**Dự án:** Hệ thống Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
**Đơn vị chuyên môn:** Bệnh viện Da liễu Trung ương  
**Vai trò thực hiện:** Product Design Engineer & Information Architect  
**Ngày thực hiện:** 08/11/2026  
**Trạng thái:** Bước 3 — Tìm rò rỉ thuật ngữ (Không can thiệp sửa đổi code)

---

## Bảng Chi Tiết Điểm Rò Rỉ Thuật Ngữ Kỹ Thuật

| STT | Vị trí [File:Dòng] | Chuỗi văn bản đang lộ | Phân loại rò rỉ | Đề xuất thay thế bằng chuỗi chuẩn người dùng |
|:---:|:---|:---|:---|:---|
| 1 | `app-sidebar.component.ts:46` | `{ name: 'Design System Hub', path: '/design-system' }` | Lộ route & trang nội bộ `INTERNAL-DEV` trên menu Admin | Loại bỏ khỏi thanh điều hướng người dùng cuối; chuyển vào route nội bộ `/internal/design-system` |
| 2 | `app-sidebar.component.ts:64` | `{ name: 'Design System Hub', path: '/design-system' }` | Lộ route & trang nội bộ `INTERNAL-DEV` trên menu Bác sĩ | Loại bỏ hoàn toàn khỏi menu Bác sĩ |
| 3 | `app-sidebar.component.ts:60` | `path: '/doctor/consultation/rec-001'` | Lộ mã ID kỹ thuật/mock data cứng (`rec-001`) trên menu | Đổi thành link tới hàng đợi khám `/doctor/queue` hoặc lấy ca khám đang trực |
| 4 | `app-sidebar.component.html:27, 35` | Ký tự text thô `+` | Sử dụng ký tự văn bản thay vì icon font chuẩn | Thay bằng `<span class="isax-b icon-hospital text-xl"></span>` |
| 5 | `app-sidebar.component.html:48` | `Menu` | Từ tiếng Anh lẫn trong giao diện tiếng Việt | Thay bằng `Chức năng chính` hoặc `Danh mục` |
| 6 | `app-sidebar-widget.component.ts:10` | Ký tự text thô `+` | Thiếu đồng bộ icon font | Thay bằng `<span class="isax-b icon-call-calling text-base"></span>` |
| 7 | `app-sidebar-widget.component.ts:20` | `Hệ thống Quản lý Bệnh án DrMayDay v1.0` | Lộ số phiên bản phần mềm nội bộ (v1.0) | Thay bằng `Bệnh viện Da liễu Trung ương` |
| 8 | `app-header.component.ts:46-48` | `🛡️ Quản trị viên`, `🩺 Bác sĩ`, `👤 Bệnh nhân` | Dùng Emoji thô, không đồng bộ với Iconsax font | Bỏ Emoji, chỉ hiển thị nhãn chữ trang nhã kết hợp icon Iconsax (`isax-b icon-shield-tick`, `icon-health`, `icon-user`) |
| 9 | `notification-dropdown.component.html:34` | `Notification` | Tiếng Anh trong giao diện tiếng Việt | Thay bằng `Thông báo y tế` |
| 10 | `notification-dropdown.component.html:76-81` | `Terry Franci requests permission to change Project - Nganter App` | Dữ liệu mẫu rác của template gốc tiếng Anh | Thay bằng danh sách thông báo y tế thực tế từ `drmayday.notifications()` |
| 11 | `notification-dropdown.component.html:110-115` | `Alena Franci requests permission to change...` | Dữ liệu mẫu rác của template gốc | Thay bằng thông báo nhắc nhở lâm sàng (UAS7, đơn thuốc) |
| 12 | `notification-dropdown.component.html:144-149` | `Jocelyn Kenter requests permission...` | Dữ liệu mẫu rác của template gốc | Thay bằng thông báo tiếp nhận ca khám của bác sĩ |
| 13 | `notification-dropdown.component.html:336` | `View All Notifications` | Chuỗi tiếng Anh | Thay bằng `Xem tất cả thông báo` |
| 14 | `app.component.ts:14` | `title = 'Angular Ecommerce Dashboard \| TailAdmin'` | Lộ tên template thương mại điện tử bên ngoài | Thay bằng `DrMayDay - Hệ Thống Quản Lý Bệnh Án Mày Đay \| BV Da liễu TW` |
| 15 | `not-found.component.html:6` | `ERROR` | Tiếng Anh in hoa gây tâm lý giật mình | Thay bằng `Không Tìm Thấy Trang` |
| 16 | `not-found.component.html:13` | `We can’t seem to find the page you are looking for!` | Tiếng Anh trong trang lỗi 404 | Thay bằng `Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển.` |
| 17 | `not-found.component.html:18` | `Back to Home Page` | Nút bấm tiếng Anh | Thay bằng `Quay Về Trang Chủ` |
| 18 | `not-found.component.html:23` | `&copy; {{ currentYear }} - TailAdmin` | Lộ thương hiệu bên thứ ba (TailAdmin) | Thay bằng `© {{ currentYear }} Bệnh viện Da liễu Trung ương` |
| 19 | `login.component.html:36` | `Phân quyền RBAC 3 cấp (Admin, Bác sĩ, Bệnh nhân)` | Lộ thuật ngữ kiến trúc kỹ thuật `RBAC` | Thay bằng `Phân quyền chuyên môn 3 cấp (Quản trị, Bác sĩ, Bệnh nhân)` |
| 20 | `login.component.html:160, 169, 178` | Nhãn monospace `admin`, `doctor`, `patient` | Lộ trực tiếp giá trị enum/role trong CSDL | Thay bằng nhãn vai trò hiển thị: `Quản trị`, `Bác sĩ`, `Bệnh nhân` |
| 21 | `emergency-screening.component.html:31` | `(RED FLAGS — NGUY CƠ PHẢN VỆ)` | Lộ thuật ngữ tiếng Anh in hoa `RED FLAGS` | Thay bằng `(DẤU HIỆU NGUY CẤP — NGUY CƠ PHẢN VỆ)` |
| 22 | `emergency-screening.component.html:75` | `Phù mạch thanh quản (Angioedema)` | Lộ thuật ngữ y khoa chuyên sâu bằng tiếng Anh | Thay bằng `Sưng phù họng, thanh quản (Khó nuốt, khàn tiếng)` |
| 23 | `emergency-screening.component.html:132` | `Tiêu chuẩn EAACI / GA²LEN` | Tên hiệp hội viết tắt tiếng Anh không rõ nghĩa với người bệnh | Thay bằng `Quy chuẩn Hội Dị ứng Quốc tế` |
| 24 | `emergency-screening.component.html:157` | `Mày đay Cấp tính (Acute)` | Lộ từ tiếng Anh `(Acute)` | Thay bằng `Mày đay Cấp tính` |
| 25 | `emergency-screening.component.html:181` | `Mày đay Mạn tính (Chronic)` | Lộ từ tiếng Anh `(Chronic)` | Thay bằng `Mày đay Mạn tính` |
| 26 | `dynamic-intake.component.html:32` | `hồ sơ bệnh án BA-2026-0101` | Mã bệnh án tĩnh bị hardcode | Thay bằng mã bệnh án sinh động hoặc `hồ sơ bệnh án của bạn` |
| 27 | `uas7-scoring.component.html:14` | `sẩn phù (iss7) và cơn ngứa (hss7)` | Lộ trực tiếp tên biến CSDL `iss7`, `hss7` | Thay bằng `mức độ nổi sẩn phù và mức độ ngứa ngáy` |
| 28 | `uas7-scoring.component.html:55` | `1. Số lượng nốt sẩn phù trong ngày (iss7: 0 - 3)` | Lộ tên biến kỹ thuật `iss7` trong câu hỏi | Thay bằng `1. Đánh giá số lượng nốt sẩn phù trong 24 giờ qua:` |
| 29 | `uas7-scoring.component.html:102` | `2. Mức độ ngứa da (hss7: 0 - 3)` | Lộ tên biến kỹ thuật `hss7` trong câu hỏi | Thay bằng `2. Đánh giá mức độ ngứa da trong 24 giờ qua:` |
| 30 | `uas7-scoring.component.html:147` | `(Daily UAS = iss7 + hss7)` | Lộ công thức kỹ thuật và tên biến lập trình | Thay bằng `(Tổng điểm sẩn phù + ngứa trong ngày: 0 - 6 điểm)` |
| 31 | `uas7-scoring.component.html:172` | `* Dữ liệu tự động đồng bộ vào Bệnh án EMR của bác sĩ` | Lộ từ viết tắt CNTT `EMR` | Thay bằng `* Dữ liệu được đồng bộ trực tiếp vào hồ sơ khám của bác sĩ` |
| 32 | `uas7-scoring.component.html:214, 215` | `Điểm Sẩn (iss7)`, `Điểm Ngứa (hss7)` | Tên cột bảng lộ biến kỹ thuật | Thay bằng `Điểm sẩn phù`, `Điểm ngứa ngáy` |
| 33 | `lesion-tracker.component.html:12` | `(start) → Đỉnh điểm (peak) → Hồi phục (normal)` | Lộ mã enum code CSDL `start`, `peak`, `normal` | Thay bằng `Khởi phát → Đỉnh điểm → Thuyên giảm/Lặn sẩn` |
| 34 | `lesion-tracker.component.html:17` | `AI Assisted` | Thuật ngữ tiếng Anh | Thay bằng `Phân tích thông minh` |
| 35 | `lesion-tracker.component.html:64` | `(Body Map):` | Thuật ngữ tiếng Anh | Thay bằng `trên cơ thể:` |
| 36 | `lesion-tracker.component.html:84` | `(Milestone):` | Thuật ngữ tiếng Anh | Thay bằng `của đợt sẩn:` |
| 37 | `lesion-tracker.component.html:91, 99, 107` | `1. Khởi phát (start)`, `2. Đỉnh điểm (peak)`, `3. Hồi phục (normal)` | Lộ mã enum code | Thay bằng `1. Giai đoạn khởi phát`, `2. Giai đoạn bùng phát mạnh nhất`, `3. Giai đoạn sẩn lặn dần` |
| 38 | `lesion-tracker.component.html:145` | `đếm số lượng nốt sẩn và tính điểm AUAS` | Lộ từ viết tắt thuật toán nội bộ `AUAS` | Thay bằng `đếm số nốt sẩn và ước tính mức độ lan rộng` |
| 39 | `patient-profile.component.html:86` | `* Chuẩn API HL7/FHIR đồng bộ cơ sở dữ liệu quốc gia` | Lộ thuật ngữ giao thức lập trình `API HL7/FHIR` | Thay bằng `* Dữ liệu được bảo mật và quản lý theo chuẩn Bộ Y Tế` |
| 40 | `patient-home.component.html:39` | `thang điểm sẩn phù (iss7) và mức độ ngứa (hss7)` | Lộ tên biến kỹ thuật | Thay bằng `thang điểm sẩn phù và mức độ ngứa da` |
| 41 | `consultation.component.html:132` | `Từ điển 183 biến lâm sàng` | Lộ ghi chú đặc tả nghiên cứu đề tài nội bộ | Thay bằng `Hồ sơ thông tin khai thác toàn diện` |
| 42 | `consultation.component.html:135` | `TMPL_MAY_DAY_MAN_V2` | Lộ mã code template kỹ thuật | Thay bằng nhãn hiển thị `Mẫu Khám Mày Đay Mạn Tính` |
| 43 | `consultation.component.html:168` | `Phù mạch (Angioedema)` | Lẫn tiếng Anh trong câu hỏi bác sĩ | Thay bằng `Dấu hiệu phù mạch dưới da` |
| 44 | `consultation.component.html:186` | `(iss7: 0-3) + Điểm Ngứa (hss7: 0-3)` | Lộ biến kỹ thuật | Thay bằng `Điểm sẩn (0-3) + Điểm ngứa (0-3)` |
| 45 | `consultation.component.html:264` | `AI: 24 nốt sẩn (AUAS: 3.8)` | Lộ thuật ngữ thuật toán `AUAS` | Thay bằng `AI nhận diện: 24 nốt sẩn (Điểm tổn thương: 3.8/10)` |
| 46 | `consultation.component.html:294` | `theo khuyến cáo EAACI` | Tên hiệp hội viết tắt không giải thích | Thay bằng `theo phác đồ điều trị quốc tế` |
| 47 | `consultation.component.html:403` | `(CSU)` | Viết tắt tiếng Anh | Thay bằng `Mày đay mạn tính tự phát` |
| 48 | `admin-dashboard.component.html:25, 166` | `Form Builder Studio`, `Mở Trình Thiết Kế Form Builder` | Từ mượn tiếng Anh `Form Builder Studio` | Thay bằng `Thiết Kế Mẫu Phiếu Khám` |
| 49 | `admin-dashboard.component.html:100` | `Topology kiểm soát RESTRICT` | Lộ thuật ngữ CSDL `RESTRICT` | Thay bằng `Kiểm soát toàn vẹn liên kết cơ sở` |
| 50 | `admin-dashboard.component.html:162` | `{{ ... }} sections` | Chữ `sections` tiếng Anh | Thay bằng `{{ ... }} phân mục` |
| 51 | `admin-dashboard.component.html:163` | `{{ drmayday.templates()[0].code_template }}` | Lộ mã template thô `TMPL_MAY_DAY_MAN_V2` | Thay bằng tên hiển thị `Mẫu Mày Đay Mạn Tính` |
| 52 | `topology.component.html:10` | `(Ràng buộc toàn vẹn RESTRICT và SET NULL)` | Lộ thuật ngữ CSDL quan hệ | Thay bằng `(Cơ chế đảm bảo an toàn dữ liệu chuyên sâu)` |
| 53 | `topology.component.html:57` | `Ràng buộc: RESTRICT khi xóa — chặn xóa...` | Lộ từ khóa CSDL `RESTRICT` | Thay bằng `Quy tắc an toàn: Chặn xóa khi còn khoa phòng hoặc nhân sự trực thuộc` |
| 54 | `topology.component.html:98, 197` | `Xóa (RESTRICT)` | Nút bấm mang thuật ngữ CSDL | Thay bằng `Xóa cơ sở` (Kèm tooltip giải thích điều kiện xóa) |
| 55 | `topology.component.html:114` | `Ràng buộc: ON DELETE SET NULL tại bảng rooms — khi xóa khoa...` | Lộ lệnh SQL `ON DELETE SET NULL`, tên bảng `rooms` | Thay bằng `Quy tắc an toàn: Khi xóa khoa phòng, các phòng khám trực thuộc sẽ chuyển về trạng thái chờ phân khoa` |
| 56 | `topology.component.html:148` | `Xóa (SET NULL)` | Nút bấm mang thuật ngữ SQL | Thay bằng `Xóa khoa phòng` |
| 57 | `topology.component.html:301` | `-- Chưa phân khoa (Có thể SET NULL) --` | Lựa chọn dropdown mang thuật ngữ CSDL | Thay bằng `-- Chưa chỉ định khoa phòng phụ trách --` |
| 58 | `topology.component.ts:71` | `Xóa khoa này sẽ kích hoạt ON DELETE SET NULL cho các phòng trực thuộc. Tiếp tục?` | Câu hỏi confirm JS lộ cú pháp CSDL | Thay bằng `Xóa khoa phòng này sẽ chuyển các phòng khám trực thuộc về trạng thái chưa phân khoa. Bạn có chắc chắn muốn xóa?` |
| 59 | `user-staff.component.html:87` | `Ràng buộc toàn vẹn: Khi xóa User, giữ nguyên hồ sơ bệnh án (created_by = NULL)` | Lộ tên cột CSDL `created_by = NULL` | Thay bằng `Quy tắc lưu trữ: Khi hủy tài khoản nhân sự, lịch sử hồ sơ bệnh án đã lập vẫn được bảo toàn nguyên vẹn` |
| 60 | `user-staff.component.html:152` | `ADMIN` (In hoa trong font-mono) | Lộ mã enum CSDL thô | Thay bằng nhãn `Quản trị viên` |
| 61 | `rbac-matrix.component.html:9` | `Ma Trận Phân Quyền Vai Trò (RBAC Matrix)` | Thuật ngữ kỹ thuật viết tắt `RBAC Matrix` | Thay bằng `Ma Trận Phân Quyền Vai Trò Hệ Thống` |
| 62 | `rbac-matrix.component.html:54, 74` | `{{ role.code }}` (e.g. `ROLE_ADMIN`, `ROLE_DOCTOR`) | Lộ mã định danh vai trò kỹ thuật | Thay bằng tên hiển thị vai trò; mã code chỉ hiển thị dạng tooltip phụ trợ |
| 63 | `rbac-matrix.component.html:87` | `1. Phân Hệ Quản Trị Hệ Thống (ADMIN)` | Lộ mã enum `ADMIN` | Thay bằng `1. Phân Hệ Quản Trị Hệ Thống` |
| 64 | `rbac-matrix.component.html:99` | `{{ perm.code }}` (e.g. `PERM_TOPOLOGY_WRITE`) | Lộ mã quyền kỹ thuật | Hiển thị tên quyền hành động rõ nghĩa, ẩn mã code hoặc đưa vào tooltip |
| 65 | `form-builder.component.html:11` | `(parent_question_id, show_if_answer)` | Lộ tên thuộc tính CSDL | Thay bằng `kèm điều kiện hiển thị tự động theo câu trả lời trước` |
| 66 | `form-builder.component.html:20, 349` | `Xuất JSON Tree`, `Cấu Trúc Cây Dữ Liệu Biểu Mẫu (JSON Tree)` | Lộ thuật ngữ cấu trúc lập trình `JSON Tree` | Thay bằng `Xem Cấu Trúc Dữ Liệu Mẫu` |
| 67 | `form-builder.component.html:45, 77` | `(Templates)`, `(Sections)` | Lẫn tiếng Anh trong tiêu đề cột | Thay bằng `1. Mẫu Phiếu Khám`, `2. Các Phân Mục` |
| 68 | `form-builder.component.html:105` | `{{ sec.filled_by }}` (e.g. `patient`, `doctor`, `both`) | Lộ enum CSDL thô | Thay bằng nhãn: `Bệnh nhân điền`, `Bác sĩ điền`, `Cả hai bên` |
| 69 | `form-builder.component.html:147` | `{{ q.question_type }}` (e.g. `radio`, `checkbox`) | Lộ tên kiểu dữ liệu thô | Thay bằng nhãn trực quan: `Chọn một (Radio)`, `Chọn nhiều (Checkbox)`, `Văn bản`, v.v. |
| 70 | `form-builder.component.html:168` | `↳ Rẽ nhánh: Chỉ hiện khi câu cha = "{{ q.show_if_answer }}"` | Biểu thức logic rẽ nhánh thô | Thay bằng `↳ Hiển thị khi trả lời: "{{ getOptionLabel(q.show_if_answer) }}"` |
| 71 | `form-builder.component.html:178` | `{{ opt.label }} ({{ opt.value }})` | Lộ giá trị nội bộ `(opt_01)` | Chỉ hiển thị nhãn của lựa chọn `{{ opt.label }}` |
| 72 | Toàn bộ `admin_template/src/app/shared/...` | 42 lệnh `console.log` | Ghi thông tin gỡ lỗi và mật khẩu ra DevTools console | Loại bỏ toàn bộ `console.log` trong code |
