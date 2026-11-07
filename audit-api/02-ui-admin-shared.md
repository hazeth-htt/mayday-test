# BẢN ĐỒ HIỆN TRẠNG GIAO DIỆN ADMIN & PHẦN DÙNG CHUNG (02-UI-ADMIN-SHARED)
**Dự án:** Hệ thống Quản trị & Bệnh án DrMayDay — Bệnh viện Da liễu Trung ương  
**Agent thực hiện:** A4 — `ui-mapper-admin-shared`  
**Ngày thực hiện:** 08/11/2026  

---

## 1. TỔNG QUAN PHÂN HỆ QUẢN TRỊ & DÙNG CHUNG

| Phân hệ / Màn hình | Route URL | File Component | Trạng thái kết nối API | Mức độ phụ thuộc Mock Data |
|:---|:---|:---|:---:|:---:|
| **Bảng Điều Khiển Quản Trị** | `/admin/dashboard` | `admin-dashboard.component.ts` | Chưa kết nối | Thống kê đếm từ mảng in-memory |
| **Cơ Sở & Hạ Tầng (Topology)** | `/admin/topology` | `topology.component.ts` | Chưa kết nối | Signals `branches`, `departments`, `rooms` |
| **Nhân Sự & Người Dùng** | `/admin/users` | `user-staff.component.ts` | Chưa kết nối | Signal `users`, modal tạo user & điều chuyển |
| **Ma Trận Phân Quyền (RBAC)** | `/admin/rbac` | `rbac-matrix.component.ts` | Chưa kết nối | Signals `roles`, `permissions` |
| **Bộ Thiết Kế Mẫu Phiếu Khám** | `/admin/form-builder` | `form-builder.component.ts` | Chưa kết nối | Signal `templates` (Cây sections/questions) |
| **Đăng Nhập Hệ Thống** | `/login` | `login.component.ts` | Chưa kết nối | Mock tài khoản `DEMO_ACCOUNTS` (email/pass) |
| **Thanh Tiêu Đề & Thông Báo** | Toàn bộ App | `app-header.component.ts`, `notification-dropdown.component.ts` | Chưa kết nối | Dữ liệu thông báo lấy từ `drmayday.notifications()` |
| **Thanh Điều Hướng (Sidebar)** | Toàn bộ App | `app-sidebar.component.ts` | Đã chuẩn hóa | Menu điều hướng lọc theo vai trò người dùng |
| **Bảo Vệ Route (Guards)** | Toàn bộ App | `auth.guard.ts`, `internal-dev.guard.ts` | Hoạt động tốt | Kiểm tra vai trò client-side qua `AuthService` |

---

## 2. CHI TIẾT TỪNG MÀN HÌNH QUẢN TRỊ & ĐỐI CHIẾU API

