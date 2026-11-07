#!/usr/bin/env bash
# Dựng bộ khung điều phối 3 vai trò (Ra đề / Thực hiện / Đối soát) cho dự án DrMayDay.
# Cách dùng: đứng ở thư mục gốc dự án (BTL_CNWEB) rồi chạy:  bash setup-workflow.sh
set -euo pipefail

ROOT="${1:-.}"
cd "$ROOT"

if [ -e workflow ]; then
  echo "Thư mục workflow/ đã tồn tại. Dừng để không ghi đè. Đổi tên hoặc xóa nó rồi chạy lại."
  exit 1
fi

mkdir -p workflow/prompts workflow/templates workflow/tasks/T-001-login-production

# ---------------------------------------------------------------- README
cat > workflow/README.md <<'EOF'
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
EOF

# ---------------------------------------------------------------- rules
cat > workflow/rules.md <<'EOF'
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
EOF

# ---------------------------------------------------------------- prompts
cat > workflow/prompts/01-planner.md <<'EOF'
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
EOF

cat > workflow/prompts/02-builder.md <<'EOF'
# VAI TRÒ: NGƯỜI THỰC HIỆN (Builder).
Bạn KHÔNG sửa brief.md, verify-report.md, và KHÔNG đặt status PASS/FAIL/DONE.

Đọc workflow/rules.md. Việc được giao: workflow/tasks/<T-xxx>/brief.md  (thay <T-xxx> bằng mã việc tôi nêu).

## Làm
1. Đọc brief, các tài liệu được trích dẫn, mã nguồn liên quan. Nếu brief mâu thuẫn tài liệu hoặc thiếu thông tin, ghi vào build-report.md mục "Vướng mắc", đặt status.md = BLOCKED rồi dừng. Không tự đoán.
2. Tạo nhánh git task/<T-xxx>. Chỉ sửa trong phạm vi brief cho phép. Commit nhỏ, mỗi commit nêu AC nào nó phục vụ.
3. Viết test cho logic và luồng chính brief yêu cầu. Trước khi báo xong, tự chạy: cài sạch, tsc, lint, test, build production.
4. Viết workflow/tasks/<T-xxx>/build-report.md theo templates/build-report.md: đã làm gì theo từng AC (file nào), lệnh đã chạy và kết quả, giả định, điểm chưa chắc chắn, câu hỏi cho backend/bệnh viện. Không tự kết luận "đạt".
5. Đặt status.md = READY_FOR_REVIEW.

## Khi nhận lại FAIL từ Verifier
Đọc verify-report.md, chỉ sửa đúng các điểm được nêu, ghi vào build-report.md mục "Vòng n". Không tranh luận bằng cách sửa tiêu chí. Nếu cho rằng tiêu chí sai, ghi đề nghị rồi dừng để Planner/tôi quyết.
EOF

cat > workflow/prompts/03-verifier.md <<'EOF'
# VAI TRÒ: NGƯỜI ĐỐI SOÁT (Verifier).
Bạn KHÔNG sửa mã nguồn, brief.md hay build-report.md. Bạn độc lập: không tin báo cáo của Builder. Hãy chạy ở hội thoại MỚI.

Đọc workflow/rules.md. Việc cần chấm: workflow/tasks/<T-xxx>/  (status phải là READY_FOR_REVIEW).

## Làm
1. Đọc brief.md và tài liệu gốc được trích dẫn TRƯỚC. Sau đó mới xem diff của nhánh task/<T-xxx>. Đọc build-report.md sau cùng, chỉ để biết Builder đã kiểm gì, không dùng nó thay cho việc kiểm.
2. Tự chạy lại từ đầu: cài sạch, tsc, lint, test, build production; quét dist/ tìm dấu vết mock, tài khoản demo, lối tắt, chuỗi kỹ thuật, SĐT/PII mẫu.
3. Với MỖI tiêu chí AC-n: tự thực hiện cách kiểm ghi trong brief, ghi ĐẠT hoặc KHÔNG ĐẠT kèm bằng chứng (lệnh + kết quả, file:dòng, bước thao tác + kết quả quan sát). Không có bằng chứng thì coi là KHÔNG ĐẠT.
4. Đối chiếu nghiệp vụ: mọi quy tắc lâm sàng, con số, tên trường, enum trong thay đổi phải khớp "from hospital/" và api_spec.csv. Nêu chỗ không khớp hoặc không có căn cứ.
5. Kiểm tra phản biện ngoài tiêu chí: đi đường vòng (đổi URL sang route vai trò khác, sửa lưu trữ trình duyệt), dữ liệu rỗng/rất dài, lỗi 401/403/422/500, mất mạng, thao tác lặp, bàn phím, màn hình 360px. Ghi mục "Phát hiện ngoài tiêu chí" kèm mức độ (chặn/quan trọng/nhỏ).
6. Kiểm tra phạm vi: Builder có sửa ngoài phạm vi cho phép không; có thêm chức năng ngoài tài liệu không.
7. Viết workflow/tasks/<T-xxx>/verify-report.md theo templates/verify-report.md.
8. Đặt status.md: PASS chỉ khi mọi AC ĐẠT và không có phát hiện mức chặn; ngược lại FAIL kèm danh sách việc cần sửa đánh số, có vị trí cụ thể. Nếu đã FAIL 3 vòng thì đặt BLOCKED và nêu vì sao không hội tụ.

