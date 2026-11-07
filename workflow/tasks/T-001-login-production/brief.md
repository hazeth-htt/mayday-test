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
