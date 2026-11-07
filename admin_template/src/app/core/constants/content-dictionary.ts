/**
 * TỪ ĐIỂN NỘI DUNG & THUẬT NGỮ CHUẨN HÓA GIAO DIỆN Y TẾ DRMAYDAY
 * Quy chuẩn theo Bệnh viện Da liễu Trung ương & Uber Base Design System
 * 
 * NGUYÊN TẮC:
 * 1. Tên kỹ thuật (biến, token, key CSDL) chỉ tồn tại trong code.
 * 2. Tên hiển thị (User UI) lấy từ từ điển này, không bao giờ render trực tiếp enum/variable name.
 */

export const CLINICAL_LABELS = {
  // Thương hiệu & Đơn vị
  hospitalName: 'Bệnh viện Da liễu Trung ương',
  hospitalSubtitle: 'Đề tài Nghiên cứu Khoa học Công nghệ Cấp Bộ Y Tế',
  systemName: 'DrMayDay',
  systemFullName: 'Hệ Thống Quản Lý Bệnh Án Lâm Sàng Mày Đay',
  hotline: '1900 6951',
  supportText: 'Hotline hỗ trợ & Cấp cứu:',

  // Vai trò người dùng (Roles)
  roles: {
    admin: {
      label: 'Quản trị viên',
      shortLabel: 'Quản trị',
      iconClass: 'isax-b icon-shield-tick',
      badgeClass: 'base-tag base-tag-neutral',
    },
    doctor: {
      label: 'Bác sĩ điều trị',
      shortLabel: 'Bác sĩ',
      iconClass: 'isax-b icon-health',
      badgeClass: 'base-tag base-tag-info',
    },
    patient: {
      label: 'Người bệnh',
      shortLabel: 'Bệnh nhân',
      iconClass: 'isax-b icon-user',
      badgeClass: 'base-tag base-tag-positive',
    },
  },

  // Sàng lọc nguy cơ & Cấp cứu (Emergency & Red Flags)
  emergency: {
    redFlagTitle: 'DẤU HIỆU CẢNH BÁO NGUY HIỂM (NGUY CƠ PHẢN VỆ)',
    redFlagSubtitle: 'Cần can thiệp y tế khẩn cấp ngay lập tức',
    call115: 'GỌI CẤP CỨU 115 NGAY LẬP TỨC',
    acuteLabel: 'Mày đay Cấp tính',
    chronicLabel: 'Mày đay Mạn tính',
    guidelineStandard: 'Quy chuẩn Hội Dị ứng Lâm sàng Quốc tế',
    angioedema: 'Sưng phù môi, lưỡi, họng (Phù mạch)',
    safeMessage: 'Dữ liệu y tế được bảo mật và quản lý an toàn theo quy định Bộ Y Tế.',
  },

  // Thang đo hoạt động bệnh UAS7 (iss7 & hss7)
  uas7: {
    title: 'Nhật Ký Đánh Giá Triệu Chứng Hằng Ngày',
    dailyTotalLabel: 'Tổng điểm triệu chứng trong ngày',
    dailyFormulaLabel: 'Thang điểm kết hợp sẩn phù và ngứa (0 - 6 điểm / ngày)',
    iss7Label: 'Mức độ nổi nốt sẩn phù',
    hss7Label: 'Mức độ ngứa ngáy',
    historyTitle: 'Lịch Sử Diễn Tiến Thang Điểm UAS7',
    levels: {
      remission: 'Kiểm soát hoàn toàn (0 điểm)',
      mild: 'Mức độ nhẹ (1 - 2 điểm)',
      moderate: 'Mức độ vừa (3 - 4 điểm)',
      severe: 'Mức độ nặng (5 - 6 điểm)',
    },
  },

  // Theo dõi tổn thương da & Đợt bùng phát (Lesion tracking)
  lesions: {
    title: 'Kho Ảnh Lâm Sàng & Đợt Bùng Phát',
    milestones: {
      start: '1. Giai đoạn khởi phát sẩn',
      peak: '2. Giai đoạn bùng phát đỉnh điểm',
      normal: '3. Giai đoạn sẩn lặn / hồi phục',
    },
    bodyPartLabel: 'Vị trí tổn thương trên cơ thể',
    aiAnalysis: 'Hỗ trợ nhận diện số lượng nốt sẩn & diện tích tổn thương',
    tagPrefix: '#',
  },

  // Quy chuẩn thao tác CSDL Quản trị (Thay thế RESTRICT / SET NULL)
  topology: {
    restrictRule: 'Quy tắc an toàn: Chặn xóa khi còn khoa phòng hoặc nhân sự trực thuộc',
    setNullRule: 'Quy tắc an toàn: Khi xóa khoa phòng, các phòng khám trực thuộc sẽ chuyển về trạng thái chờ phân khoa',
    deleteBranchBtn: 'Xóa cơ sở',
    deleteDeptBtn: 'Xóa khoa phòng',
    deleteRoomBtn: 'Xóa phòng khám',
    unassignedDept: '-- Chưa phân bổ khoa phòng phụ trách --',
    confirmDeleteDept: 'Xóa khoa phòng này sẽ chuyển các phòng khám trực thuộc về trạng thái chưa phân khoa. Bạn có chắc chắn muốn xóa?',
    confirmDeleteBranch: 'Không thể xóa chi nhánh khi vẫn còn khoa phòng hoặc nhân sự trực thuộc!',
  },

  // Quản trị nhân sự & Tài khoản
  staff: {
    userCascadeRule: 'Quy tắc lưu trữ: Khi hủy tài khoản nhân sự, lịch sử hồ sơ bệnh án đã lập vẫn được bảo toàn nguyên vẹn',
    activeStatus: 'Đang công tác',
    assignSuccess: 'Đã cập nhật phân công công tác thành công',
  },

  // Form Builder Động
  formBuilder: {
    templateHeading: 'Mẫu Phiếu Khám Y Tế Chuyên Khoa',
    sectionsHeading: 'Các Phân Mục Khai Thác',
    questionsHeading: 'Bộ Câu Hỏi & Tùy Chọn Trả Lời',
    viewTreeBtn: 'Xem Cấu Trúc Biểu Mẫu',
    filledBy: {
      patient: 'Bệnh nhân tự khai',
      doctor: 'Bác sĩ thăm khám',
      both: 'Cả hai cùng điền',
    },
    questionTypes: {
      radio: 'Chọn 1 phương án (Radio)',
      checkbox: 'Chọn nhiều phương án (Checkbox)',
      text: 'Nhập văn bản ngắn',
      textarea: 'Nhập đoạn văn bản chi tiết',
      number: 'Nhập số lượng',
    },
    branchingCondition: 'Hiển thị khi câu trả lời trước là:',
  },

  // Lỗi & Thông báo người dùng
  notifications: {
    heading: 'Thông báo y tế',
    viewAll: 'Xem tất cả thông báo',
    empty: 'Không có thông báo mới',
  },
  notFound: {
    title: 'Không Tìm Thấy Trang Yêu Cầu',
    description: 'Đường dẫn bạn yêu cầu không tồn tại, đã được di chuyển hoặc bạn chưa được cấp quyền truy cập.',
    backHome: 'Quay Về Trang Chủ',
  },
};
