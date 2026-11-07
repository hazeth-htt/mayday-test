import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../../../api/services/admin/admin-api.service';
import { BranchDto, DepartmentDto, RoomDto } from '../../../../../api/types/admin.types';
import { AuthUserInfo } from '../../../../../api/types/auth.types';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-user-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-staff.component.html',
})
export class UserStaffComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  activeRoleFilter: 'all' | 'doctor' | 'patient' | 'admin' = 'all';
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  isLoading = false;

  users: AuthUserInfo[] = [];
  branches: BranchDto[] = [];
  departments: DepartmentDto[] = [];
  rooms: RoomDto[] = [];

  // New user model
  showCreateModal = false;
  newUser = {
    full_name: '',
    phone: '',
    password: '',
    role_id: 2, // default doctor
    gender: 'male' as const,
  };

  // Assign staff model
  showAssignModal = false;
  assignForm = {
    staff_id: 2,
    branch_id: 1,
    department_id: 1,
    room_id: 1,
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.adminApi.getUsers().subscribe({
      next: (u) => {
        this.users = u;
        this.adminApi.getBranches().subscribe({
          next: (b) => {
            this.branches = b;
            this.adminApi.getDepartments().subscribe({
              next: (d) => {
                this.departments = d;
                this.adminApi.getRooms().subscribe({
                  next: (r) => {
                    this.rooms = r;
                    this.isLoading = false;
                  },
                  error: () => (this.isLoading = false),
                });
              },
              error: () => (this.isLoading = false),
            });
          },
          error: () => (this.isLoading = false),
        });
      },
      error: () => (this.isLoading = false),
    });
  }

  filteredUsers(): AuthUserInfo[] {
    if (this.activeRoleFilter === 'all') return this.users;
    const roleIdMap: Record<string, number> = { admin: 1, doctor: 2, patient: 3 };
    const targetRoleId = roleIdMap[this.activeRoleFilter];
    return this.users.filter((u) => Number(u.role_id) === targetRoleId);
  }

  doctors(): AuthUserInfo[] {
    return this.users.filter((u) => Number(u.role_id) === 2);
  }

  showAlert(text: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleCreateUser() {
    if (!this.newUser.full_name || !this.newUser.phone || !this.newUser.password) {
      this.showAlert('Vui lòng điền họ tên, số điện thoại và mật khẩu!', 'error');
      return;
    }

    if (this.newUser.role_id === 2) {
      // Create Staff
      this.adminApi
        .createStaff({
          full_name: this.newUser.full_name,
          phone: this.newUser.phone,
          password: this.newUser.password,
          role_id: 2,
          branch_id: this.branches[0]?.id || 1,
          department_id: this.departments[0]?.id || 1,
          room_id: this.rooms[0]?.id || 1,
        })
        .subscribe({
          next: () => {
            this.showAlert('Đã tạo tài khoản nhân sự y tế thành công!', 'success');
            this.showCreateModal = false;
            this.newUser = { full_name: '', phone: '', password: '', role_id: 2, gender: 'male' };
            this.loadData();
          },
          error: (err: AppError) => this.showAlert(err.message, 'error'),
        });
    } else {
      // Create User
      this.adminApi
        .createUser({
          full_name: this.newUser.full_name,
          phone: this.newUser.phone,
          password: this.newUser.password,
          gender: this.newUser.gender,
        })
        .subscribe({
          next: () => {
            this.showAlert('Đã tạo tài khoản người dùng thành công!', 'success');
            this.showCreateModal = false;
            this.newUser = { full_name: '', phone: '', password: '', role_id: 2, gender: 'male' };
            this.loadData();
          },
          error: (err: AppError) => this.showAlert(err.message, 'error'),
        });
    }
  }

  openAssignModal(staffId: number | string) {
    this.assignForm = {
      staff_id: Number(staffId),
      branch_id: this.branches[0]?.id || 1,
      department_id: this.departments[0]?.id || 1,
      room_id: this.rooms[0]?.id || 1,
    };
    this.showAssignModal = true;
  }

  handleSaveAssign() {
    this.adminApi
      .assignStaff(this.assignForm.staff_id, {
        branch_id: Number(this.assignForm.branch_id),
        department_id: Number(this.assignForm.department_id),
        room_id: Number(this.assignForm.room_id),
      })
      .subscribe({
        next: () => {
          this.showAssignModal = false;
          this.showAlert('Đã phân công nhân sự công tác thành công!', 'success');
          this.loadData();
        },
        error: (err: AppError) => this.showAlert(err.message, 'error'),
      });
  }

  getBranchName(id?: number | null) {
    return this.branches.find((b) => b.id === id)?.name || 'Cơ sở TW (Hà Nội)';
  }

  getDeptName(id?: number | null) {
    return this.departments.find((d) => d.id === id)?.name || 'Khoa Dị ứng Miễn dịch';
  }

  getRoomName(id?: number | null) {
    return this.rooms.find((r) => r.id === id)?.name || 'Phòng khám 301';
  }

  getRoleBadge(roleId: number | string): { label: string; class: string } {
    switch (Number(roleId)) {
      case 1:
        return { label: 'Quản trị viên', class: 'base-tag-neutral' };
      case 2:
        return { label: 'Bác sĩ lâm sàng', class: 'base-tag-info' };
      case 3:
        return { label: 'Người bệnh', class: 'base-tag-positive' };
      default:
        return { label: 'Người dùng', class: 'base-tag-neutral' };
    }
  }
}
