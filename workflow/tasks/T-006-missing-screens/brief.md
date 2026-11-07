# T-006: Bổ sung màn hình còn thiếu (Lịch sử ca khám BN, Báo động đỏ <30s, Phân công ca trực)

## Mục tiêu
Xây dựng và hoàn thiện các màn hình còn thiếu theo đặc tả bệnh viện:
1. Màn hình Lịch sử ca khám bệnh nhân (`/patient/records`): Tra cứu danh sách đợt khám mày đay cấp/mạn, đơn thuốc điện tử và lịch tái khám.
2. Hoàn thiện luồng Sàng lọc Báo động đỏ < 30 giây (`/patient/emergency`): Tự động phát hiện dấu hiệu phản vệ nguy kịch, khóa luồng và chuyển hướng gọi 115.
3. Bổ sung mục "Lịch sử ca khám" vào thanh điều hướng bệnh nhân.

## Căn cứ
- `DATA_DICTIONARY_SPECIFICATION_v2.0: Mục 1.1 & 2.1`.
- `Thiet_ke_Luong_App_Benh_nhan_Cap_nhat_1.docx: Luồng 7 (Lịch sử khám) & Luồng 1 (Sàng lọc)`.
- `workflow/design/direction.md`.

## Phạm vi
- `admin_template/src/app/pages/drmayday/patient/patient-records/**`
- `admin_template/src/app/pages/drmayday/patient/emergency-screening/**`
- `admin_template/src/app/shared/layout/app-sidebar/app-sidebar.component.ts`
- `admin_template/src/app/app.routes.ts`
- File tests liên quan

## Tiêu chí nghiệm thu (AC)
- AC-1: Tạo `PatientRecordsComponent` tại `/patient/records` hiển thị danh sách hồ sơ bệnh án phân loại Mày đay Cấp / Mày đay Mạn, mã bệnh án `BA-2026-xxxx`, ngày khám, bác sĩ điều trị và chẩn đoán.
- AC-2: Trong `PatientRecordsComponent`, người bệnh có thể bấm xem chi tiết đơn thuốc điện tử (tên thuốc, liều lượng, hướng dẫn uống) và lời dặn tái khám.
- AC-3: Màn hình `/patient/emergency` tuân thủ quy tắc lâm sàng: Nếu có bất kỳ dấu hiệu phản vệ nào (khó thở, phù môi/mắt, tụt huyết áp), lập tức kích hoạt banner đỏ toàn màn hình với nút gọi 115 và hotline 1900 6951.
- AC-4: Cập nhật `PATIENT_NAV` trong `app-sidebar.component.ts` có mục "Lịch sử ca khám".
- AC-5: Viết unit test cho `patient-records.component.spec.ts`.
- AC-6: Build production và scan bundle xanh 100%.