### 2.1. Màn hình: Bảng Điều Khiển Quản Trị (`/admin/dashboard`)
* **File:** [`admin-dashboard.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/admin/admin-dashboard/admin-dashboard.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * 4 thẻ chỉ số nhanh: Tổng số Cơ sở chi nhánh, Tổng nhân sự y tế, Tổng số hồ sơ bệnh án, Tổng số ca khẩn cấp.
  * Phân bố ca khám: Đang chờ, Đang khám, Đã kết luận, Ca khẩn cấp.
  * Thẻ truy cập nhanh: Thiết kế mẫu phiếu khám, Kiểm soát liên kết hạ tầng, Quản trị nhân sự.
* **Dữ liệu đang Mock / Hardcode:**
  * Lấy độ dài mảng từ các signals `drmayday.branches().length`, `drmayday.users().length`, `drmayday.records().length`.
* **API thực tế cần gọi:**
  * Backend hiện chưa có riêng API `GET /api/admin/dashboard_stats`. Các số liệu cần được tính từ:
    * `GET /api/branches` (Đếm số chi nhánh)
    * `GET /api/users` (Lấy trường `total` từ response phân trang)
    * `GET /api/medicalrecords` (Lọc theo từng trạng thái `pending`, `in_progress`, `completed`)

---

### 2.2. Màn hình: Cơ Sở & Hạ Tầng Topology (`/admin/topology`)
* **File:** [`topology.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/admin/topology/topology.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * 3 tab quản lý: Chi nhánh y tế (`branches`), Khoa/Phòng ban (`departments`), Phòng khám chức năng (`rooms`).
  * Danh sách dạng bảng:
    * Chi nhánh: Tên, Địa chỉ, SĐT, Số khoa trực thuộc, Số nhân sự.
    * Khoa: Tên khoa, Mô tả, Chi nhánh chủ quản, Số phòng trực thuộc.
    * Phòng: Tên phòng, Khoa trực thuộc, Nhân sự đang trực.
  * 3 Modals: Thêm chi nhánh, Thêm khoa, Thêm phòng khám.
* **Dữ liệu đang Mock / Hardcode:**
  * Signals `branches`, `departments`, `rooms` nạp từ `mock-data.ts`.
  * Form thêm mới có trường `code` (ví dụ `CN-HN-01`, `KHA-DL-01`, `PK-204`) nhưng trong `/api-spec` backend **không có** trường `code` cho Branch, Department, Room.
* **Hành động người dùng:**
  * Thêm, Sửa, Xóa Chi nhánh, Khoa, Phòng.
* **API thực tế cần gọi (Theo `/api-spec`):**
  * **Chi nhánh:** `GET /api/branches`, `POST /api/branches`, `GET /api/branches/{id}`, `PUT /api/branches/{id}`, `DELETE /api/branches/{id}`.
  * **Khoa/Phòng ban:** `GET /api/departments?branch_id=`, `POST /api/departments`, `GET /api/departments/{id}`, `PUT /api/departments/{id}`, `DELETE /api/departments/{id}`.
  * **Phòng khám:** `GET /api/rooms?department_id=`, `POST /api/rooms`, `GET /api/rooms/{id}`, `PUT /api/rooms/{id}`, `DELETE /api/rooms/{id}`.

---

### 2.3. Màn hình: Quản Lý Nhân Sự & Người Dùng (`/admin/users`)
* **File:** [`user-staff.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/admin/user-staff/user-staff.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Lọc người dùng theo vai trò: Tất cả, Bác sĩ, Bệnh nhân, Quản trị viên.
  * Bảng danh sách người dùng: Họ tên, Số điện thoại, Vai trò, Trạng thái (Hoạt động / Khóa), Thời gian tạo.
  * Modal "Thêm Nhân Viên Mới": Họ tên, SĐT, Mật khẩu, Vai trò, Chi nhánh, Khoa, Phòng.
  * Modal "Điều Chuyển / Phân Công Nhân Sự": Chọn Chi nhánh, Khoa, Phòng mới.
* **Dữ liệu đang Mock / Hardcode:**
  * Dữ liệu từ signal `drmayday.users()` in-memory.
  * Chưa có phân trang (`page`, `limit`), chưa hiển thị tổng số bản ghi (`total`).
* **Hành động người dùng:**
  * Lọc vai trò, mở modal tạo tài khoản, mở modal điều chuyển công tác, khóa/xóa tài khoản.
* **API thực tế cần gọi:**
  * `GET /api/users?page=&limit=&role_id=`: Lấy danh sách người dùng phân trang.
  * `GET /api/users/{id}`: Xem chi tiết tài khoản.
  * `POST /api/auth/create_staff`: Admin tạo tài khoản nhân viên y tế (gắn trực tiếp chi nhánh/khoa/phòng).
  * `POST /api/users`: Admin tạo tài khoản người dùng thông thường.
  * `PUT /api/users/{id}`: Cập nhật thông tin / trạng thái khóa tài khoản (`is_active`).
  * `DELETE /api/users/{id}`: Xóa tài khoản người dùng.
  * `PUT /api/staffs/{id}/assign`: Phân công nhân viên vào cơ sở mới `{ branch_id, department_id, room_id }`.

---

### 2.4. Màn hình: Ma Trận Phân Quyền Vai Trò RBAC (`/admin/rbac`)
* **File:** [`rbac-matrix.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/admin/rbac-matrix/rbac-matrix.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Danh sách các vai trò hệ thống: Quản trị viên, Bác sĩ, Bệnh nhân (kèm nút Thêm vai trò mới).
  * Ma trận checkbox các nhóm quyền hạn:
    * Nhóm Quản trị Hạ tầng & Cơ cấu tổ chức
    * Nhóm Quản lý Người dùng & Nhân sự
    * Nhóm Khám bệnh & Hồ sơ lâm sàng
    * Nhóm Kê đơn thuốc & Cận lâm sàng
* **Dữ liệu đang Mock / Hardcode:**
  * Danh sách `roles` và `permissions` từ signal mock in-memory.
  * Click bật/tắt checkbox gọi `drmayday.updateRolePermissions()` ghi mảng ID vào RAM.
* **Hành động người dùng:**
  * Chọn vai trò ở cột trái.
  * Bật/tắt checkbox quyền hạn tương ứng ở cột phải.
  * Mở modal thêm vai trò mới.
* **API thực tế cần gọi:**
  * `GET /api/roles`: Lấy danh sách vai trò.
  * `POST /api/roles`: Thêm vai trò mới `{ name, description, parent_role_id }`.
  * `GET /api/permissions`: Lấy danh mục tất cả quyền hạn có trong hệ thống.
  * `POST /api/permissions`: Thêm quyền mới.
  * `PUT /api/permissions/{id}` & `DELETE /api/permissions/{id}`.
  * `GET /api/roles/{role_id}/permissions`: Lấy danh sách quyền đã được cấp cho vai trò.
  * `POST /api/roles/permissions`: Gán danh sách quyền `{ role_id, permissions: [1, 2, 3] }`.
  * `DELETE /api/roles/{role_id}/permissions/{permission_id}`: Thu hồi quyền cụ thể.

---

### 2.5. Màn hình: Bộ Thiết Kế Mẫu Phiếu Khám Form Builder (`/admin/form-builder`)
* **File:** [`form-builder.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/drmayday/admin/form-builder/form-builder.component.ts) & `.html`
* **Dữ liệu hiển thị:**
  * Cột 1: Danh sách các Mẫu Phiếu Khám (Templates) — ví dụ Mẫu Mày Đay Cấp Tính, Mẫu Mày Đay Mạn Tính.
  * Cột 2: Danh sách các Phân Mục (Sections) trong mẫu đang chọn — Đối tượng điền (Bệnh nhân / Bác sĩ).
  * Cột 3: Danh sách các Câu Hỏi (Questions) & Lựa Chọn (Options) trong phân mục — Logic rẽ nhánh hiển thị.
  * Modal xem cấu trúc cây dữ liệu dạng JSON.
  * Modals thêm Mẫu mới, thêm Phân mục, thêm Câu hỏi.
* **Dữ liệu đang Mock / Hardcode:**
  * Toàn bộ cây mẫu phiếu đọc/ghi trên signal `drmayday.templates()`.
* **Hành động người dùng:**
  * Chọn mẫu ➔ Chọn phân mục ➔ Xem/sửa câu hỏi và điều kiện rẽ nhánh.
  * Thêm/sửa/xóa template, section, question.
* **API thực tế cần gọi:**
  * **Templates:** `GET /api/templates`, `GET /api/templates/{id}` (Lấy cả cây cấu trúc), `POST /api/templates`, `PUT /api/templates/{id}`, `DELETE /api/templates/{id}`.
  * **Sections:** `POST /api/templates/{template_id}/sections`, `PUT /api/templates/sections/{id}`, `DELETE /api/templates/sections/{id}`.
  * **Questions:** `POST /api/templates/sections/{section_id}/questions`, `PUT /api/templates/questions/{id}`, `DELETE /api/templates/questions/{id}`.

---

## 3. PHẦN DÙNG CHUNG (SHARED / AUTH / LAYOUT)

### 3.1. Xác Thực & Đăng Nhập (`/login`)
* **File:** [`login.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/pages/auth/login/login.component.ts) & [`auth.service.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/core/services/auth.service.ts)
* **Hiện trạng:**
  * Đang dùng form đăng nhập bằng **Email** và Mật khẩu đối chiếu với `DEMO_ACCOUNTS`.
  * Chưa có form/màn hình Đăng ký tài khoản (`signup`), Quên mật khẩu (`forgot_password`), Đặt lại mật khẩu OTP (`reset_password`), Đổi mật khẩu (`change_password`).
* **Điểm lệch so với `/api-spec`:**
  * **API Backend `POST /api/auth/login` yêu cầu Số điện thoại (`phone`) và Mật khẩu (`password`)**, KHÔNG dùng email.
  * Response trả về `{ token, user_info: { user_id, full_name, phone, role_id } }`. Frontend cần lưu `token` vào `localStorage` và gắn vào Header mọi request tiếp theo.

### 3.2. Hệ Thống Thông Báo Y Tế (`notification-dropdown`)
* **File:** [`notification-dropdown.component.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/shared/components/header/notification-dropdown/notification-dropdown.component.ts) & `.html`
* **Hiện trạng:**
  * Đã nối với signal `drmayday.notifications()` in-memory.
* **API thực tế cần gọi:**
  * `GET /api/notifications?page=&limit=`: Lấy danh sách thông báo thực tế của user.
  * `PUT /api/notifications/{id}/read`: Đánh dấu đã đọc khi người dùng click vào thông báo.
  * `PUT /api/notifications/read_all`: Đánh dấu tất cả thông báo đã đọc.
  * `POST /api/notifications/fcm_token`: Đăng ký FCM token khi người dùng cấp quyền push notification trên trình duyệt.

### 3.3. Bảo Vệ Tuyến Đường (Guards)
* **File:** [`auth.guard.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/core/guards/auth.guard.ts) và [`internal-dev.guard.ts`](file:///Users/hazeth/BTL_CNWEB/admin_template/src/app/core/guards/internal-dev.guard.ts)
* **Hiện trạng:**
  * Đã kiểm tra `isAuthenticated()` và đối chiếu vai trò `role` được chỉ định trong route data.
  * Khi nối API thật, `auth.guard.ts` cần kiểm tra tính hợp lệ của JWT Token (giải mã hạn dùng exp, bắt lỗi 401 tự động điều hướng về `/login`).
