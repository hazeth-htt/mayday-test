# MA TRẬN TRUY VẾT YÊU CẦU HAI CHIỀU (12-TRACEABILITY)

> **Dự án:** Hệ thống Quản trị & Quản lý Bệnh án Lâm sàng Mày đay — DrMayDay  
> **Đơn vị:** Bệnh viện Da liễu Trung ương  
> **Quy ước trạng thái:**  
> • **ĐẦY ĐỦ:** Đã kết nối API thật/mock layer, có giao diện chuẩn Design System, đủ trạng thái dữ liệu.  
> • **MỘT PHẦN:** Đã có giao diện và API cơ bản, nhưng thiếu một số trường nghiệp vụ hoặc thiếu xử lý ngoại lệ.  
> • **CHỈ GIAO DIỆN:** Màn hình tĩnh, chưa có API kết nối hoặc đang dùng mock cứng.  
> • **THIẾU:** Tài liệu/API spec có yêu cầu nhưng hệ thống frontend chưa xây dựng.  
> • **NGOÀI PHẠM VI:** Chức năng do phân hệ khác (HIS/Backend) phụ trách, không thuộc Web Frontend.  

---

## 1. CHIỀU 1: TÀI LIỆU CHUẨN &rarr; HỆ THỐNG HIỆN TẠI