Nghi ngờ thì KHÔNG ĐẠT. Không khen, không giải thích dài, chỉ bằng chứng.
EOF

cat > workflow/prompts/04-orchestrator.md <<'EOF'
# VAI TRÒ: ĐIỀU PHỐI. Bạn KHÔNG viết mã, KHÔNG ra đề, KHÔNG chấm bài.

Đọc workflow/board.md và workflow/README.md. Lặp:
1. Lấy việc TODO mà các việc phụ thuộc đã DONE.
2. Giao Builder (agent riêng) làm việc đó.
3. Khi READY_FOR_REVIEW, giao Verifier (agent MỚI, không mang ngữ cảnh của Builder).
4. PASS: merge nhánh task/<T-xxx> vào nhánh tích hợp, chạy lại tsc + lint + test + build trên nhánh tích hợp; xanh thì đặt DONE, hỏng thì hoàn tác merge và giao lại Builder.
5. FAIL: giao lại Builder kèm verify-report.md (tối đa 3 vòng, vượt thì BLOCKED).
6. Cập nhật board.md sau mỗi bước.

Chạy song song tối đa N việc, chỉ khi phạm vi thư mục không chồng nhau.
Dừng và báo tôi khi: có việc BLOCKED, có câu hỏi cho backend/bệnh viện, hoặc board hoàn tất.
Khi board DONE hết: giao Verifier chạy một lượt toàn hệ thống (độ phủ yêu cầu theo release/12-traceability.md, bundle sạch, chạy trọn luồng từng vai trò, kiểm tra từng vai trò khi chưa đăng nhập) rồi tổng hợp release/go-live-checklist và kết luận SẴN SÀNG hay KHÔNG sẵn sàng giao người dùng.
EOF

# ---------------------------------------------------------------- templates
cat > workflow/templates/brief.md <<'EOF'
# T-xxx: <tên việc>

## Mục tiêu
(1-2 câu) và vai trò người dùng liên quan.

## Căn cứ
- <quy tắc/yêu cầu> -> <tên file tài liệu, mục/slide/trang>

## Phạm vi
Được sửa:
- ...
KHÔNG được sửa:
- ...

## Phụ thuộc
- ...

## Tiêu chí nghiệm thu
AC-1. <câu kiểm tra có/không>
  Cách kiểm: <lệnh / màn hình / dữ liệu thử>
  Kết quả mong đợi: <...>
AC-2. ...

## Ngoài phạm vi
- ...

## Câu hỏi còn mở
- ...
EOF

cat > workflow/templates/build-report.md <<'EOF'
# Báo cáo thực hiện: T-xxx (Vòng 1)

## Đã làm theo từng AC
- AC-1: <đã làm gì, file nào>
- AC-2: ...

## Lệnh đã chạy và kết quả
| Lệnh | Kết quả |
|---|---|

## Giả định đã dùng
- ...

## Điểm chưa chắc chắn
- ...

## Câu hỏi cho backend / bệnh viện
- ...

## Vướng mắc (nếu BLOCKED)
- ...

## Vòng 2, 3 (ghi khi sửa theo verify-report)
- ...
EOF

cat > workflow/templates/verify-report.md <<'EOF'
# Báo cáo đối soát: T-xxx (Vòng 1)

