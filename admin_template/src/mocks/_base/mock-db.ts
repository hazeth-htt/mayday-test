import {
  AuthUserInfo,
  BranchDto,
  ClassifyQuestionDto,
  DepartmentDto,
  LabRequestDto,
  LesionEpisodeDto,
  MedicalRecordDto,
  NotificationDto,
  PermissionDto,
  PrescriptionDto,
  RoleDto,
  RoomDto,
  TemplateDetailDto,
  Uas7ScoreDto,
  UserProfileDto,
} from '../../api/types';

export class MockDatabase {
  users: Array<UserProfileDto & { password: string; phone: string }> = [
    {
      user_id: 1,
      full_name: 'Quản trị viên Hệ thống',
      phone: '0901234567',
      password: 'Admin@123',
      role_id: 1,
      gender: 'male',
      year_of_birth: 1985,
      city_address: 'Hà Nội',
    },
    {
      user_id: 2,
      full_name: 'TS.BS. Nguyễn Văn Hùng',
      phone: '0912345678',
      password: 'Doctor@123',
      role_id: 2,
      gender: 'male',
      year_of_birth: 1980,
      work_place: 'Bệnh viện Da liễu Trung ương',
      city_address: 'Hà Nội',
    },
    {
      user_id: 3,
      full_name: 'Nguyễn Thị Mai',
      phone: '0988776655',
      password: 'Patient@123',
      role_id: 3,
      gender: 'female',
      year_of_birth: 1995,
      career: 'Nhân viên văn phòng',
      ethnic: 'Kinh',
      hamlet_address: 'Phòng 402, Nhà A',
      commune_address: 'Phương Mai',
      city_address: 'Hà Nội',
      health_insurance_number: 'DN4010120894567',
      health_insurance_validate: '2027-12-31',
      next_of_kin_name: 'Nguyễn Văn Nam',
      next_of_kin_phone: '0912888999',
      first_visit: '2026-01-15T08:30:00Z',
    },
    {
      user_id: 4,
      full_name: 'Trần Văn Bình',
      phone: '0977665544',
      password: 'Patient@123',
      role_id: 3,
      gender: 'male',
      year_of_birth: 1988,
      career: 'Kỹ sư',
      ethnic: 'Kinh',
      city_address: 'Hà Nội',
    },
  ];

  branches: BranchDto[] = [
    { id: 1, name: 'Cơ sở 1 - 15A Phương Mai, Đống Đa, Hà Nội', address: '15A Phương Mai, Hà Nội', phone: '1900 6951', is_active: 1 },
    { id: 2, name: 'Cơ sở 2 - Cơ sở Khám chữa bệnh Quốc Tế', address: 'Quận Cầu Giấy, Hà Nội', phone: '024 3825 2222', is_active: 1 },
  ];

  departments: DepartmentDto[] = [
    { id: 1, branch_id: 1, name: 'Khoa Dị ứng & Miễn dịch Lâm sàng', description: 'Chuyên khoa sâu về mày đay và dị ứng da' },
    { id: 2, branch_id: 1, name: 'Khoa Khám bệnh & Cấp cứu Da liễu', description: 'Tiếp nhận và khám sàng lọc ban đầu' },
  ];

  rooms: RoomDto[] = [
    { id: 1, department_id: 1, name: 'Phòng Khám Dị Ứng 204', description: 'Phòng khám lâm sàng mề đay' },
    { id: 2, department_id: 1, name: 'Phòng Thử Nghiệm Dị Nguyên 205', description: 'Thực hiện test da & lẩy da' },
    { id: 3, department_id: 2, name: 'Phòng Cấp Cứu Ban Đầu', description: 'Tiếp nhận các ca sốc phản vệ / phù mạch cấp' },
  ];

  roles: RoleDto[] = [
    { id: 1, name: 'Quản trị viên Hệ thống', description: 'Toàn quyền cấu hình và quản trị' },
    { id: 2, name: 'Bác sĩ Lâm sàng', description: 'Khám bệnh, chẩn đoán, kê đơn, chỉ định xét nghiệm' },
    { id: 3, name: 'Bệnh nhân', description: 'Tự khai báo bệnh sử, chấm điểm UAS7, gửi ảnh tổn thương' },
  ];