| Mã REQ | Nội dung nghiệp vụ | Luồng | Màn hình / Route | Component phụ trách | API Endpoint tương ứng | Quyền hạn | Trạng thái hiện tại |
|:---:|:---|:---:|:---|:---|:---|:---:|:---:|
| **REQ-001** | Đăng nhập SĐT + Mật khẩu | P1, D1, A1 | `/login` | `LoginComponent` | `POST /api/auth/login` | Public | **ĐẦY ĐỦ** |
| **REQ-002** | Đăng ký tài khoản mới | P1 | `/register` | *Chưa tách route riêng (đang có logic trong Auth)* | `POST /api/auth/signup` | Public | **MỘT PHẦN** |
| **REQ-003** | Đăng xuất an toàn | Chung | Header dropdown | `UserDropdownComponent` | `POST /api/auth/logout` | All | **ĐẦY ĐỦ** |
| **REQ-004** | Quên & đặt lại mật khẩu | X1 | `/forgot-password` | *Chưa xây dựng màn hình* | `POST /api/auth/forgot_password` | Public | **THIẾU** |
| **REQ-005** | Phân quyền 3 vai trò (RBAC) | Chung | Toàn hệ thống | `auth.guard.ts` | Token claims & `permissions` | Guard | **ĐẦY ĐỦ** |
| **REQ-006** | Tự khóa phiên sau 15p idle | Chung | Toàn hệ thống | *Chưa có IdleTimeoutService* | Client event listener | All | **THIẾU** |
| **REQ-007** | Nhận và đọc thông báo y tế | Chung | Header dropdown | `NotificationDropdownComponent` | `GET /api/notifications` | All | **ĐẦY ĐỦ** |
| **REQ-010** | Sàng lọc "Báo động đỏ" <30s | P2 | `/patient/emergency` | `EmergencyScreeningComponent` | `GET /classifyquestions` | Patient | **ĐẦY ĐỦ** |
| **REQ-011** | Khóa luồng & gọi cấp cứu 115 | P2 | `/patient/emergency` | `EmergencyScreeningComponent` | Logic chặn client-side | Patient | **ĐẦY ĐỦ** |
| **REQ-012** | Phân loại cấp/mạn (ngưỡng 6w) | P3 | `/patient/emergency` | `EmergencyScreeningComponent` | `POST /classify` | Patient | **ĐẦY ĐỦ** |
| **REQ-013** | Sàng lọc nguy cơ & dị nguyên | P3 | `/patient/emergency` | `EmergencyScreeningComponent` | `POST /classify` | Patient | **ĐẦY ĐỦ** |
| **REQ-014** | Lời dặn Cấp tính: Đến viện/nhà | P3 | `/patient/emergency` | `EmergencyScreeningComponent` | Local guidance & classify | Patient | **ĐẦY ĐỦ** |
| **REQ-015** | Bệnh nhân tự tạo hồ sơ bệnh án | P4 | `/patient/intake` | `DynamicIntakeComponent` | `POST /selfcreate` | Patient | **ĐẦY ĐỦ** |
| **REQ-016** | Phiếu khám động rẽ nhánh | P4 | `/patient/intake` | `DynamicIntakeComponent` | `POST /medicalrecords/:id/answers` | Patient | **ĐẦY ĐỦ** |
| **REQ-020** | Kiểm tra điều kiện chấm UAS7 | P5 | `/patient/uas7` | `Uas7ScoringComponent` | `GET /uas7scores/eligibility` | Patient | **ĐẦY ĐỦ** |
| **REQ-021** | Chấm điểm UAS7 hàng ngày | P5 | `/patient/uas7` | `Uas7ScoringComponent` | `POST /uas7scores` | Patient | **ĐẦY ĐỦ** |
| **REQ-022** | Chặn chấm điểm trùng lặp ngày | P5 | `/patient/uas7` | `Uas7ScoringComponent` | Bắt mã lỗi 5002 | Patient | **ĐẦY ĐỦ** |
| **REQ-023** | Tính tổng điểm tuần UAS7 0-42 | P5 | `/patient/uas7` | `Uas7ScoringComponent` | `GET /uas7scores/week` | Patient | **ĐẦY ĐỦ** |
| **REQ-024** | Quản lý đợt tổn thương | P6 | `/patient/lesions` | `LesionTrackerComponent` | `POST /lesion_episodes` | Patient | **ĐẦY ĐỦ** |
| **REQ-025** | Tải ảnh tổn thương 3 mốc | P6 | `/patient/lesions` | `LesionTrackerComponent` | `POST /media/upload`, `/lesion_photos` | Patient | **ĐẦY ĐỦ** |
| **REQ-026** | Nhận diện AI sẩn phù (YOLO) | P6, D3 | `/patient/lesions` | `LesionTrackerComponent` | Mô phỏng AI qua metadata | Patient | **MỘT PHẦN** |
| **REQ-027** | Hồ sơ cá nhân & Thẻ BHYT | P7 | `/patient/profile` | `PatientProfileComponent` | `GET, PUT /users/profile` | Patient | **ĐẦY ĐỦ** |
| **REQ-030** | Hàng đợi ca khám trực tuyến | D1 | `/doctor/queue` | `WaitingQueueComponent` | `GET /medicalrecords/queue` | Doctor | **ĐẦY ĐỦ** |
| **REQ-031** | Tiếp nhận ca khám (Accept) | D2 | `/doctor/queue` | `WaitingQueueComponent` | `POST /medicalrecords/:id/accept` | Doctor | **ĐẦY ĐỦ** |
| **REQ-032** | Tạo ca khám nhanh tại chỗ | D2 | `/doctor/queue` | `WaitingQueueComponent` | `POST /medicalrecords` | Doctor | **ĐẦY ĐỦ** |
| **REQ-033** | Xem dữ liệu bệnh nhân tự khai | D3 | `/doctor/consultation/:id` | `ConsultationComponent` | `GET /medicalrecords/:id/answers` | Doctor | **ĐẦY ĐỦ** |
| **REQ-034** | Giám sát UAS7 tuần & Ảnh 3 mốc | D3 | `/doctor/consultation/:id` | `ConsultationComponent` | `GET /uas7scores`, `/lesion_photos` | Doctor | **ĐẦY ĐỦ** |
| **REQ-035** | Khám thực thể & Test CIndU | D3 | `/doctor/consultation/:id` | `ConsultationComponent` | Form nhập lâm sàng | Doctor | **MỘT PHẦN** |
| **REQ-036** | Kê đơn thuốc điện tử | D4 | `/doctor/consultation/:id` | `ConsultationComponent` | `POST /prescriptions` | Doctor | **ĐẦY ĐỦ** |
| **REQ-037** | Chỉ định xét nghiệm IgE/máu | D5 | `/doctor/consultation/:id` | `ConsultationComponent` | `POST /lab_requests` | Doctor | **ĐẦY ĐỦ** |
| **REQ-038** | Chốt hoàn tất ca & Hẹn tái khám | D6 | `/doctor/consultation/:id` | `ConsultationComponent` | `POST /medicalrecords/:id/complete` | Doctor | **ĐẦY ĐỦ** |
| **REQ-040** | Quản trị hạ tầng cơ sở 3 tầng | A2 | `/admin/topology` | `TopologyComponent` | `/branches`, `/departments`, `/rooms` | Admin | **ĐẦY ĐỦ** |
| **REQ-041** | Ràng buộc toàn vẹn RESTRICT | A2 | `/admin/topology` | `TopologyComponent` | Xử lý mã lỗi 3001 | Admin | **ĐẦY ĐỦ** |
| **REQ-042** | Phân công công tác nhân sự | A3 | `/admin/users` | `UserStaffComponent` | `POST /staff/:id/assign` | Admin | **ĐẦY ĐỦ** |
| **REQ-043** | Quản lý ma trận vai trò RBAC | A4 | `/admin/rbac` | `RbacMatrixComponent` | `/roles`, `/permissions` | Admin | **ĐẦY ĐỦ** |
| **REQ-044** | Thiết kế biểu mẫu khám 4 tầng | A5 | `/admin/form-builder` | `FormBuilderComponent` | `POST /templates`, `/sections`, `/questions` | Admin | **ĐẦY ĐỦ** |
| **REQ-045** | Bảng điều khiển giám sát viện | A1 | `/admin/dashboard` | `AdminDashboardComponent` | Thống kê từ Queue & Topology | Admin | **ĐẦY ĐỦ** |
| **REQ-060** | Tuân thủ Uber Base Tokens | Chung | Toàn hệ thống | `uber-base-tokens.css` | CSS Custom Properties | All | **ĐẦY ĐỦ** |
| **REQ-061** | Độc quyền Iconsax Font | Chung | Toàn hệ thống | Font `@font-face` | `.isax`, `.isax-b` | All | **ĐẦY ĐỦ** |
| **REQ-062** | Bảo mật Zero-PII | Chung | Toàn hệ thống | Lớp log & client sanitize | Che mờ SĐT, mã BHYT | All | **MỘT PHẦN** |
| **REQ-063** | Đóng gói sạch Zero Mock | Chung | Build config | `app.config.ts` | Loại bỏ Mock khỏi Prod | All | **CHƯA ĐẠT** |
| **REQ-064** | Phân tách không gian nội bộ | Chung | Navigation | `app-sidebar.component.ts` | Ẩn Design Hub khỏi menu | All | **ĐẦY ĐỦ** |

