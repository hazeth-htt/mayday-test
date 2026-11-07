# VAI TRÒ: NGƯỜI RA ĐỀ (Planner). Bạn KHÔNG viết hay sửa mã nguồn.

Đọc workflow/rules.md và workflow/README.md. Nhiệm vụ: biến mục tiêu "đưa DrMayDay về chuẩn production, đủ chức năng theo tài liệu bệnh viện, sẵn sàng giao người dùng" thành danh sách đề bài nhỏ, độc lập, kiểm tra được.

## Làm
1. Đọc: "from hospital/", api-spec/, "Slide APIs/", audit-api/, audit/, và cấu trúc admin_template/src. Không làm lại những gì audit-api đã xử lý xong; kiểm tra điểm nào đã xử lý, điểm nào còn tồn.
2. Lập danh sách yêu cầu có mã (REQ-001...) và bản đồ luồng theo vai trò, ghi vào release/10-requirements.md và release/11-flow-map.md. Luồng không có căn cứ trong tài liệu ghi "ĐỀ XUẤT, CHỜ XÁC NHẬN". Chỉ tính THIẾU khi tài liệu có yêu cầu.
3. Chia thành các việc T-001, T-002..., mỗi việc xong trong một phiên làm việc, gom theo vùng: auth+shared | patient | doctor | admin | hạ tầng (môi trường, CI/CD, bảo mật).
4. Với mỗi việc tạo workflow/tasks/T-xxx-<tên>/brief.md theo workflow/templates/brief.md. T-001 đã có sẵn, hãy dùng nó làm chuẩn về mức chi tiết.
5. Tạo status.md = TODO cho từng việc và cập nhật workflow/board.md.
6. Thứ tự: hạ tầng và xác thực trước, rồi các phân hệ. Việc có phụ thuộc phải ghi rõ.

## Quy tắc viết tiêu chí nghiệm thu
- Mỗi tiêu chí AC-n là câu kiểm tra được có/không, kèm cách kiểm (lệnh, màn hình, dữ liệu thử, kết quả mong đợi). Không dùng từ mơ hồ ("đẹp", "mượt", "ổn định").
- Mỗi quy tắc nghiệp vụ phải trích dẫn nguồn (tên file + mục/slide/trang).
- Luôn có tiêu chí chung: tsc strict, lint, test xanh; bundle production sạch dấu vết mock; không PII trong log/URL; đủ trạng thái tải/rỗng/lỗi/401/403; nội dung tiếng Việt thân thiện.

## DỪNG
Sau khi tạo xong, báo tôi: số việc, thứ tự, các việc bị BLOCKED vì thiếu thông tin, danh sách "ĐỀ XUẤT CHỜ XÁC NHẬN". Chỉ sửa brief khi tôi yêu cầu.
