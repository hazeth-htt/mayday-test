# DANH MỤC YÊU CẦU NGHIỆP VỤ HỆ THỐNG DRMAYDAY (10-REQUIREMENTS)

> **Dự án:** Ứng dụng Trí tuệ Nhân tạo Hỗ trợ Chẩn đoán và Quản lý Bệnh Mày đay — DrMayDay  
> **Chủ trì chuyên môn:** Bệnh viện Da liễu Trung ương  
> **Nguồn sự thật:**  
> 1. `DATA_DICTIONARY_SPECIFICATION_v2.0` (Chính thức ban hành 04/09/2026, 183 biến số).  
> 2. `Thiet_ke_Luong_App_Benh_nhan_Cap_nhat_1.docx` (Sơ đồ quản lý AI, Bước 0-3, Nhánh A Cấp, Nhánh B Mạn).  
> 3. `Thiet_ke_giao_dien_Bac_si_BA_man_chot.docx` & `Bang_bien_Bac_si_v2.docx`.  
> 4. `BA mạn chốt.docx` & `15h-3.9.2026 Bệnh án mày đay cấp.docx`.  
> 5. Hợp đồng API: `api-spec/api_spec.csv` (91 API).  
> 6. Tài liệu minh họa: `Slide APIs/` (SLIDE1 - SLIDE11).  

---

## 1. BẢNG DANH MỤC YÊU CẦU THEO MÃ (REQ-001 ... REQ-065)

### Phân Hệ 1: Xác Thực, Phân Quyền & Quản Lý Phiên (Dùng Chung)
| Mã REQ | Nội dung yêu cầu chi tiết | Nguồn căn cứ tài liệu | Vai trò | Mức ưu tiên |
|:---|:---|:---|:---:|:---:|
| **REQ-001** | Đăng nhập hệ thống bằng Số điện thoại chuẩn Việt Nam (10 chữ số, tiền tố `03, 05, 07, 08, 09`) và Mật khẩu bảo mật. | `api_spec.csv:2`, `SLIDE2` | Chung | **Bắt buộc** |
| **REQ-002** | Đăng ký tài khoản người dùng mới (Họ tên, SĐT, Giới tính, Mật khẩu). | `api_spec.csv:1`, `SLIDE2` | Bệnh nhân | **Bắt buộc** |
| **REQ-003** | Đăng xuất an toàn, thu hồi JWT Bearer token và xóa sạch phiên làm việc trên client. | `api_spec.csv:3`, `SLIDE2` | Chung | **Bắt buộc** |
| **REQ-004** | Quên mật khẩu và đặt lại mật khẩu thông qua mã OTP xác thực. | `api_spec.csv:4-5`, `SLIDE2` | Chung | **Nên có** |
| **REQ-005** | Phân quyền 3 cấp vai trò rõ rệt: Quản trị viên (`role_id: 1`), Bác sĩ (`role_id: 2`), Bệnh nhân (`role_id: 3`). | `DATA_DICTIONARY: Mục 1`, `SLIDE1` | Chung | **Bắt buộc** |
| **REQ-006** | Khóa phiên và tự động đăng xuất sau 15 phút không hoạt động đối với Bác sĩ và Quản trị viên. | `DATA_DICTIONARY: Mục 2 (Zero-PII)` | Bác sĩ, Admin | **Bắt buộc** |
| **REQ-007** | Nhận và quản lý thông báo đẩy (Nhắc chấm điểm UAS7, thông báo có kết quả xét nghiệm, lịch tái khám). | `api_spec.csv:88-90`, `SLIDE10` | Chung | **Bắt buộc** |

---

