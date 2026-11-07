# LUẬT CHUNG (mọi agent đọc trước khi làm)

Dự án: DrMayDay (Bệnh viện Da liễu Trung ương). Frontend Angular 21 + Tailwind nằm trong admin_template/. Ba vai trò người dùng: Quản trị, Bác sĩ, Bệnh nhân.

## Nguồn sự thật (theo thứ tự ưu tiên)
1. "from hospital/": quy tắc nghiệp vụ, từ điển dữ liệu, bệnh án mẫu, thiết kế nghiệp vụ. Thang điểm UAS7, ngưỡng cảnh báo, giai đoạn tổn thương, định nghĩa trường/enum CHỈ lấy từ đây.
2. api-spec/api_spec.csv: hợp đồng API (91 API).
3. "Slide APIs/": luồng minh họa. Mâu thuẫn với mục 1-2 thì ghi vào release/doc-conflicts.md, không tự chọn.
4. .agents/rules/enforce-design-system.md và token trong admin_template/src/app/core/design-system/uber-base-tokens.css: không dùng giá trị màu/khoảng cách ngoài token.
Đã có kết quả đối chiếu trong audit-api/ và audit/. Đọc và tận dụng, không làm lại từ đầu.

## Nguyên tắc
- Không bịa API, chức năng, quy tắc lâm sàng. Thiếu thông tin thì ghi BLOCKED và nêu câu hỏi, không tự đoán.
- Giao tiếp giữa các vai trò chỉ qua file trong workflow/. Mỗi vai trò chỉ ghi vào vùng của mình (xem README.md).
- Không xóa file; di chuyển hoặc đánh dấu chờ duyệt. Đường dẫn có dấu cách phải để trong dấu nháy.
- Mỗi việc làm trên nhánh git riêng task/T-xxx. Không commit thẳng vào nhánh chính.
- Bản production KHÔNG chứa: mã mock, tài khoản demo, lối tắt chọn vai trò, chuỗi kỹ thuật (tên biến, key, enum thô), dữ liệu bệnh nhân thật.
- Dữ liệu y tế nhạy cảm (hồ sơ, BHYT, SĐT, ảnh tổn thương) không ghi vào log, URL, localStorage, analytics, thông báo lỗi.
- Vai trò và quyền do máy chủ trả về; phân quyền ở frontend chỉ là lớp hiển thị.
- Nội dung hiển thị cho người dùng: tiếng Việt thân thiện, ngày DD/MM/YYYY, không lộ mã lỗi thô cho Bệnh nhân.
- Dữ liệu mẫu/test chỉ là dữ liệu giả.

## Lệnh kiểm tra chuẩn (chạy trong admin_template/, xem package.json cho đúng tên script)
- Cài sạch: npm ci
- Kiểu: tsc strict (qua ng build hoặc tsc --noEmit)
- Lint: ng lint (hoặc script lint của dự án)
- Test: script test của dự án, chạy một lần không watch
- Build production: ng build --configuration production
- Quét bundle: tìm trong dist/ các chuỗi "mock-db", "mock-http-interceptor", "USE_MOCK", "DEV ONLY", tài khoản/SĐT demo