  permissions: PermissionDto[] = [
    { id: 1, name: 'manage_topology', description: 'Quản lý cơ sở, khoa và phòng khám' },
    { id: 2, name: 'manage_users', description: 'Quản lý tài khoản và phân quyền' },
    { id: 3, name: 'view_records', description: 'Xem hồ sơ bệnh án' },
    { id: 4, name: 'accept_record', description: 'Tiếp nhận ca khám' },
    { id: 5, name: 'prescribe_medication', description: 'Kê đơn thuốc điện tử' },
    { id: 6, name: 'request_lab', description: 'Chỉ định cận lâm sàng' },
  ];

  rolePermissions: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5, 6],
    2: [3, 4, 5, 6],
    3: [3],
  };

  classifyQuestions: ClassifyQuestionDto[] = [
    {
      question_id: 'Q_RED_FLAGS',
      question_text: 'Bạn có gặp bất kỳ dấu hiệu nguy cấp nào dưới đây không (Khó thở, nghẹn họng, choáng váng)?',
      type_question: 'radio',
      options: [
        { id: 1, option_text: 'Có (Cần cấp cứu ngay)', option_value: 'YES' },
        { id: 2, option_text: 'Không có dấu hiệu trên', option_value: 'NO' },
      ],
    },
    {
      question_id: 'Q_DURATION',
      question_text: 'Các đợt nổi sẩn phù và ngứa của bạn đã kéo dài trong bao lâu?',
      type_question: 'radio',
      options: [
        { id: 3, option_text: 'Dưới 6 tuần (Mày đay cấp tính)', option_value: 'ACUTE' },
        { id: 4, option_text: 'Từ 6 tuần trở lên (Mày đay mạn tính)', option_value: 'CHRONIC' },
      ],
    },
  ];

  templates: TemplateDetailDto[] = [
    {
      code_template: 'TMPL_MAY_DAY_MAN',
      name: 'Mẫu Khám Mày Đay Mạn Tính (CSU v2.0)',
      description: 'Phiếu khai thác bệnh sử lâm sàng mày đay mạn tính theo chuẩn Bộ Y Tế',
      version: '2.0',
      is_active: 1,
      created_at: '2026-01-01T00:00:00Z',
      sections: [
        {
          section_id: 'sec-01',
          template_id: 'TMPL_MAY_DAY_MAN',
          title: 'I. Tiền sử đợt bệnh & Dấu hiệu ban đầu',
          order: 1,
          is_required: 1,
          filled_by: 'patient',
          questions: [
            {
              question_id: 'thoi_gian_mac_benh',
              question_text: 'Thời gian bạn bắt đầu xuất hiện những nốt sẩn phù đầu tiên?',
              type_question: 'radio',
              order: 1,
              is_required: 1,
              options: [
                { id: 'opt-01', option_text: 'Dưới 6 tuần', option_value: 'under_6_weeks' },
                { id: 'opt-02', option_text: 'Trên 6 tuần (Mạn tính)', option_value: 'over_6_weeks' },
              ],
            },
            {
              question_id: 'thoi_gian_ton_tai_san',
              question_text: 'Mỗi nốt sẩn phù riêng lẻ thường tồn tại trong bao lâu trước khi lặn?',
              type_question: 'radio',
              order: 2,
              is_required: 1,
              options: [
                { id: 'opt-03', option_text: 'Lặn trong vòng 24 giờ (Không để lại vết thâm)', option_value: 'under_24h' },
                { id: 'opt-04', option_text: 'Tồn tại kéo dài trên 24 giờ', option_value: 'over_24h' },
              ],
            },
            {
              question_id: 'co_phu_mach',
              question_text: 'Bạn có từng bị sưng phù vùng mí mắt, môi hoặc bàn tay bàn chân không?',
              type_question: 'radio',
              order: 3,
              is_required: 1,
              options: [
                { id: 'opt-05', option_text: 'Không bị phù mạch', option_value: 'no' },
                { id: 'opt-06', option_text: 'Có từng bị sưng phù (Phù mạch dưới da)', option_value: 'yes' },
              ],
            },
          ],
        },
      ],
    },
    {
      code_template: 'TMPL_MAY_DAY_CAP',
      name: 'Mẫu Khám Mày Đay Cấp Tính (< 6 tuần)',
      description: 'Phiếu khai thác bệnh sử lâm sàng mày đay cấp tính theo chuẩn Bộ Y Tế',
      version: '1.0',
      is_active: 1,
      created_at: '2026-03-01T00:00:00Z',
      sections: [
        {
          section_id: 'sec-cap-01',
          template_id: 'TMPL_MAY_DAY_CAP',
          title: 'I. Diễn biến khởi phát đợt cấp & Triệu chứng da',
          order: 1,
          is_required: 1,
          filled_by: 'patient',
          questions: [
            {
              question_id: 'thoi_gian_khoi_phat_cap',
              question_text: 'Đợt sẩn đỏ ngứa này bắt đầu xuất hiện từ khi nào?',
              type_question: 'radio',
              order: 1,
              is_required: 1,
              options: [
                { id: 'opt-c1', option_text: 'Trong vòng 24 giờ qua', option_value: 'under_24h' },
                { id: 'opt-c2', option_text: 'Từ 1 đến 7 ngày trước', option_value: '1_to_7_days' },
                { id: 'opt-c3', option_text: 'Từ 1 đến 6 tuần trước', option_value: '1_to_6_weeks' },
              ],
            },
            {
              question_id: 'thoi_gian_ton_tai_san',
              question_text: 'Mỗi nốt sẩn đỏ thường tự biến mất trong bao lâu?',
              type_question: 'radio',
              order: 2,
              is_required: 1,
              options: [
                { id: 'opt-c4', option_text: 'Dưới 24 giờ (Điển hình mày đay thông thường)', option_value: 'under_24h' },
                { id: 'opt-c5', option_text: 'Kéo dài trên 24 giờ', option_value: 'over_24h' },
              ],
            },
            {
              question_id: 'yeu_to_nghi_ngo_cap',
              question_text: 'Yếu tố nghi ngờ liên quan (hải sản, kháng sinh, ong đốt...)?',
              type_question: 'checkbox',
              order: 3,
              is_required: 0,
              options: [
                { id: 'opt-c6', option_text: 'Thức ăn lạ / Hải sản', option_value: 'seafood' },
                { id: 'opt-c7', option_text: 'Thuốc kháng sinh / giảm đau', option_value: 'drug' },
                { id: 'opt-c8', option_text: 'Côn trùng / Sốt nhiễm khuẩn', option_value: 'insect_infection' },
              ],
            },
          ],
        },
      ],
    },
  ];

  records: MedicalRecordDto[] = [
    {
      medical_record_id: 101,
      patient_id: 3,
      assigned_doctor_id: 2,
      template_id: 'TMPL_MAY_DAY_MAN',
      status: 'in_progress',
      created_at: '2026-03-08T08:15:00Z',
      patient_name: 'Nguyễn Thị Mai',
      patient_phone: '0988776655',
      patient_gender: 'female',
    },
    {
      medical_record_id: 102,
      patient_id: 4,
      assigned_doctor_id: null,
      template_id: 'TMPL_MAY_DAY_MAN',
      status: 'pending',
      created_at: '2026-03-08T09:00:00Z',
      patient_name: 'Trần Văn Bình',
      patient_phone: '0977665544',
      patient_gender: 'male',
    },
  ];

  uas7Scores: Uas7ScoreDto[] = [
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-02', iss7: 2, hss7: 2, daily_score: 4 },
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-03', iss7: 1, hss7: 2, daily_score: 3 },
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-04', iss7: 2, hss7: 3, daily_score: 5 },
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-05', iss7: 1, hss7: 1, daily_score: 2 },
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-06', iss7: 2, hss7: 2, daily_score: 4 },
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-07', iss7: 1, hss7: 2, daily_score: 3 },
    { patient_id: 3, medical_record_id: 101, score_date: '2026-03-08', iss7: 1, hss7: 2, daily_score: 3 },
  ];

  prescriptions: PrescriptionDto[] = [
    {
      prescription_id: 'rx-101',
      medical_record_id: 101,
      created_by: 2,
      note: 'Uống thuốc đúng giờ sau ăn, hạn chế gãi xước da và tránh tắm nước quá nóng.',
      created_at: '2026-03-08T10:00:00Z',
      items: [
        {
          prescription_item_id: 'rx-item-01',
          medicine_name: 'Fexofenadine (Telfast) 180mg',
          dosage: '180mg',
          frequency: '1 lần/ngày',
          duration: '14 ngày',
          instruction: 'Uống 1 viên vào buổi tối sau ăn',
          created_at: '2026-03-08T10:00:00Z',
        },
        {
          prescription_item_id: 'rx-item-02',
          medicine_name: 'Kem dưỡng ẩm phục hồi da dịu nhẹ',
          dosage: 'Bôi ngoài da',
          frequency: '2 lần/ngày',
          duration: '14 ngày',
          instruction: 'Bôi lớp mỏng lên vùng da khô ngứa sau khi tắm',
          created_at: '2026-03-08T10:00:00Z',
        },
      ],
    },
  ];

  labRequests: LabRequestDto[] = [
    {
      id: 'lab-101',
      medical_record_id: 101,
      requested_by: 2,
      status: 'completed',
      note: 'Kiểm tra công thức máu và kháng thể dị ứng IgE',
      created_at: '2026-03-08T08:30:00Z',
      items: [
        {
          id: 'lab-item-01',
          test_name: 'Tổng phân tích tế bào máu ngoại vi',
          description: 'Đánh giá bạch cầu ái toan (Eosinophil)',
          result_id: 'res-01',
          result_value: 'Bạch cầu ái toan 6.2% (Tăng nhẹ)',
          concluded_by: 2,
          created_at: '2026-03-08T08:30:00Z',
        },
        {
          id: 'lab-item-02',
          test_name: 'Định lượng IgE toàn phần huyết thanh',
          description: 'Chỉ số miễn dịch dị ứng',
          result_id: 'res-02',
          result_value: '185 IU/mL (Ngưỡng tham chiếu: < 100 IU/mL)',
          concluded_by: 2,
          created_at: '2026-03-08T08:30:00Z',
        },
      ],
    },
  ];

  lesionEpisodes: LesionEpisodeDto[] = [
    {
      episode_id: 'ep-101',
      medical_record_id: 101,
      patient_id: 3,
      name: 'Đợt sẩn bùng phát sau khi tắm nước ấm',
      occurred_at: '2026-03-07T20:30:00Z',
      context_tags: ['Tắm nước nóng', 'Thời tiết chuyển mùa'],
      medication_name: 'Telfast 180mg',
      medication_taken_ago: '1 giờ trước',
      description: 'Nổi mảng đỏ gồ cẳng tay và đùi trái, ngứa dữ dội',
      created_at: '2026-03-07T21:00:00Z',
    },
  ];

  notifications: NotificationDto[] = [
    {
      id: 'noti-01',
      user_id: 3,
      title: 'Nhắc nhở chấm điểm UAS7 hôm nay',
      body: 'Bạn đừng quên dành 1 phút ghi nhận mức độ nổi sẩn và ngứa da trong ngày hôm nay nhé.',
      type: 'uas7_reminder',
      is_read: '0',
      created_at: '2026-03-08T19:00:00Z',
    },
    {
      id: 'noti-02',
      user_id: 3,
      title: 'Đã có kết quả xét nghiệm máu',
      body: 'Bác sĩ Nguyễn Văn Hùng đã gửi kết quả xét nghiệm định lượng IgE vào hồ sơ khám của bạn.',
      type: 'lab_result',
      reference_id: '101',
      is_read: '0',
      created_at: '2026-03-08T11:30:00Z',
    },
  ];
}

export const mockDb = new MockDatabase();