## Kết quả theo tiêu chí
| AC | Kết quả | Bằng chứng |
|---|---|---|
| AC-1 | ĐẠT / KHÔNG ĐẠT | lệnh + kết quả, file:dòng, ảnh chụp/bước thao tác |

## Đối chiếu nghiệp vụ
- <quy tắc> | khớp / không khớp / không có căn cứ | nguồn

## Kiểm tra lại độc lập (do Verifier tự chạy)
| Lệnh | Kết quả |
|---|---|

## Kiểm tra phạm vi
- Sửa ngoài phạm vi: có / không (liệt kê)
- Thêm chức năng ngoài tài liệu: có / không (liệt kê)

## Phát hiện ngoài tiêu chí
| # | Mô tả | Mức độ (chặn/quan trọng/nhỏ) | Vị trí |
|---|---|---|---|

## Kết luận: PASS / FAIL / BLOCKED
Việc cần sửa (nếu FAIL), đánh số:
1. ...
EOF

# ---------------------------------------------------------------- board
cat > workflow/board.md <<'EOF'
# Bảng việc

| Mã | Tên | Vùng | Phụ thuộc | Trạng thái | Số vòng |
|---|---|---|---|---|---|
| T-001 | Màn đăng nhập production | auth+shared | - | TODO | 0 |

(Planner bổ sung các việc tiếp theo ở đây sau khi bạn duyệt.)
EOF

# ---------------------------------------------------------------- T-001
echo "TODO" > workflow/tasks/T-001-login-production/status.md

cat > workflow/tasks/T-001-login-production/brief.md <<'EOF'
# T-001: Màn đăng nhập production

## Mục tiêu
Đưa màn đăng nhập (app/pages/drmayday/auth/login) về chuẩn production: bỏ lối tắt chọn vai trò, bỏ dữ liệu điền sẵn, thống nhất định danh đăng nhập theo API, đủ trạng thái lỗi, điều hướng theo vai trò do máy chủ trả về, và cô lập mock khỏi bản build production. Áp dụng cho cả ba vai trò (Quản trị, Bác sĩ, Bệnh nhân).

## Căn cứ
- Định danh đăng nhập, trường dữ liệu và mã lỗi của API đăng nhập: api-spec/api_spec.csv (Builder phải đọc dòng API đăng nhập và nêu rõ trường định danh thực tế trong build-report).
- Thông báo lỗi tiếng Việt: admin_template/src/lib/errors (error-codes.ts).
- Design system: .agents/rules/enforce-design-system.md và uber-base-tokens.css.
- Mô tả phân quyền 3 cấp (Quản trị, Bác sĩ, Người bệnh): tài liệu trong "from hospital/" (Builder trích dẫn mục cụ thể).

