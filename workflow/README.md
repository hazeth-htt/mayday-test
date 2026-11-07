# Quy trình 3 vai trò: Ra đề, Thực hiện, Đối soát

Người làm không tự chấm bài của mình; người chấm không tự sửa bài. Các vai trò chỉ giao tiếp bằng file trong thư mục này.

## Vai trò
- Planner (Ra đề): viết đề bài và tiêu chí nghiệm thu. Không đụng mã nguồn.
- Builder (Thực hiện): làm đúng phạm vi đề bài, viết build-report. Không sửa đề, không tự kết luận đạt.
- Verifier (Đối soát): tự chạy kiểm tra độc lập, kết luận PASS/FAIL kèm bằng chứng. Không sửa mã.
- Bạn: duyệt đề bài, quyết định khi BLOCKED, duyệt cuối.

## Trạng thái một việc (tasks/T-xxx/status.md)
TODO -> IN_PROGRESS -> READY_FOR_REVIEW -> PASS -> DONE
                                         \-> FAIL -> (Builder sửa) -> READY_FOR_REVIEW
BLOCKED: thiếu thông tin hoặc FAIL quá 3 vòng, chờ bạn quyết.

## Vòng chạy
1. Planner đọc tài liệu, tạo tasks/*/brief.md và board.md. Bạn duyệt.
2. Builder nhận một việc, làm trên nhánh task/T-xxx, ghi build-report.md, đặt READY_FOR_REVIEW.
3. Verifier (hội thoại MỚI) chấm, ghi verify-report.md, đặt PASS hoặc FAIL.
4. PASS: bạn (hoặc Điều phối) merge nhánh, đặt DONE. FAIL: quay lại bước 2 (tối đa 3 vòng).

## Quyền ghi
- Planner: brief.md, board.md
- Builder: mã nguồn trong phạm vi brief, build-report.md, đặt status READY_FOR_REVIEW
- Verifier: verify-report.md, đặt status PASS/FAIL/BLOCKED
- Điều phối/bạn: board.md (trạng thái), merge, đặt DONE

## Thư mục prompts/
Mỗi file là prompt dán vào một agent riêng. Mở Verifier luôn ở hội thoại mới.

## Vai thứ 5: Giám tuyển thiết kế (Designer) - tùy chọn
Dùng cho các việc có giao diện. Gọi /role-designer direction một lần cho cả dự án (bạn duyệt direction.md), sau đó /role-designer spec T-xxx trước khi Builder làm, và /role-designer review T-xxx sau khi Builder xong.
Designer chỉ ghi workflow/design/* và design-spec.md, design-review.md. Không viết mã, không chấm PASS/FAIL. Verifier chấm các tiêu chí AC-D trong design-spec.md.
Luồng việc có giao diện: Planner -> Designer (spec) -> Builder -> Designer (review, tùy chọn) -> Verifier.