### Phân Hệ 2: Bệnh Nhân — Tiếp Nhận, Sàng Lọc & Khai Báo (Patient Intake)
| Mã REQ | Nội dung yêu cầu chi tiết | Nguồn căn cứ tài liệu | Vai trò | Mức ưu tiên |
|:---|:---|:---|:---:|:---:|
| **REQ-010** | **Sàng lọc "Báo động đỏ" (<30 giây):** Khảo sát ngay các dấu hiệu đe dọa tính mạng (khó thở, nghẹt thở, sưng nghẹn họng, tụt huyết áp, chóng mặt ngất xỉu). | `Thiet_ke_Luong_App: Bước 0`, `DATA_DICTIONARY: Mục 1` | Bệnh nhân | **Bắt buộc** |
| **REQ-011** | **Khóa luồng khẩn cấp:** Khi có bất kỳ dấu hiệu báo động đỏ nào, hệ thống phải lập tức khóa luồng đăng ký, bật popup đỏ hướng dẫn sơ cứu và hiển thị nút gọi 115. | `Thiet_ke_Luong_App: Bước 0`, `SLIDE4` | Bệnh nhân | **Bắt buộc** |
| **REQ-012** | **Phân nhánh Cấp tính vs Mạn tính (Ngưỡng 6 tuần):** Khảo sát thời gian khởi phát. Nếu `< 6 tuần` &rarr; Nhánh A (Cấp tính); Nếu `≥ 6 tuần` &rarr; Nhánh B (Mạn tính). | `Thiet_ke_Luong_App: Bước 2`, `DATA_DICTIONARY: Biến 11-13` | Bệnh nhân | **Bắt buộc** |
| **REQ-013** | **Sàng lọc nguy cơ & tiền sử dị nguyên (Bước 3):** Khảo sát thức ăn, thuốc, côn trùng đốt, vắc xin, hóa chất tiếp xúc trong vòng 24-48 giờ trước khởi phát. | `Thiet_ke_Luong_App: Bước 3`, `Bệnh án mày đay cấp` | Bệnh nhân | **Bắt buộc** |
| **REQ-014** | **Cảnh báo nhập viện cho nhánh Cấp tính:** Đánh giá số lượng yếu tố nguy cơ (phù mạch, tiền sử dị ứng nặng) để đưa ra lời dặn "Nên đến cơ sở y tế / nhập viện ngay" hoặc "Theo dõi tại nhà". | `Thiet_ke_Luong_App: Nhánh A`, `Bệnh án mày đay cấp` | Bệnh nhân | **Bắt buộc** |
| **REQ-015** | **Khởi tạo hồ sơ bệnh án tự khai (`selfcreate`):** Tự động sinh mã bệnh án điện tử định dạng `BA-2026-xxx` gắn với mẫu phiếu tương ứng (`TMPL_MAY_DAY_CAP` hoặc `TMPL_MAY_DAY_MAN`). | `api_spec.csv:7`, `SLIDE4` | Bệnh nhân | **Bắt buộc** |
| **REQ-016** | **Phiếu khai báo động đa tầng:** Điền các câu hỏi thuộc phân mục bệnh nhân tự khai, hỗ trợ logic rẽ nhánh tự động (Show If phụ thuộc câu hỏi cha). | `DATA_DICTIONARY: Phân tầng Ingestion`, `api_spec.csv:8` | Bệnh nhân | **Bắt buộc** |

---

### Phân Hệ 3: Bệnh Nhân — Nhật Ký Theo Dõi & Đa Phương Thức (Monitoring)
| Mã REQ | Nội dung yêu cầu chi tiết | Nguồn căn cứ tài liệu | Vai trò | Mức ưu tiên |
|:---|:---|:---|:---:|:---:|
| **REQ-020** | **Kiểm tra điều kiện chấm UAS7:** Chỉ bệnh nhân được chẩn đoán mày đay mạn tính (`≥ 6 tuần`) và có bệnh án còn hiệu lực mới được phép chấm điểm UAS7. | `api_spec.csv:1`, `SLIDE6` | Bệnh nhân | **Bắt buộc** |
| **REQ-021** | **Chấm điểm UAS7 hàng ngày:** Ghi nhận 2 chỉ số: Điểm sẩn phù ISS7 (0-3) + Điểm ngứa ngáy HSS7 (0-3). Điểm ngày = ISS7 + HSS7 (0-6 điểm). | `DATA_DICTIONARY: Mục 4`, `BA mạn chốt: Mục 5` | Bệnh nhân | **Bắt buộc** |
| **REQ-022** | **Chặn chấm điểm trùng lặp (Mã 5002):** Mỗi bệnh nhân chỉ được ghi nhận duy nhất 1 lần điểm UAS7 cho một ngày (theo `score_date`). | `api_spec.csv:2`, `SLIDE6` | Bệnh nhân | **Bắt buộc** |
| **REQ-023** | **Tính tổng kết điểm tuần UAS7 (0-42 điểm):** Tính tổng 7 ngày liên tục và phân loại mức độ hoạt động bệnh: Kiểm soát hoàn toàn (0đ), Nhẹ (1-15đ), Trung bình (16-27đ), Nặng (28-42đ). | `DATA_DICTIONARY: Mục 4`, `api_spec.csv:3` | Bệnh nhân, Bác sĩ | **Bắt buộc** |
| **REQ-024** | **Quản lý đợt tổn thương (Lesion Episodes):** Tạo đợt bùng phát mề đay mới kèm thời điểm xuất hiện, hoàn cảnh kích phát, thuốc đã dùng. | `api_spec.csv:9-11`, `SLIDE9` | Bệnh nhân | **Bắt buộc** |
| **REQ-025** | **Kho ảnh tổn thương 3 giai đoạn chuẩn y tế:** Tải và gắn ảnh theo 3 mốc thời gian lâm sàng: Mốc 1 (Khởi phát ban đầu), Mốc 2 (Bùng phát đỉnh điểm), Mốc 3 (Sau dùng thuốc / Thuyên giảm). | `DATA_DICTIONARY: Mục 1`, `SLIDE8`, `BA mạn chốt: Mục 2.2` | Bệnh nhân | **Bắt buộc** |
| **REQ-026** | **Tích hợp kết quả AI Vision (Mô hình YOLO):** Hiển thị nhận diện mật độ sẩn phù và gợi ý phân loại mức độ trên ảnh tổn thương. | `DATA_DICTIONARY: Tầng Vision`, `api_spec.csv:9001` | Bệnh nhân, Bác sĩ | **Nên có** |
| **REQ-027** | **Quản lý hồ sơ cá nhân & Thẻ BHYT:** Lưu trữ mã thẻ BHYT, hạn sử dụng, thông tin người liên hệ khẩn cấp, địa chỉ 3 cấp (Tỉnh/Huyện/Xã). | `api_spec.csv:17-18`, `SLIDE10`, `BA mạn chốt: Mục A` | Bệnh nhân | **Bắt buộc** |