## Phạm vi
Được sửa:
- admin_template/src/app/pages/drmayday/auth/login/**
- admin_template/src/app/core/services/auth.service.ts, admin_template/src/app/core/guards/auth.guard.ts (chỉ phần liên quan điều hướng sau đăng nhập)
- admin_template/src/environments/**
- admin_template/angular.json (chỉ fileReplacements, budgets, tùy chọn production)
- Nơi đăng ký mock interceptor trong admin_template/src/mocks/_base/** và app config
- File test liên quan
KHÔNG được sửa:
- admin_template/src/api/types/**, api-spec/**, "from hospital/"**, "Slide APIs/"**
- Các trang của phân hệ patient, doctor, admin ngoài những chỗ cần để điều hướng

## Phụ thuộc
Không.

## Tiêu chí nghiệm thu
AC-1. Bản production không có khối "Truy cập nhanh theo phân hệ".
  Cách kiểm: build production, phục vụ thư mục dist, mở /login ở trạng thái chưa đăng nhập, tìm chữ "Truy cập nhanh" và ba thẻ chọn vai trò.
  Mong đợi: không có. (Ở development nếu còn giữ thì phải có nhãn "DEV ONLY" và chỉ hiện khi môi trường development.)

AC-2. Không có giá trị điền sẵn ở production.
  Cách kiểm: mở /login ở bản production.
  Mong đợi: ô định danh và ô mật khẩu đều trống; không có tài khoản/mật khẩu hard-code trong mã chạy thật.

AC-3. Định danh đăng nhập thống nhất với API.
  Cách kiểm: đối chiếu trường định danh trong api_spec.csv với nhãn, placeholder, kiểm tra hợp lệ, thuộc tính inputmode và autocomplete của ô nhập.
  Mong đợi: nhãn và dữ liệu nhập khớp trường API (nếu API dùng số điện thoại: nhãn ghi số điện thoại, bàn phím số trên di động, kiểm tra số điện thoại Việt Nam hợp lệ, nhập email bị báo lỗi tiếng Việt cạnh ô). Nếu api_spec.csv cho phép định danh khác thì ghi rõ trong build-report và dừng BLOCKED để hỏi.

AC-4. Đủ trạng thái và thông báo thân thiện.
  Cách kiểm: giả lập (bằng test hoặc mock ở môi trường dev) các trường hợp: đang gửi, sai thông tin, tài khoản bị khóa, hết phiên, mất mạng, lỗi 500.
  Mong đợi: nút gửi bị khóa khi đang gửi (không bấm trùng); sai thông tin chỉ hiện thông báo chung, không tiết lộ tài khoản có tồn tại hay không; mọi thông báo là tiếng Việt từ lib/errors, không hiện mã lỗi thô hay chuỗi như "undefined"/"null".

AC-5. Điều hướng theo vai trò do máy chủ trả về.
  Cách kiểm: đăng nhập (mock dev) lần lượt với tài khoản Quản trị, Bác sĩ, Bệnh nhân; sau đó thử mở thẳng URL của phân hệ khác bằng đổi địa chỉ; thử mở route phân hệ khi chưa đăng nhập.
  Mong đợi: sau đăng nhập vào đúng phân hệ theo vai trò trong phản hồi; vào route của vai trò khác bị chặn và hiện trang "không đủ quyền" thân thiện hoặc chuyển hướng hợp lý; chưa đăng nhập thì chuyển về /login.

AC-6. Bundle production sạch mock.
  Cách kiểm: build production rồi tìm trong dist/ các chuỗi "mock-db", "mock-http-interceptor", "USE_MOCK", "DEV ONLY", "Truy cập nhanh", và số điện thoại/mật khẩu demo.
  Mong đợi: không tìm thấy chuỗi nào. Builder cung cấp lệnh quét có thể chạy lại (script trong package.json hoặc bước CI).

AC-7. Quên mật khẩu.
  Cách kiểm: tra api_spec.csv có API quên/đặt lại mật khẩu hay không.
  Mong đợi: nếu có API thì có liên kết "Quên mật khẩu" dẫn tới luồng hoạt động hoặc ghi rõ vào build-report là tách thành việc riêng; nếu không có API thì ghi vào câu hỏi cho backend, không tự bịa.

AC-8. Truy cập và đáp ứng thiết bị.
  Cách kiểm: thao tác chỉ bằng bàn phím (Tab/Enter), kiểm tra nhãn gắn với ô nhập, nút hiện/ẩn mật khẩu có aria-label, độ tương phản chữ đạt AA, hiển thị ở chiều rộng 360px.
  Mong đợi: hoàn tất đăng nhập chỉ bằng bàn phím; không vỡ bố cục ở 360px; không có giá trị màu/khoảng cách ngoài token.

AC-9. Chất lượng mã.
  Cách kiểm: chạy cài sạch, tsc strict, lint, test, build production.
  Mong đợi: tất cả xanh; có test cho kiểm tra hợp lệ định danh, các trạng thái lỗi ở AC-4, và điều hướng theo vai trò ở AC-5.

AC-10. Không lộ dữ liệu nhạy cảm.
  Cách kiểm: đăng nhập và quan sát console, thanh địa chỉ, localStorage/sessionStorage, tab Network.
  Mong đợi: không có số điện thoại, mật khẩu hay token xuất hiện trong console, URL; token không lưu ở chỗ mà tài liệu/brief cấm (nếu chưa rõ cơ chế, ghi câu hỏi cho backend: cookie httpOnly hay token).

## Ngoài phạm vi
- Làm lại giao diện hay branding trang đăng nhập.
- Tính năng đăng ký tài khoản.
- Thiết lập CI/CD (là việc riêng).

## Câu hỏi còn mở
- Backend cấp phiên bằng cookie httpOnly hay token trả về trong thân phản hồi?
- API đăng nhập có trả vai trò và quyền trong cùng phản hồi không?
EOF

echo
echo "Đã tạo xong thư mục workflow/:"
find workflow -type f | sort
echo
echo "Bước tiếp theo: mở workflow/README.md, rồi dán workflow/prompts/01-planner.md vào agent đầu tiên."
