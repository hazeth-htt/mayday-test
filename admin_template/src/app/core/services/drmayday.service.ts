import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Branch,
  Department,
  FormQuestion,
  FormSection,
  FormTemplate,
  LabRequest,
  LesionEpisode,
  MedicalRecord,
  MedicalRecordStatus,
  Permission,
  Prescription,
  Role,
  RoleType,
  Room,
  Staff,
  SystemNotification,
  UAS7DailyScore,
  User,
} from '../models/drmayday.models';
import {
  INITIAL_BRANCHES,
  INITIAL_DEPARTMENTS,
  INITIAL_LAB_REQUESTS,
  INITIAL_LESION_EPISODES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PERMISSIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_RECORDS,
  INITIAL_ROLES,
  INITIAL_ROOMS,
  INITIAL_STAFFS,
  INITIAL_TEMPLATES,
  INITIAL_UAS7_SCORES,
  INITIAL_USERS,
} from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class DrMayDayService {
  // Current active role for pair testing / role switching
  currentRole = signal<RoleType>('admin');

  // Signals for state
  users = signal<User[]>(INITIAL_USERS);
  staffs = signal<Staff[]>(INITIAL_STAFFS);
  branches = signal<Branch[]>(INITIAL_BRANCHES);
  departments = signal<Department[]>(INITIAL_DEPARTMENTS);
  rooms = signal<Room[]>(INITIAL_ROOMS);
  permissions = signal<Permission[]>(INITIAL_PERMISSIONS);
  roles = signal<Role[]>(INITIAL_ROLES);
  templates = signal<FormTemplate[]>(INITIAL_TEMPLATES);
  records = signal<MedicalRecord[]>(INITIAL_RECORDS);
  uas7Scores = signal<UAS7DailyScore[]>(INITIAL_UAS7_SCORES);
  prescriptions = signal<Prescription[]>(INITIAL_PRESCRIPTIONS);
  labRequests = signal<LabRequest[]>(INITIAL_LAB_REQUESTS);
  lesionEpisodes = signal<LesionEpisode[]>(INITIAL_LESION_EPISODES);
  notifications = signal<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  private auth = inject(AuthService, { optional: true });

  // Computed state
  currentUser = computed(() => {
    const authUser = this.auth?.currentUser();
    if (authUser) {
      const match = this.users().find((u) => u.email === authUser.email || u.id === authUser.id);
      if (match) return match;
    }
    const role = (authUser?.role as RoleType) || this.currentRole();
    return this.users().find((u) => u.role === role) || this.users()[0];
  });

  unreadNotificationsCount = computed(() => {
    return this.notifications().filter((n) => !n.is_read).length;
  });

  // Switch role helper
  setRole(role: RoleType) {
    this.currentRole.set(role);
  }

  // ==========================================
  // 1. Quản lý Tài khoản & Phân công (Slide 3)
  // ==========================================
  getUsersList() {
    return this.users();
  }

  createUser(user: Omit<User, 'id' | 'created_at'>) {
    const newUser: User = {
      ...user,
      id: `u-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.users.update((prev) => [newUser, ...prev]);
    return { code: 1000, message: 'Tạo tài khoản thành công', data: newUser };
  }

  editUser(id: string, updates: Partial<User>) {
    this.users.update((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    return { code: 1000, message: 'Cập nhật tài khoản thành công' };
  }

  deleteUser(id: string) {
    // Ràng buộc bảo toàn dữ liệu y tế: giữ nguyên medical_records, gán created_by = null
    this.records.update((prev) =>
      prev.map((r) => (r.created_by === id ? { ...r, created_by: null } : r))
    );
    this.users.update((prev) => prev.filter((u) => u.id !== id));
    return { code: 1000, message: 'Xóa người dùng thành công (Bảo tồn bệnh án)' };
  }

  assignUser(staffId: string, branchId: string, departmentId: string, roomId: string) {
    this.staffs.update((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, branch_id: branchId, department_id: departmentId, room_id: roomId }
          : s
      )
    );
    return { code: 1000, message: 'Phân công nhân sự thành công' };
  }

  // ==========================================
  // 2. Phân quyền RBAC (Slide 3)
  // ==========================================
  getRolesList() {
    return this.roles();
  }

  createRole(role: Omit<Role, 'id'>) {
    const newRole: Role = {
      ...role,
      id: `role-${Date.now()}`,
    };
    this.roles.update((prev) => [...prev, newRole]);
    return { code: 1000, message: 'Tạo vai trò thành công', data: newRole };
  }

  updateRolePermissions(roleId: string, permissionIds: string[]) {
    this.roles.update((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: permissionIds } : r))
    );
    return { code: 1000, message: 'Cập nhật quyền hạn cho vai trò thành công' };
  }

  // ==========================================
  // 3. Quản lý Hạ tầng Cơ sở vật chất Topology (Slide 4)
  // ==========================================
  createBranch(branch: Omit<Branch, 'id' | 'departments_count' | 'staffs_count'>) {
    const newBranch: Branch = {
      ...branch,
      id: `br-${Date.now()}`,
      departments_count: 0,
      staffs_count: 0,
    };
    this.branches.update((prev) => [...prev, newBranch]);
    return { code: 1000, message: 'Tạo chi nhánh thành công', data: newBranch };
  }

  deleteBranch(branchId: string) {
    // Chặn xóa nếu còn khoa trực thuộc
    const hasDepartments = this.departments().some((d) => d.branch_id === branchId);
    if (hasDepartments) {
      return {
        code: 3105,
        error: 'Quy tắc an toàn: Không thể xóa Chi nhánh khi vẫn còn Khoa phòng trực thuộc!',
      };
    }
    this.branches.update((prev) => prev.filter((b) => b.id !== branchId));
    return { code: 1000, message: 'Xóa chi nhánh thành công' };
  }

  createDepartment(dept: Omit<Department, 'id' | 'rooms_count'>) {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      rooms_count: 0,
    };
    this.departments.update((prev) => [...prev, newDept]);
    // Cập nhật số khoa trong branch
    this.branches.update((prev) =>
      prev.map((b) =>
        b.id === dept.branch_id
          ? { ...b, departments_count: (b.departments_count || 0) + 1 }
          : b
      )
    );
    return { code: 1000, message: 'Tạo khoa chuyên môn thành công', data: newDept };
  }

  deleteDepartment(deptId: string) {
    // Chuyển department_id của các room về null (chờ phân khoa)
    this.rooms.update((prev) =>
      prev.map((r) => (r.department_id === deptId ? { ...r, department_id: null } : r))
    );
    this.departments.update((prev) => prev.filter((d) => d.id !== deptId));
    return { code: 1000, message: 'Xóa khoa thành công (Các phòng trực thuộc chuyển về trạng thái chờ phân khoa)' };
  }

  createRoom(room: Omit<Room, 'id'>) {
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`,
    };
    this.rooms.update((prev) => [...prev, newRoom]);
    return { code: 1000, message: 'Tạo phòng khám thành công', data: newRoom };
  }

  deleteRoom(roomId: string) {
    // Chặn xóa nếu có nhân sự đang phân công
    const hasStaff = this.staffs().some((s) => s.room_id === roomId);
    if (hasStaff) {
      return {
        code: 3105,
        error: 'Quy tắc an toàn: Không thể xóa Phòng khám đang có nhân viên phụ trách!',
      };
    }
    this.rooms.update((prev) => prev.filter((r) => r.id !== roomId));
    return { code: 1000, message: 'Xóa phòng khám thành công' };
  }

  // ==========================================
  // 4. Dynamic Form Builder (Slide 11)
  // ==========================================
  getTemplatesList() {
    return this.templates();
  }

  // API tmpl03: Xuất trọn vẹn cây lồng nhau (Template -> Sections -> Questions -> Options)
  getTemplateTree(templateId: string): FormTemplate | undefined {
    return this.templates().find((t) => t.id === templateId);
  }

  createTemplate(template: Omit<FormTemplate, 'id' | 'created_at' | 'sections'>) {
    const newTmpl: FormTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`,
      created_at: new Date().toISOString(),
      sections: [],
    };
    this.templates.update((prev) => [...prev, newTmpl]);
    return { code: 1000, message: 'Tạo mẫu phiếu thành công', data: newTmpl };
  }

  deleteTemplate(templateId: string) {
    // Chặn xóa nếu template đã gắn vào hồ sơ bệnh án
    const isUsedInRecord = this.records().some((r) => r.template_id === templateId);
    if (isUsedInRecord) {
      return {
        code: 4002,
        error: 'Không thể xóa mẫu phiếu đã được liên kết với hồ sơ bệnh án!',
      };
    }
    this.templates.update((prev) => prev.filter((t) => t.id !== templateId));
    return { code: 1000, message: 'Xóa mẫu phiếu thành công' };
  }

  addSectionToTemplate(templateId: string, section: Omit<FormSection, 'id' | 'template_id' | 'questions'>) {
    const newSection: FormSection = {
      ...section,
      id: `sec-${Date.now()}`,
      template_id: templateId,
      questions: [],
    };
    this.templates.update((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? { ...t, sections: [...(t.sections || []), newSection] }
          : t
      )
    );
    return { code: 1000, message: 'Thêm mục phiếu khám thành công', data: newSection };
  }

  deleteSection(templateId: string, sectionId: string) {
    // CASCADE: Xóa section xóa sạch toàn bộ câu hỏi bên trong
    this.templates.update((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? { ...t, sections: (t.sections || []).filter((s) => s.id !== sectionId) }
          : t
      )
    );
    return { code: 1000, message: 'Xóa mục thành công (CASCADE câu hỏi)' };
  }

  addQuestionToSection(templateId: string, sectionId: string, question: Omit<FormQuestion, 'id' | 'section_id'>) {
    const newQues: FormQuestion = {
      ...question,
      id: `q-${Date.now()}`,
      section_id: sectionId,
    };
    this.templates.update((prev) =>
      prev.map((t) => {
        if (t.id !== templateId) return t;
        return {
          ...t,
          sections: (t.sections || []).map((s) =>
            s.id === sectionId
              ? { ...s, questions: [...s.questions, newQues] }
              : s
          ),
        };
      })
    );
    return { code: 1000, message: 'Thêm câu hỏi thành công', data: newQues };
  }

  deleteQuestion(templateId: string, sectionId: string, questionId: string) {
    this.templates.update((prev) =>
      prev.map((t) => {
        if (t.id !== templateId) return t;
        return {
          ...t,
          sections: (t.sections || []).map((s) =>
            s.id === sectionId
              ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
              : s
          ),
        };
      })
    );
    return { code: 1000, message: 'Xóa câu hỏi thành công' };
  }

  // ==========================================
  // 5. Hồ sơ Bệnh án & Phân hệ Bác sĩ (Slide 5, 7)
  // ==========================================
  getRecordsByStatus(status?: MedicalRecordStatus) {
    if (!status) return this.records();
    return this.records().filter((r) => r.status === status);
  }

  getRecordDetails(id: string) {
    return this.records().find((r) => r.id === id);
  }

  assignDoctorToRecord(recordId: string, doctorId: string, doctorName: string) {
    this.records.update((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              assigned_doctor_id: doctorId,
              assigned_doctor_name: doctorName,
              status: 'in_progress' as MedicalRecordStatus,
            }
          : r
      )
    );
    return { code: 1000, message: 'Bác sĩ đã tiếp nhận ca khám' };
  }

  saveRecordAnswers(recordId: string, answers: Record<string, any>) {
    this.records.update((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, answers: { ...r.answers, ...answers } } : r))
    );
    return { code: 1000, message: 'Đã lưu câu trả lời bệnh án' };
  }

  completeMedicalRecord(recordId: string, diagnosis: string, instructions: string) {
    this.records.update((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              diagnosis,
              instructions,
              status: 'completed' as MedicalRecordStatus,
              completed_at: new Date().toISOString(),
            }
          : r
      )
    );
    return { code: 1000, message: 'Chốt hoàn thành bệnh án thành công' };
  }

  createPrescription(prescription: Omit<Prescription, 'id' | 'created_at'>) {
    const newRx: Prescription = {
      ...prescription,
      id: `rx-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.prescriptions.update((prev) => [newRx, ...prev]);
    return { code: 1000, message: 'Kê đơn thuốc thành công', data: newRx };
  }

  getPrescriptionByRecord(recordId: string) {
    return this.prescriptions().find((p) => p.medical_record_id === recordId);
  }

  createLabRequest(req: Omit<LabRequest, 'id' | 'created_at'>) {
    const newLab: LabRequest = {
      ...req,
      id: `lab-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.labRequests.update((prev) => [newLab, ...prev]);
    return { code: 1000, message: 'Tạo phiếu chỉ định cận lâm sàng thành công', data: newLab };
  }

  getLabRequestByRecord(recordId: string) {
    return this.labRequests().find((l) => l.medical_record_id === recordId);
  }

  // ==========================================
  // 6. Phân hệ Bệnh nhân: UAS7 & Tổn thương (Slide 6, 9)
  // ==========================================
  getUAS7ScoresForPatient(patientId: string) {
    return this.uas7Scores().filter((u) => u.patient_id === patientId);
  }

  createUAS7Score(score: Omit<UAS7DailyScore, 'id' | 'daily_score'>) {
    // Kiểm tra ràng buộc UNIQUE(patient_id, score_date) ngăn trùng ngày (Mã 5002)
    const existsToday = this.uas7Scores().some(
      (s) => s.patient_id === score.patient_id && s.score_date === score.score_date
    );
    if (existsToday) {
      return {
        code: 5002,
        error: 'Bạn đã ghi nhận điểm UAS7 cho ngày hôm nay rồi!',
      };
    }

    const iss7 = Number(score.iss7);
    const hss7 = Number(score.hss7);
    const daily_score = iss7 + hss7;

    const newScore: UAS7DailyScore = {
      ...score,
      id: `uas-${Date.now()}`,
      iss7,
      hss7,
      daily_score,
    };
    this.uas7Scores.update((prev) => [...prev, newScore]);
    return { code: 1000, message: 'Ghi nhận điểm UAS7 thành công', data: newScore };
  }

  getLesionEpisodes(patientId?: string) {
    if (!patientId) return this.lesionEpisodes();
    return this.lesionEpisodes().filter((e) => e.patient_id === patientId);
  }

  addLesionEpisode(episode: Omit<LesionEpisode, 'id'>) {
    const newEp: LesionEpisode = {
      ...episode,
      id: `ep-${Date.now()}`,
    };
    this.lesionEpisodes.update((prev) => [newEp, ...prev]);
    return { code: 1000, message: 'Ghi nhận đợt bùng phát mề đay thành công', data: newEp };
  }

  // ==========================================
  // 7. Thông báo hệ thống (Slide 10)
  // ==========================================
  markNotificationAsRead(id: string) {
    this.notifications.update((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  deleteNotification(id: string) {
    this.notifications.update((prev) => prev.filter((n) => n.id !== id));
  }
}
