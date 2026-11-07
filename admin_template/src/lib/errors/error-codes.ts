export const ERROR_MESSAGES: Record<string, string> = {
  // 1000: Success
  '1000': 'Xử lý thành công.',
  '1001': 'Tạo dữ liệu thành công.',

  // 2001-2007: Validation
  '2001': 'Vui lòng điền đầy đủ các thông tin bắt buộc.',
  '2002': 'Kiểu dữ liệu nhập vào không hợp lệ.',
  '2003': 'Giá trị dữ liệu không hợp lệ.',
  '2004': 'Số điện thoại không đúng chuẩn (phải là 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09).',
  '2005': 'Định dạng email không hợp lệ.',
  '2006': 'Định dạng ngày tháng không hợp lệ (chuẩn: YYYY-MM-DD).',
  '2007': 'Cấu trúc dữ liệu yêu cầu không đúng định dạng.',

  // 3001-3009: Auth
  '3001': 'Phiên đăng nhập không hợp lệ hoặc đã bị thay đổi.',
  '3002': 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
  '3003': 'Vui lòng đăng nhập để thực hiện thao tác này.',
  '3004': 'Mã xác thực OTP không chính xác. Vui lòng thử lại.',
  '3005': 'Mã xác thực OTP đã hết hạn (sau 10 phút).',
  '3006': 'Số điện thoại hoặc email này đã tồn tại trên hệ thống.',
  '3007': 'Tài khoản không tồn tại trên hệ thống.',
  '3008': 'Số điện thoại hoặc mật khẩu không chính xác.',
  '3009': 'Mật khẩu hiện tại không chính xác.',

  // 3101-3106: Authorization
  '3101': 'Bạn không có quyền thực hiện thao tác này.',
  '3102': 'Thao tác này chỉ dành riêng cho Quản trị viên.',
  '3103': 'Thao tác này chỉ dành riêng cho Bác sĩ.',
  '3104': 'Thao tác này chỉ dành riêng cho Bệnh nhân.',
  '3105': 'Bạn không được phân công phụ trách hồ sơ bệnh án này.',
  '3106': 'Bạn không có quyền truy cập dữ liệu của người bệnh khác.',

  // 4001-4009: Medical Record
  '4001': 'Không tìm thấy hồ sơ bệnh án yêu cầu.',
  '4002': 'Bệnh nhân cần có một hồ sơ bệnh án đang hoạt động.',
  '4003': 'Hồ sơ bệnh án đã kết luận hoàn tất, không thể chỉnh sửa thêm.',
  '4004': 'Chỉ có thể tiếp nhận ca khám đang ở trạng thái chờ tiếp nhận.',
  '4005': 'Hồ sơ bệnh án này đã được bác sĩ khác tiếp nhận.',
  '4006': 'Vui lòng hoàn thành đầy đủ các câu hỏi sàng lọc phân loại.',
  '4007': 'Danh sách câu trả lời bệnh sử không được để trống.',
  '4008': 'Câu hỏi không thuộc mẫu biểu khám của bệnh án này.',
  '4009': 'Trạng thái chuyển đổi hồ sơ không hợp lệ.',

  // 4101-4105: Template
  '4101': 'Không tìm thấy mẫu phiếu khám trên hệ thống.',
  '4102': 'Mã định danh mẫu phiếu khám đã tồn tại.',
  '4103': 'Không tìm thấy phân mục phiếu khám.',
  '4104': 'Không tìm thấy câu hỏi trong phân mục.',
  '4105': 'Mẫu phiếu khám đang được sử dụng trong bệnh án, không thể xóa.',

  // 5001-5005: UAS7
  '5001': 'Bệnh nhân chưa đủ điều kiện chấm điểm (Cần có bệnh án mạn tính đang hoạt động).',
  '5002': 'Bạn đã ghi nhận điểm UAS7 cho ngày này rồi.',
  '5003': 'Điểm sẩn phù phải từ 0 đến 3 điểm.',
  '5004': 'Điểm ngứa ngáy phải từ 0 đến 3 điểm.',
  '5005': 'Vui lòng chọn ngày ghi nhận điểm.',

  // 6001-6007: Image
  '6001': 'Vui lòng chọn tệp hình ảnh để tải lên.',
  '6002': 'Định dạng tệp không được hỗ trợ (Chỉ chấp nhận JPG, PNG, WebP).',
  '6003': 'Dung lượng tệp ảnh vượt quá giới hạn cho phép (Tối đa 10MB).',
  '6004': 'Số lượng ảnh tải lên một lần vượt quá quy định (Tối đa 10 ảnh).',
  '6005': 'Không tìm thấy hình ảnh đính kèm.',
  '6006': 'Hình ảnh này đã được liên kết với câu trả lời.',
  '6007': 'Lỗi lưu trữ hình ảnh máy chủ. Vui lòng thử lại sau.',

  // 7001-7007: Lesion
  '7001': 'Không tìm thấy đợt tổn thương mề đay.',
  '7002': 'Không tìm thấy vị trí tổn thương.',
  '7003': 'Không tìm thấy ảnh chụp tổn thương.',
  '7004': 'Tên đợt tổn thương không được để trống.',
  '7005': 'Vị trí trên cơ thể không được để trống.',
  '7006': 'Giai đoạn tiến triển chỉ nhận: Khởi phát (start), Đỉnh điểm (peak), Lặn sẩn (normal).',
  '7007': 'Điểm triệu chứng (ngứa, đau, rát) phải nằm trong khoảng từ 0 đến 10.',

  // 8001-8003: Prescription
  '8001': 'Đơn thuốc điện tử phải có ít nhất 1 loại thuốc.',
  '8002': 'Tên thuốc không được để trống.',
  '8003': 'Bệnh án này đã được kê đơn thuốc.',

  // 8101-8103: Lab
  '8101': 'Phải chọn ít nhất 1 chỉ định xét nghiệm.',
  '8102': 'Tên xét nghiệm không được để trống.',
  '8103': 'Không tìm thấy phiếu yêu cầu xét nghiệm.',

  // 9001-9003: AI
  '9001': 'Không thể chạy phân tích mô hình nhận diện nốt sẩn AI.',
  '9002': 'Hệ thống máy chủ AI đang bận. Vui lòng thử lại sau.',
  '9003': 'Điểm ngứa truyền vào cho AI không hợp lệ.',

  // 9101-9102: Notification
  '9101': 'Thiếu mã thông báo thiết bị (FCM Token).',
  '9102': 'Không tìm thấy thông báo yêu cầu.',

  // 9901-9903: System
  '9901': 'Hệ thống đang gặp sự cố nội bộ. Đội ngũ kỹ thuật đã được thông báo.',
  '9902': 'Lỗi kết nối cơ sở dữ liệu bệnh viện. Vui lòng thử lại.',
  '9903': 'Dịch vụ lưu trữ bên thứ ba không phản hồi.',
};

export function getErrorMessageByCode(code: string | number, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.'): string {
  const c = String(code);
  return ERROR_MESSAGES[c] || fallback;
}