---

### Phân Hệ 4: Bác Sĩ — Hàng Đợi Ca Khám & Khám Lâm Sàng (Clinical Workflow)
| Mã REQ | Nội dung yêu cầu chi tiết | Nguồn căn cứ tài liệu | Vai trò | Mức ưu tiên |
|:---|:---|:---|:---:|:---:|
| **REQ-030** | **Hàng đợi khám lâm sàng (Waiting Queue):** Hiển thị danh sách ca khám trực tuyến, hỗ trợ lọc theo trạng thái: Chờ tiếp nhận (`pending`), Đang khám (`in_progress`), Đã hoàn tất (`completed`). | `api_spec.csv:13`, `SLIDE5` | Bác sĩ | **Bắt buộc** |
| **REQ-031** | **Tiếp nhận ca khám (`accept`):** Bác sĩ bấm nhận ca bệnh nhân từ hàng đợi, gán `assigned_doctor_id` và chuyển trạng thái sang `in_progress`. | `api_spec.csv:14`, `SLIDE5` | Bác sĩ | **Bắt buộc** |
| **REQ-032** | **Tạo ca khám nhanh tại chỗ:** Bác sĩ có thể tự tạo bệnh án tiếp nhận bệnh nhân khám trực tiếp tại phòng khám mà chưa dùng app trước. | `api_spec.csv:12`, `SLIDE5` | Bác sĩ | **Bắt buộc** |
| **REQ-033** | **Xem dữ liệu khai báo đa tầng (Tier Ingestion):** Khai thác toàn bộ câu trả lời bệnh nhân đã nhập trên app (sẩn phù, phù mạch, tiền sử đợt bệnh trước, dị ứng). | `Thiet_ke_giao_dien_Bac_si: Mục 2`, `Bang_bien_Bac_si_v2` | Bác sĩ | **Bắt buộc** |
| **REQ-034** | **Giám sát biểu đồ UAS7 & Thư viện ảnh 3 mốc:** Xem đồ thị tiến triển sẩn phù/ngứa 7 ngày và ảnh tổn thương trực quan để phục vụ chẩn đoán. | `Thiet_ke_giao_dien_Bac_si: Mục 2.2`, `SLIDE6, 8` | Bác sĩ | **Bắt buộc** |
| **REQ-035** | **Ghi nhận khám thực thể & Test kích thích CIndU:** Nhập mạch, huyết áp, nhiệt độ, kết quả Dermographism test, Cold test, Heat test, Pressure test. | `Thiet_ke_giao_dien_Bac_si: Mục 2.4, 4` | Bác sĩ | **Nên có** |
| **REQ-036** | **Kê đơn thuốc điện tử (`set_prescription`):** Chọn tên thuốc, hoạt chất, hàm lượng, tần suất uống, thời gian điều trị và hướng dẫn dặn dò. | `api_spec.csv:86`, `SLIDE7`, `BA mạn chốt: Mục 7` | Bác sĩ | **Bắt buộc** |
| **REQ-037** | **Chỉ định cận lâm sàng (`set_lab_request`):** Chỉ định xét nghiệm công thức máu (WBC, Eosinophil), Tổng lượng IgE, Panel dị nguyên, TSH, ANA. | `api_spec.csv:87-88`, `SLIDE7`, `BA mạn chốt: Mục 5` | Bác sĩ | **Bắt buộc** |
| **REQ-038** | **Chốt hoàn tất bệnh án (`complete`):** Nhập kết luận chẩn đoán xác định, lời dặn điều trị, hẹn ngày tái khám; khóa chỉnh sửa hồ sơ. | `api_spec.csv:15`, `SLIDE5`, `BA mạn chốt: Mục 6, 8` | Bác sĩ | **Bắt buộc** |

