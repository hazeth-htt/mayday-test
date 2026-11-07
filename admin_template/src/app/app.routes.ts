import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { internalDevGuard } from './core/guards/internal-dev.guard';

export const routes: Routes = [
  // Login page - lazy loaded, public
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Đăng Nhập | DrMayDay',
  },

  // Register page - lazy loaded, public
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Đăng Ký Hồ Sơ Khám | DrMayDay',
  },
  {
    path: 'signup',
    redirectTo: 'register',
    pathMatch: 'full',
  },

  // Forgot password page - lazy loaded, public
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './pages/auth/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    title: 'Khôi Phục Mật Khẩu | DrMayDay',
  },
  {
    path: 'reset-password',
    redirectTo: 'forgot-password',
    pathMatch: 'full',
  },

  // Public Emergency Screening (Bước 0 - Sàng lọc phản vệ < 30s không cần đăng nhập)
  {
    path: 'emergency',
    loadComponent: () =>
      import(
        './pages/drmayday/patient/emergency-screening/emergency-screening.component'
      ).then((m) => m.EmergencyScreeningComponent),
    title: 'Sàng Lọc Báo Động Nguy Cấp (<30s) | DrMayDay',
  },
  {
    path: 'screening',
    redirectTo: 'emergency',
    pathMatch: 'full',
  },

  // 403 Forbidden page - lazy loaded
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./pages/other-page/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent
      ),
    title: 'Giới Hạn Quyền Truy Cập | DrMayDay',
  },

  // Root redirect
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Protected Role-Gated Application Layout
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // ================= Admin Routes =================
      {
        path: 'admin/dashboard',
        loadComponent: () =>
          import(
            './pages/drmayday/admin/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Bảng Điều Khiển Quản Trị | DrMayDay',
      },
      {
        path: 'admin/topology',
        loadComponent: () =>
          import('./pages/drmayday/admin/topology/topology.component').then(
            (m) => m.TopologyComponent
          ),
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Cơ Sở & Hạ Tầng Tổ Chức | DrMayDay',
      },
      {
        path: 'admin/users',
        loadComponent: () =>
          import('./pages/drmayday/admin/user-staff/user-staff.component').then(
            (m) => m.UserStaffComponent
          ),
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Danh Bạ Nhân Sự Y Tế | DrMayDay',
      },
      {
        path: 'admin/rbac',
        loadComponent: () =>
          import('./pages/drmayday/admin/rbac-matrix/rbac-matrix.component').then(
            (m) => m.RbacMatrixComponent
          ),
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Ma Trận Vai Trò & Phân Quyền | DrMayDay',
      },
      {
        path: 'admin/form-builder',
        loadComponent: () =>
          import(
            './pages/drmayday/admin/form-builder/form-builder.component'
          ).then((m) => m.FormBuilderComponent),
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Bộ Tạo Mẫu Phiếu Khám Lâm Sàng | DrMayDay',
      },

      // ================= Doctor Routes =================
      {
        path: 'doctor/queue',
        loadComponent: () =>
          import(
            './pages/drmayday/doctor/waiting-queue/waiting-queue.component'
          ).then((m) => m.WaitingQueueComponent),
        canActivate: [authGuard],
        data: { role: 'doctor' },
        title: 'Hàng Đợi Tiếp Nhận Ca Khám | DrMayDay',
      },
      {
        path: 'doctor/consultation/:id',
        loadComponent: () =>
          import(
            './pages/drmayday/doctor/consultation/consultation.component'
          ).then((m) => m.ConsultationComponent),
        canActivate: [authGuard],
        data: { role: 'doctor' },
        title: 'Hồ Sơ Bệnh Án Điện Tử | DrMayDay',
      },

      // ================= Patient Routes =================
      {
        path: 'patient/home',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/patient-home/patient-home.component'
          ).then((m) => m.PatientHomeComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Trang Chủ Bệnh Nhân | DrMayDay',
      },
      {
        path: 'patient/emergency',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/emergency-screening/emergency-screening.component'
          ).then((m) => m.EmergencyScreeningComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Sàng Lọc Báo Động Nguy Cấp | DrMayDay',
      },
      {
        path: 'patient/screening',
        redirectTo: 'patient/emergency',
        pathMatch: 'full',
      },
      {
        path: 'patient/intake',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/dynamic-intake/dynamic-intake.component'
          ).then((m) => m.DynamicIntakeComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Phiếu Khai Thác Bệnh Sử Ban Đầu | DrMayDay',
      },
      {
        path: 'patient/uas7',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/uas7-scoring/uas7-scoring.component'
          ).then((m) => m.Uas7ScoringComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Nhật Ký Theo Dõi Mày Đay (UAS7) | DrMayDay',
      },
      {
        path: 'patient/lesions',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/lesion-tracker/lesion-tracker.component'
          ).then((m) => m.LesionTrackerComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Nhật Ký Theo Dõi Tổn Thương Da | DrMayDay',
      },
      {
        path: 'patient/profile',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/patient-profile/patient-profile.component'
          ).then((m) => m.PatientProfileComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Hồ Sơ Y Tế & Định Danh Cá Nhân | DrMayDay',
      },
      {
        path: 'patient/records',
        loadComponent: () =>
          import(
            './pages/drmayday/patient/patient-records/patient-records.component'
          ).then((m) => m.PatientRecordsComponent),
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Lịch Sử Hồ Sơ Bệnh Án | DrMayDay',
      },

      // ================= Internal Dev & Design Hub =================
      {
        path: 'internal/design-system',
        loadComponent: () =>
          import(
            './pages/design-system/design-system-showcase/design-system-showcase.component'
          ).then((m) => m.DesignSystemShowcaseComponent),
        canActivate: [internalDevGuard],
        title: 'Quy Chuẩn Thiết Kế Uber Base (Nội Bộ) | DrMayDay',
      },
      {
        path: 'design-system',
        redirectTo: 'internal/design-system',
        pathMatch: 'full',
      },
    ],
  },

  // 404 Not Found
  {
    path: '**',
    loadComponent: () =>
      import('./pages/other-page/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Không Tìm Thấy Trang | DrMayDay',
  },
];
