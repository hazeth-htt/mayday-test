import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { internalDevGuard } from './core/guards/internal-dev.guard';

// Auth
import { LoginComponent } from './pages/auth/login/login.component';

// DrMayDay - Admin
import { AdminDashboardComponent } from './pages/drmayday/admin/admin-dashboard/admin-dashboard.component';
import { TopologyComponent } from './pages/drmayday/admin/topology/topology.component';
import { UserStaffComponent } from './pages/drmayday/admin/user-staff/user-staff.component';
import { RbacMatrixComponent } from './pages/drmayday/admin/rbac-matrix/rbac-matrix.component';
import { FormBuilderComponent } from './pages/drmayday/admin/form-builder/form-builder.component';

// DrMayDay - Doctor
import { WaitingQueueComponent } from './pages/drmayday/doctor/waiting-queue/waiting-queue.component';
import { ConsultationComponent } from './pages/drmayday/doctor/consultation/consultation.component';

// DrMayDay - Patient
import { PatientHomeComponent } from './pages/drmayday/patient/patient-home/patient-home.component';
import { EmergencyScreeningComponent } from './pages/drmayday/patient/emergency-screening/emergency-screening.component';
import { DynamicIntakeComponent } from './pages/drmayday/patient/dynamic-intake/dynamic-intake.component';
import { Uas7ScoringComponent } from './pages/drmayday/patient/uas7-scoring/uas7-scoring.component';
import { LesionTrackerComponent } from './pages/drmayday/patient/lesion-tracker/lesion-tracker.component';
import { PatientProfileComponent } from './pages/drmayday/patient/patient-profile/patient-profile.component';

// Internal Dev & Design System (Isolated from End-Users)
import { DesignSystemShowcaseComponent } from './pages/design-system/design-system-showcase/design-system-showcase.component';

// 404
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';

export const routes: Routes = [
  // Login page - no guard
  {
    path: 'login',
    component: LoginComponent,
    title: 'Đăng Nhập | DrMayDay',
  },

  // Root redirect
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Admin routes
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Bảng Điều Khiển Quản Trị | DrMayDay',
      },
      {
        path: 'admin/topology',
        component: TopologyComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Cơ sở & Hạ tầng | DrMayDay',
      },
      {
        path: 'admin/users',
        component: UserStaffComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Quản lý Nhân sự | DrMayDay',
      },
      {
        path: 'admin/rbac',
        component: RbacMatrixComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Vai trò & Phân quyền | DrMayDay',
      },
      {
        path: 'admin/form-builder',
        component: FormBuilderComponent,
        canActivate: [authGuard],
        data: { role: 'admin' },
        title: 'Bộ tạo mẫu phiếu khám | DrMayDay',
      },

      // Doctor routes
      {
        path: 'doctor/queue',
        component: WaitingQueueComponent,
        canActivate: [authGuard],
        data: { role: 'doctor' },
        title: 'Hàng Đợi Ca Khám | DrMayDay',
      },
      {
        path: 'doctor/consultation/:id',
        component: ConsultationComponent,
        canActivate: [authGuard],
        data: { role: 'doctor' },
        title: 'Khám Lâm Sàng | DrMayDay',
      },

      // Patient routes
      {
        path: 'patient/home',
        component: PatientHomeComponent,
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Trang chủ Bệnh nhân | DrMayDay',
      },
      {
        path: 'patient/emergency',
        component: EmergencyScreeningComponent,
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Sàng Lọc Khẩn Cấp | DrMayDay',
      },
      {
        path: 'patient/screening',
        redirectTo: 'patient/emergency',
        pathMatch: 'full',
      },
      {
        path: 'patient/intake',
        component: DynamicIntakeComponent,
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Phiếu Khai Báo | DrMayDay',
      },
      {
        path: 'patient/uas7',
        component: Uas7ScoringComponent,
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Chấm Điểm UAS7 | DrMayDay',
      },
      {
        path: 'patient/lesions',
        component: LesionTrackerComponent,
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Nhật Ký Tổn Thương | DrMayDay',
      },
      {
        path: 'patient/profile',
        component: PatientProfileComponent,
        canActivate: [authGuard],
        data: { role: 'patient' },
        title: 'Hồ Sơ Y Tế | DrMayDay',
      },

      // Internal Dev & Design Hub (Role-Gated & Environment Protected)
      {
        path: 'internal/design-system',
        component: DesignSystemShowcaseComponent,
        canActivate: [internalDevGuard],
        title: 'Design System Hub (Nội Bộ) | DrMayDay',
      },
      {
        path: 'design-system',
        redirectTo: 'internal/design-system',
        pathMatch: 'full',
      },
    ],
  },

  // 404
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Không Tìm Thấy Trang | DrMayDay',
  },
];
