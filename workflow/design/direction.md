# BẢN SẮC THIẾT KẾ HỆ THỐNG DRMAYDAY (DESIGN DIRECTION)

> **Cơ quan chủ quản:** Bệnh viện Da liễu Trung ương — Đề tài Nghiên cứu Khoa học Công nghệ Cấp Bộ  
> **Phiên bản:** 1.0 (Production Master)  
> **Nguồn căn cứ:** `DATA_DICTIONARY_SPECIFICATION_v2.0`, `BA mạn chốt.docx`, `Bệnh án mày đay cấp.docx`, `Thiet_ke_Luong_App_Benh_nhan_Cap_nhat_1.docx`, `Thiet_ke_giao_dien_Bac_si_BA_man_chot.docx`, `api_spec.csv`, `Slide APIs/`.

---

## 1. Kiểm toán độ giống mẫu & Rà soát template (Template Audit)

| Màn hình / Tệp nguồn | Hiện trạng | Vì sao chung chung / Giống mẫu AI | Hướng thay thế theo bản sắc lâm sàng DrMayDay |
|:---|:---|:---|:---|
| `admin_template/src/app/pages/{dashboard, blank, calender, charts, invoices...}` | Thừa 10+ thư mục template TailAdmin bán sẵn, bảng số liệu mẫu CRM/E-commerce, ApexCharts ngẫu nhiên. | Giao diện quản trị bán hàng thông thường, không phản ánh bất kỳ nghiệp vụ da liễu hay bệnh viện nào. | Loại bỏ hoàn toàn khỏi routing và build bundle; tập trung 100% vào phân hệ `drmayday/{patient, doctor, admin}`. |
| `patient-home.component.html` | Thẻ thống kê 3 cột kiểu Dashboard SaaS (`UAS7 Hôm nay`, `Lần khám gần nhất`, `Trạng thái ca`). | Bố cục dạng "thẻ đo KPI" kiểu kinh doanh thay vì luồng chăm sóc sức khỏe trấn an tâm lý người bệnh ngứa ngáy. | Chuyển thành **Bảng điều khiển sức khỏe làn da 7 ngày**: Trọng tâm là Vạch trạng thái kiểm soát bệnh (Tốt / Trung bình / Kém / Báo động đỏ), thẻ hành động to trực quan. |
| `doctor/waiting-queue.component.html` | Bảng hàng đợi danh sách phẳng đơn điệu. | Trông giống bảng danh sách nhân viên hoặc đơn hàng thương mại điện tử. | Tách nhóm thị giác theo **Giai đoạn tiếp nhận**: Cấp tính vs Mãn tính, huy hiệu thời gian chờ khám thực tế, chỉ báo tổn thương khẩn cấp, thao tác 1 chạm nhận ca. |
| `doctor/consultation.component.html` | Form điền 5 tab độc lập, chia cắt thông tin. | Tab chia cắt khiến bác sĩ phải nhảy qua nhảy lại nhiều lần để đối chiếu ảnh và chỉ số UAS7. | Bố cục **Split-Screen Clinical Cockpit**: Cột trái cố định Hồ sơ & Ảnh tổn thương 3 mốc thời gian, Cột phải là Phiếu khám EMR tương tác nhanh. |
| `patient/lesion-tracker.component.html` | Khung upload ảnh kéo thả chung chung với icon đám mây tiêu chuẩn. | Không hướng dẫn vị trí chụp, không thể hiện quy tắc y tế 3 mốc thời gian của Bệnh viện Da liễu Trung ương. | Khung hướng dẫn chụp chuẩn hóa: Gắn nhãn bắt buộc 3 mốc (**Khởi phát** $\rightarrow$ **Đỉnh điểm** $\rightarrow$ **Thuyên giảm**), cảnh báo chụp rõ nét, đủ sáng, không dùng kính lọc làm lệch màu da. |

---

## 2. Định vị bản sắc & Nguyên tắc cốt lõi DrMayDay

> **Định vị trong một câu:**  
> *"DrMayDay là hệ thống y tế chuyên khoa da liễu chuẩn mực, tinh giản tối đa thao tác nhận diện lâm sàng, biến dữ liệu ngứa và tổn thương sẩn phù thành quyết định điều trị chính xác, an toàn tuyệt đối."*

### 4 Nguyên tắc thiết kế độc tôn (Core Design Principles):
1. **Khác biệt sinh ra từ nghiệp vụ y khoa (Clinical Authenticity):** Không tạo hình trang trí vô nghĩa. Mọi yếu tố giao diện đặc trưng phải bắt nguồn từ định nghĩa trong hồ sơ bệnh án của Bệnh viện Da liễu Trung ương (UAS7 0-42 điểm, quy tắc 3 mốc tổn thương da, sàng lọc phản vệ < 30 giây).
2. **Độ tương phản cao & Không đánh đố nhận thức (Zero Cognitive Load):** Tuân thủ tuyệt đối WCAG 2.1 AAA. Trạng thái cảnh báo không bao giờ chỉ dùng màu đơn thuần mà luôn có icon định danh Iconsax + văn bản tiếng Việt chuẩn xác.
3. **Hai chế độ mật độ tách biệt (Dual-Density Architecture):**
   - **Bệnh nhân (Spacious):** Không gian thoáng, kích thước chữ lớn (Scale 300-500), ngôn từ ấm áp, trấn an, tối ưu thao tác 1 ngón tay trên thiết bị di động (nút bấm $\ge 48$px).
   - **Bác sĩ & Quản trị (Clinician Compact):** Mật độ dữ liệu cao, hiển thị đối sánh song song (Ảnh $\leftrightarrow$ Thang điểm $\leftrightarrow$ Đơn thuốc), giảm thiểu cuộn trang, thao tác phím tắt tối ưu cho máy tính trạm phòng khám.