---

### Phân Hệ 5: Quản Trị Viên — Cấu Trúc Y Tế & Vận Hành (Admin & System)
| Mã REQ | Nội dung yêu cầu chi tiết | Nguồn căn cứ tài liệu | Vai trò | Mức ưu tiên |
|:---|:---|:---|:---:|:---:|
| **REQ-040** | **Quản trị cây hạ tầng y tế 3 tầng:** Chi nhánh (`Branch`) &rarr; Khoa/Phòng ban (`Department`) &rarr; Phòng khám chức năng (`Room`). | `api_spec.csv:24-35`, `SLIDE3` | Admin | **Bắt buộc** |
| **REQ-041** | **Ràng buộc toàn vẹn hạ tầng (RESTRICT/SET NULL):** Chặn xóa Chi nhánh nếu còn Khoa phòng trực thuộc; chuyển phòng về trạng thái chưa phân bổ khi xóa Khoa. | `api_spec.csv:3001`, `SLIDE3` | Admin | **Bắt buộc** |
| **REQ-042** | **Quản lý danh mục nhân sự y tế:** Tạo tài khoản Bác sĩ, Nhân viên y tế và gán phòng khám làm việc qua API `POST /staff/:id/assign`. | `api_spec.csv:6, 23`, `SLIDE3` | Admin | **Bắt buộc** |
| **REQ-043** | **Quản lý ma trận phân quyền vai trò (RBAC):** Tạo vai trò phân cấp (có kế thừa `parent_role_id`) và cấp/gỡ quyền theo danh mục chức năng. | `api_spec.csv:36-47` | Admin | **Bắt buộc** |
| **REQ-044** | **Trình thiết kế biểu mẫu khám động 4 tầng (Form Builder):** Quản lý cây cấu trúc: Mẫu phiếu &rarr; Phân mục &rarr; Câu hỏi &rarr; Lựa chọn trả lời. | `api_spec.csv:48-59`, `SLIDE11` | Admin | **Bắt buộc** |
| **REQ-045** | **Bảng điều khiển quản trị trung tâm (Admin Dashboard):** Báo cáo số liệu tổng ca khám, tỷ lệ ca cấp/mạn, số phòng khám đang hoạt động. | `DATA_DICTIONARY: Mục 1`, `SLIDE1` | Admin | **Bắt buộc** |

---

### Phân Hệ 6: Phi Chức Năng, Bảo Mật & Tiêu Chuẩn Thiết Kế (Non-Functional)
| Mã REQ | Nội dung yêu cầu chi tiết | Nguồn căn cứ tài liệu | Vai trò | Mức ưu tiên |
|:---|:---|:---|:---:|:---:|
| **REQ-060** | **Tuân thủ Uber Base Design System:** Áp dụng token màu sắc (`uber-base-tokens.css`), tỷ lệ khoảng cách 4px, độ tương phản WCAG 2.1 AAA. | `.agents/rules/enforce-design-system.md` | Chung | **Bắt buộc** |
| **REQ-061** | **Độc quyền bộ biểu tượng Iconsax Font:** 100% icon qua thẻ `<span class="isax icon-..."></span>` (outline) và `.isax-b` (bold); cấm icon bên thứ ba. | `.agents/rules/enforce-design-system.md` | Chung | **Bắt buộc** |
| **REQ-062** | **Bảo mật dữ liệu nhạy cảm (Zero-PII):** Không ghi log họ tên, SĐT, BHYT ra console/URL; mã hóa truyền thông HTTPS TLS 1.3. | `DATA_DICTIONARY: Mục 2` | Chung | **Bắt buộc** |
| **REQ-063** | **Đóng gói sạch (Zero Mock in Production):** Bản build production tuyệt đối không chứa interceptor mock, CSDL giả lập hay thông tin đăng nhập demo. | Nguyên tắc Release Engineering | Chung | **Bắt buộc** |
| **REQ-064** | **Phân tách không gian giao diện:** Trang tài liệu kỹ thuật/design system chỉ mở ở môi trường nội bộ, không xuất hiện trên menu người dùng cuối. | `audit/02-classification.md` | Chung | **Bắt buộc** |
| **REQ-065** | **Khả năng tương thích thiết bị (Responsive):** Phân hệ Bệnh nhân tối ưu giao diện trên thiết bị di động; Phân hệ Bác sĩ & Admin tối ưu trên máy tính để bàn. | `Thiet_ke_Luong_App`, `Thiet_ke_giao_dien_Bac_si` | Chung | **Bắt buộc** |