---

## 2. CHIỀU 2: HỆ THỐNG HIỆN TẠI &rarr; TÀI LIỆU (RÀ SOÁT TÍNH NĂNG NGOÀI PHẠM VI)

| Màn hình / Component trong Repo | Hiện trạng | Căn cứ trong Tài liệu Chuẩn | Kết luận & Kiến nghị xử lý |
|:---|:---|:---|:---|
| `pages/auth-pages/sign-in` & `sign-up` | Mã nguồn template cũ `ng-tailadmin`. | **KHÔNG CÓ**. Tài liệu chỉ quy định đăng nhập bằng SĐT tại `pages/auth/login`. | **NGOÀI PHẠM VI:** Chuyển vào thư mục archive hoặc xóa bỏ, không link trong routes. |
| `pages/dashboard/ecommerce` | Trang thương mại điện tử từ template cũ. | **KHÔNG CÓ**. Dự án là hệ thống bệnh viện chuyên khoa, không bán hàng ecommerce. | **NGOÀI PHẠM VI:** Di chuyển vào archive, dọn dẹp sạch mã nguồn. |
| `pages/invoices/` | Hóa đơn thanh toán tài chính template. | **KHÔNG CÓ** trong API spec v2 (việc thu viện phí do hệ thống HIS bệnh viện đảm nhiệm). | **NGOÀI PHẠM VI:** Di chuyển vào archive. |
| `pages/calender/` | Lịch sự kiện chung của template. | **KHÔNG CÓ**. Lịch tái khám bệnh án nằm trong Luồng Bác sĩ / Bệnh nhân. | **NGOÀI PHẠM VI:** Di chuyển vào archive. |
| `pages/design-system/design-system-showcase` | Trang trưng bày Design Hub nội bộ cho dev/designer. | Thuộc phạm vi **INTERNAL-DEV** (công cụ nội bộ cho đội ngũ phát triển). | **CHẤP THUẬN (Có điều kiện):** Bắt buộc chỉ chạy ở môi trường development, chặn hoàn toàn ở production. |

---

## 3. TỔNG KẾT TỶ LỆ PHỦ YÊU CẦU

- **Tổng số REQ được rà soát:** 41 yêu cầu nghiệp vụ chính.
- **ĐẦY ĐỦ (Fully Implemented):** 34 / 41 (82.9%).
- **MỘT PHẦN (Partially Implemented):** 4 / 41 (9.8%) — Đăng ký tài khoản lẻ, Test CIndU chuyên sâu, Kết quả mô hình YOLO, Lọc PII logging.
- **THIẾU (Missing):** 3 / 41 (7.3%) — Màn hình Quên/Đặt lại mật khẩu (REQ-004), Idle Timeout tự khóa phiên (REQ-006), Đóng gói sạch loại bỏ Mock khỏi Prod bundle (REQ-063).
- **Mục "Chỉ giao diện" / "Ngoài phạm vi":** 0 mục trong luồng nghiệp vụ chính của DrMayDay.