4. **Không bao giờ làm gián đoạn luồng cấp cứu (Red Flag Supremacy):** Khi bệnh nhân có dấu hiệu sưng nề môi/mắt, khó thở, tụt huyết áp, hệ thống lập tức khóa các luồng khảo sát thông thường, bật màn hình đỏ khẩn cấp chuyển hướng gọi cấp cứu 115 và hotline `1900 6951`.

---

## 3. 5 Yếu tố đặc trưng nhận diện DrMayDay (Signatures)

### Yếu tố 1: Thước đo hoạt động bệnh UAS7 & AAS7 liên tục 7 ngày (7-Day UAS7 Heat Strip)
- **Khái niệm nghiệp vụ:** Thang điểm quốc tế UAS7 tính tổng điểm sẩn phù (0-3) và mức độ ngứa (0-3) trong 7 ngày liên tiếp (tổng 0-42 điểm). Nguồn: `DATA_DICTIONARY_SPECIFICATION_v2.0: Mục 2.3`.
- **Nơi xuất hiện:** Trang chủ Bệnh nhân, Header Bệnh án Bác sĩ, Modal tổng kết xuất viện.
- **Cách thể hiện:** Dải 7 ô tròn/hình khối tương ứng Thứ 2 &rarr; CN, hiển thị mã màu trạng thái chuẩn:
  - 0-6đ: Kiểm soát tốt (`--base-positive-primary`)
  - 7-15đ: Mày đay nhẹ (`--base-accent-500`)
  - 16-27đ: Trung bình (`--base-warning-primary`)
  - 28-42đ: Nặng/Báo động (`--base-negative-primary`)
- **Vì sao không thể nhầm lẫn:** Không sản phẩm quản lý nào có dải hiển thị 7 ngày chuyên biệt cho 2 thang đo sẩn và ngứa đồng thời.
- **Chi phí thực hiện:** Vừa (Đã có token và logic tính điểm trong code).

### Yếu tố 2: Bộ ba ảnh tổn thương da 3 giai đoạn (Tri-Phase Lesion Chronicle)
- **Khái niệm nghiệp vụ:** Đặc thù tổn thương mày đay thay đổi theo giờ: Bắt buộc theo dõi 3 mốc: (1) Khởi phát $\rightarrow$ (2) Đỉnh điểm $\rightarrow$ (3) Thuyên giảm (lặn không để lại sẹo). Nguồn: `BA mạn chốt.docx: Mục III.2` & `api_spec.csv: Upload ảnh tổn thương`.
- **Nơi xuất hiện:** Phân hệ Tải ảnh Bệnh nhân (`/patient/lesions`) và Màn hình Khám Bác sĩ (`/doctor/consultation/:id`).
- **Cách thể hiện:** Khung 3 ngăn cố định liền mạch với tỷ lệ 4:3, có timestamp thời gian thực, huy hiệu mốc khám và tính năng phóng to (lightbox) so sánh trực quan.
- **Chi phí thực hiện:** Nhỏ &rarr; Vừa.

### Yếu tố 3: Vòng chắn Báo động đỏ phản vệ (Red-Flag Anaphylaxis Interceptor)
- **Khái niệm nghiệp vụ:** Sàng lọc dưới 30 giây: Khó thở, khàn tiếng, phù môi/mắt, chóng mặt. Nguồn: `Thiet_ke_Luong_App_Benh_nhan_Cap_nhat_1.docx: Bước 1`.
- **Nơi xuất hiện:** Màn hình Sàng lọc khẩn cấp (`/patient/emergency`) và đầu phiếu tiếp nhận Bác sĩ.
- **Cách thể hiện:** Băng rôn cảnh báo viền đỏ dày 4px, nút bấm khẩn cấp màu đỏ đậm nhấp nháy êm dịu, số điện thoại cấp cứu `115` và hotline `1900 6951` hiển thị khổ cực đại `base-display-sm`.
- **Chi phí thực hiện:** Nhỏ.

