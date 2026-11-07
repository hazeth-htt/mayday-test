import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { mockDb } from './mock-db';

export const mockHttpInterceptor: HttpInterceptorFn = (req, next) => {
  // If mock mode is disabled in environment, pass through to real network
  if (!environment.useMock) {
    return next(req);
  }

  const url = req.url;
  const method = req.method;

  // Only intercept /api/* requests
  if (!url.includes('/api/')) {
    return next(req);
  }

  const cleanPath = url.split('/api/')[1].split('?')[0];

  // Helper to return mock response envelope
  const jsonResponse = (data: unknown, code = '1000', message = 'OK', total?: number) => {
    return of(
      new HttpResponse({
        status: code === '1000' || code === '1001' ? 200 : 400,
        body: { code, message, data, total },
      })
    ).pipe(delay(250)); // simulate 250ms network delay
  };

  const errorResponse = (code: string, message: string, status = 400) => {
    return throwError(
      () =>
        new HttpErrorResponse({
          status,
          statusText: message,
          error: { code, message },
        })
    ).pipe(delay(250));
  };

  // 1. Auth: POST /api/auth/login
  if (cleanPath === 'auth/login' && method === 'POST') {
    const { phone, password } = (req.body as any) || {};
    const user = mockDb.users.find((u) => u.phone === phone && u.password === password);
    if (!user) {
      return errorResponse('3008', 'Số điện thoại hoặc mật khẩu không chính xác.');
    }
    const token = `mock-jwt-token-user-${user.user_id}-${Date.now()}`;
    return jsonResponse({
      token,
      user_info: {
        user_id: user.user_id,
        full_name: user.full_name,
        phone: user.phone,
        role_id: user.role_id,
        display_name: user.full_name,
      },
    });
  }

  // Auth: POST /api/auth/signup
  if (cleanPath === 'auth/signup' && method === 'POST') {
    const b = req.body as any;
    const exists = mockDb.users.some((u) => u.phone === b.phone);
    if (exists) {
      return errorResponse('3006', 'Số điện thoại này đã tồn tại trên hệ thống.');
    }
    const newUser = {
      user_id: mockDb.users.length + 1,
      full_name: b.full_name,
      phone: b.phone,
      password: b.password,
      gender: b.gender || 'other',
      role_id: 3, // patient
      is_active: 1,
      created_at: new Date().toISOString(),
    };
    mockDb.users.push(newUser);
    return jsonResponse(newUser, '1001', 'Tạo tài khoản thành công.');
  }

  // Auth: POST /api/auth/logout
  if (cleanPath === 'auth/logout' && method === 'POST') {
    return jsonResponse({});
  }

  // Profile: GET /api/users/info
  if (cleanPath === 'users/info' && method === 'GET') {
    const authHeader = req.headers.get('Authorization') || '';
    const userIdMatch = authHeader.match(/user-(\d+)/);
    const userId = userIdMatch ? parseInt(userIdMatch[1], 10) : 3;
    const user = mockDb.users.find((u) => u.user_id === userId) || mockDb.users[2];
    const { password: _, ...profile } = user;
    return jsonResponse(profile);
  }

  // Profile: PUT /api/users/info
  if (cleanPath === 'users/info' && method === 'PUT') {
    const b = req.body as any;
    const authHeader = req.headers.get('Authorization') || '';
    const userIdMatch = authHeader.match(/user-(\d+)/);
    const userId = userIdMatch ? parseInt(userIdMatch[1], 10) : 3;
    const user = mockDb.users.find((u) => u.user_id === userId);
    if (user) {
      Object.assign(user, b);
      const { password: _, ...profile } = user;
      return jsonResponse(profile, '1000', 'Cập nhật thông tin thành công.');
    }
    return errorResponse('3007', 'Không tìm thấy tài khoản người dùng.');
  }

  // 2. UAS7: GET /api/uas7scores/eligibility
  if (cleanPath === 'uas7scores/eligibility' && method === 'GET') {
    return jsonResponse({
      eligible: 'true',
      medical_record_id: 101,
    });
  }

  // UAS7: POST /api/uas7scores
  if (cleanPath === 'uas7scores' && method === 'POST') {
    const b = req.body as any;
    const existing = mockDb.uas7Scores.find(
      (s) => s.patient_id === 3 && s.score_date === b.score_date
    );
    if (existing) {
      return errorResponse('5002', 'Bạn đã ghi nhận điểm UAS7 cho ngày này rồi.');
    }
    const newScore = {
      patient_id: 3,
      medical_record_id: b.medical_record_id || 101,
      score_date: b.score_date,
      iss7: Number(b.iss7),
      hss7: Number(b.hss7),
      daily_score: Number(b.iss7) + Number(b.hss7),
      note: b.note || '',
      created_at: new Date().toISOString(),
    };
    mockDb.uas7Scores.push(newScore);
    return jsonResponse(mockDb.uas7Scores.filter((s) => s.patient_id === 3));
  }

  // UAS7: GET /api/uas7scores/week
  if (cleanPath === 'uas7scores/week' && method === 'GET') {
    const scores = mockDb.uas7Scores.filter((s) => s.patient_id === 3);
    const weekScores = scores.slice(-7);
    const total = weekScores.reduce((acc, cur) => acc + cur.daily_score, 0);
    let severity = 'Kiểm soát tốt';
    if (total > 27) severity = 'Nặng';
    else if (total > 15) severity = 'Vừa';
    else if (total > 6) severity = 'Nhẹ';

    return jsonResponse({
      patient_id: 3,
      week_score: total,
      severity_label: severity,
      completed_days: weekScores.length,
    });
  }

  // UAS7: GET /api/uas7scores/patient/{id}
  if (cleanPath.startsWith('uas7scores/patient/') && method === 'GET') {
    const pid = parseInt(cleanPath.split('/')[2], 10) || 3;
    const scores = mockDb.uas7Scores.filter((s) => s.patient_id === pid);
    return jsonResponse(scores);
  }

  // 3. Medical Records: GET /api/medicalrecords/classifyquestions
  if (cleanPath === 'medicalrecords/classifyquestions' && method === 'GET') {
    return jsonResponse(mockDb.classifyQuestions);
  }

  // Medical Records: POST /api/medicalrecords/classify
  if (cleanPath === 'medicalrecords/classify' && method === 'POST') {
    return jsonResponse({
      template_id: 'TMPL_MAY_DAY_MAN',
      template_name: 'Mẫu Khám Mày Đay Mạn Tính (CSU v2.0)',
    });
  }

  // Medical Records: POST /api/medicalrecords/selfcreate
  if (cleanPath === 'medicalrecords/selfcreate' && method === 'POST') {
    const b = req.body as any;
    const newRecord = {
      medical_record_id: mockDb.records.length + 101,
      patient_id: 3,
      assigned_doctor_id: null,
      template_id: b.template_id || 'TMPL_MAY_DAY_MAN',
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      patient_name: 'Nguyễn Thị Mai',
      patient_phone: '0988776655',
      patient_gender: 'female',
    };
    mockDb.records.push(newRecord);
    return jsonResponse(newRecord, '1001', 'Tạo hồ sơ bệnh án thành công.');
  }

  // Medical Records: GET /api/medicalrecords
  if (cleanPath === 'medicalrecords' && method === 'GET') {
    return jsonResponse(mockDb.records, '1000', 'OK', mockDb.records.length);
  }

  // Medical Records: GET /api/medicalrecords/{id}
  if (cleanPath.startsWith('medicalrecords/') && method === 'GET' && !cleanPath.includes('/')) {
    const id = parseInt(cleanPath.split('/')[1], 10);
    const rec = mockDb.records.find((r) => r.medical_record_id === id) || mockDb.records[0];
    return jsonResponse(rec);
  }

  // Medical Records: POST /api/medicalrecords/{id}/accept
  if (cleanPath.endsWith('/accept') && method === 'POST') {
    const id = parseInt(cleanPath.split('/')[1], 10);
    const rec = mockDb.records.find((r) => r.medical_record_id === id);
    if (rec) {
      rec.assigned_doctor_id = 2;
      rec.status = 'in_progress';
      return jsonResponse(rec, '1000', 'Tiếp nhận ca khám thành công.');
    }
    return errorResponse('4001', 'Không tìm thấy hồ sơ bệnh án.');
  }

  // Medical Records: PUT /api/medicalrecords/{id}
  if (cleanPath.startsWith('medicalrecords/') && method === 'PUT') {
    const id = parseInt(cleanPath.split('/')[1], 10);
    const b = req.body as any;
    const rec = mockDb.records.find((r) => r.medical_record_id === id);
    if (rec) {
      if (b.status) rec.status = b.status;
      return jsonResponse(rec, '1000', 'Cập nhật hồ sơ bệnh án thành công.');
    }
    return errorResponse('4001', 'Không tìm thấy hồ sơ bệnh án.');
  }

  // 4. Prescriptions: POST /api/prescriptions
  if (cleanPath === 'prescriptions' && method === 'POST') {
    const b = req.body as any;
    const newRx = {
      prescription_id: `rx-${Date.now()}`,
      medical_record_id: b.medical_record_id,
      created_by: 2,
      note: b.note || '',
      items: (b.items || []).map((it: any, idx: number) => ({
        ...it,
        prescription_item_id: `rx-item-${Date.now()}-${idx}`,
        created_at: new Date().toISOString(),
      })),
      created_at: new Date().toISOString(),
    };
    mockDb.prescriptions.push(newRx);
    return jsonResponse(newRx, '1001', 'Kê đơn thuốc thành công.');
  }

  // Lab Requests: POST /api/lab_requests
  if (cleanPath === 'lab_requests' && method === 'POST') {
    const b = req.body as any;
    const newLab = {
      id: `lab-${Date.now()}`,
      medical_record_id: b.medical_record_id,
      requested_by: 2,
      status: 'pending' as const,
      note: b.note || '',
      items: (b.items || []).map((it: any, idx: number) => ({
        ...it,
        id: `lab-item-${Date.now()}-${idx}`,
        created_at: new Date().toISOString(),
      })),
      created_at: new Date().toISOString(),
    };
    mockDb.labRequests.push(newLab);
    return jsonResponse(newLab, '1001', 'Tạo yêu cầu xét nghiệm thành công.');
  }

  // Lab Requests: GET /api/lab_requests/{record_id}
  if (cleanPath.startsWith('lab_requests/') && method === 'GET') {
    const rid = parseInt(cleanPath.split('/')[1], 10) || 101;
    const labs = mockDb.labRequests.filter((l) => l.medical_record_id === rid);
    return jsonResponse(labs);
  }

  // 5. Topology: Branches
  if (cleanPath === 'branches' && method === 'GET') {
    return jsonResponse(mockDb.branches);
  }
  if (cleanPath === 'branches' && method === 'POST') {
    const b = req.body as any;
    const nb = { id: mockDb.branches.length + 1, ...b, is_active: 1 };
    mockDb.branches.push(nb);
    return jsonResponse(nb, '1001', 'Tạo chi nhánh thành công.');
  }
  if (cleanPath.startsWith('branches/') && method === 'DELETE') {
    const id = parseInt(cleanPath.split('/')[1], 10);
    mockDb.branches = mockDb.branches.filter((item) => item.id !== id);
    return jsonResponse({}, '1000', 'Xóa chi nhánh thành công.');
  }

  // Departments
  if (cleanPath === 'departments' && method === 'GET') {
    return jsonResponse(mockDb.departments);
  }
  if (cleanPath === 'departments' && method === 'POST') {
    const b = req.body as any;
    const nd = { id: mockDb.departments.length + 1, ...b };
    mockDb.departments.push(nd);
    return jsonResponse(nd, '1001', 'Tạo khoa phòng thành công.');
  }
  if (cleanPath.startsWith('departments/') && method === 'DELETE') {
    const id = parseInt(cleanPath.split('/')[1], 10);
    mockDb.departments = mockDb.departments.filter((item) => item.id !== id);
    return jsonResponse({}, '1000', 'Xóa khoa phòng thành công.');
  }

  // Rooms
  if (cleanPath === 'rooms' && method === 'GET') {
    return jsonResponse(mockDb.rooms);
  }
  if (cleanPath === 'rooms' && method === 'POST') {
    const b = req.body as any;
    const nr = { id: mockDb.rooms.length + 1, ...b };
    mockDb.rooms.push(nr);
    return jsonResponse(nr, '1001', 'Tạo phòng khám thành công.');
  }
  if (cleanPath.startsWith('rooms/') && method === 'DELETE') {
    const id = parseInt(cleanPath.split('/')[1], 10);
    mockDb.rooms = mockDb.rooms.filter((item) => item.id !== id);
    return jsonResponse({}, '1000', 'Xóa phòng khám thành công.');
  }

  // Users: GET /api/users
  if (cleanPath === 'users' && method === 'GET') {
    const list = mockDb.users.map(({ password: _, ...u }) => u);
    return jsonResponse(list, '1000', 'OK', list.length);
  }

  // Roles: GET /api/roles
  if (cleanPath === 'roles' && method === 'GET') {
    return jsonResponse(mockDb.roles);
  }

  // Permissions: GET /api/permissions
  if (cleanPath === 'permissions' && method === 'GET') {
    return jsonResponse(mockDb.permissions);
  }

  // Templates: GET /api/templates
  if (cleanPath === 'templates' && method === 'GET') {
    return jsonResponse(mockDb.templates);
  }
  if (cleanPath.startsWith('templates/') && method === 'GET') {
    return jsonResponse(mockDb.templates[0]);
  }

  // Notifications: GET /api/notifications
  if (cleanPath === 'notifications' && method === 'GET') {
    return jsonResponse(mockDb.notifications);
  }
  if (cleanPath.endsWith('/read') && method === 'PUT') {
    const notiId = cleanPath.split('/')[1];
    const noti = mockDb.notifications.find((n) => n.id === notiId);
    if (noti) noti.is_read = '1';
    return jsonResponse(noti);
  }
  if (cleanPath === 'notifications/read_all' && method === 'PUT') {
    mockDb.notifications.forEach((n) => (n.is_read = '1'));
    return jsonResponse({});
  }

  // Default fallback for any other /api/* request
  return jsonResponse({}, '1000', 'Xử lý thành công.');
};