### Yếu tố 4: Bảng điều khiển phân loại Cấp vs Mạn (Acute vs Chronic Triage Tagging)
- **Khái niệm nghiệp vụ:** Phân định dứt khoát: Mày đay Cấp tính ($< 6$ tuần) vs Mày đay Mạn tính ($\ge 6$ tuần liên tục). Bệnh nhân cấp tính không ghi nhật ký dài hạn; mạn tính kích hoạt chu kỳ UAS7. Nguồn: `DATA_DICTIONARY_SPECIFICATION_v2.0: Mục 1.1`.
- **Nơi xuất hiện:** Bảng hàng đợi Bác sĩ, thẻ tóm tắt bệnh nhân, bộ lọc hồ sơ y tế.
- **Cách thể hiện:** Badge y tế chuyên biệt: Mày đay Cấp (Tag Info tím than viền mờ), Mày đay Mạn (Tag Warning cam đất có biểu tượng đồng hồ đếm tuần).
- **Chi phí thực hiện:** Nhỏ.

### Yếu tố 5: Con dấu xác thực & Chốt bệnh án EMR (Clinical Seal & Lock Action)
- **Khái niệm nghiệp vụ:** Khi bác sĩ hoàn tất phiên khám, dữ liệu khóa vĩnh viễn (RESTRICT), sinh mã bệnh án điện tử và đơn thuốc có chữ ký số. Nguồn: `Thiet_ke_giao_dien_Bac_si_BA_man_chot.docx`.
- **Nơi xuất hiện:** Đáy màn hình Khám lâm sàng Bác sĩ.
- **Cách thể hiện:** Thanh công cụ cố định đáy màn hình (Sticky Bottom Bar) chứa nút hành động chính "Hoàn tất & Ký số bệnh án", kèm modal tóm tắt xác nhận 2 bước chống bấm nhầm.
- **Chi phí thực hiện:** Vừa.

---

## 4. Quy chuẩn Mật độ, Khoảng cách và Giọng văn theo vai trò

| Tiêu chuẩn | Bệnh nhân (Patient Spacious) | Bác sĩ (Clinician Compact) | Quản trị (Admin System) |
|---|---|---|---|
| **Mật độ hiển thị** | Rộng rãi, cách lề 24px - 32px, chiều cao dòng 1.6 | Tối ưu thông tin, khoảng cách 12px - 16px, bảng dữ liệu 40px/dòng | Khung lưới chuẩn, phân cấp cây chi nhánh & phòng khám rõ ràng |
| **Cỡ chữ cơ bản** | 16px (Paragraph-Md), Tiêu đề 24px - 32px | 13px - 14px (Paragraph-Sm), Nhãn 11px font-mono | 13px - 14px, mã định danh font-mono nổi bật |
| **Vùng tương tác (Touch Target)** | $\ge 48 \times 48\text{px}$ (Thân thiện bệnh nhân lớn tuổi) | $36 \times 36\text{px}$ (Tối ưu chuột/bàn phím) | $36 \times 36\text{px}$ |
| **Giọng văn (Microcopy)** | Trấn an, hướng dẫn ân cần, giải thích thuật ngữ y khoa dễ hiểu (VD: *"Sẩn phù là nốt gồ đỏ ngứa như muỗi đốt"*) | Ngắn gọn, chuẩn danh pháp Bộ Y tế (VD: *"Tổn thương cơ bản", "Kháng Histamin H1 thế hệ 2"*) | Nghiêm ngặt, nhấn mạnh ràng buộc dữ liệu (VD: *"Xóa phòng khám sẽ SET NULL dữ liệu phân công"*) |

---

## 5. Hướng dẫn Chuyển động & Biểu tượng gốc

1. **Chuyển động có chức năng (Functional Motion Only):**
   - Thời gian chuyển cảnh: 150ms &rarr; 200ms với đường cong `cubic-bezier(0, 0, 0.2, 1)`.
   - Cấm hoàn toàn hiệu ứng chuyển động rung lắc vô bổ.
   - Luôn tôn trọng `@media (prefers-reduced-motion: reduce)`.
2. **Biểu tượng hệ thống:**
   - Độc quyền sử dụng **Iconsax Vector Font** (`.isax` cho outline và `.isax-b` cho bold/active).
   - Tuyệt đối không chèn icon SVG bên ngoài không đồng bộ nét vẽ.

---

## 6. Rào chắn An toàn Lâm sàng (Clinical Safety Guardrails)

- **Cảnh báo dị ứng thuốc:** Màu nền đỏ nhạt (`--base-bg-negative-tint`), chữ đỏ đậm, viền đậm 2px, luôn cố định vị trí nổi bật nhất trong phiếu kê đơn.
- **Ngăn ngừa bấm kép (Double-Submit Prevention):** Mọi nút bấm tạo bệnh án, nhận ca, lưu phiếu đều tự động vô hiệu hóa và hiện spinner ngay khi phát sinh tương tác.
- **Không bao giờ làm mất dữ liệu chưa lưu:** Cài đặt `pendingChangesGuard` hỏi xác nhận trước khi bác sĩ hoặc bệnh nhân đóng tab/rời trang khi đang nhập form khám dở dang.

---

## 7. Đề xuất Token mới (Nếu cần)
Hiện tại bộ token `uber-base-tokens.css` đã đầy đủ 100% các giá trị màu y tế, khoảng cách, radii và elevation cần thiết. **Không cần đề xuất token mới.**
