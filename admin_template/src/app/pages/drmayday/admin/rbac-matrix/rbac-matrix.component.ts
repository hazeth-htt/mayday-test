import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../../../api/services/admin/admin-api.service';
import { PermissionDto, RoleDto } from '../../../../../api/types/admin.types';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-rbac-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rbac-matrix.component.html',
})
export class RbacMatrixComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  roles: RoleDto[] = [];
  permissions: PermissionDto[] = [];
  assignedPermIds: Set<number> = new Set();
  selectedRole: RoleDto | null = null;
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  isLoading = false;

  // New role model
  showCreateRoleModal = false;
  newRole = {
    name: '',
    parent_role_id: null as number | null,
    description: '',
  };

  ngOnInit() {
    this.loadRolesAndPermissions();
  }

  loadRolesAndPermissions() {
    this.isLoading = true;
    this.adminApi.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.selectedRole = roles[0] || null;
        this.adminApi.getPermissions().subscribe({
          next: (perms) => {
            this.permissions = perms;
            if (this.selectedRole) {
              this.loadRolePermissions(this.selectedRole.id);
            } else {
              this.isLoading = false;
            }
          },
          error: () => (this.isLoading = false),
        });
      },
      error: () => (this.isLoading = false),
    });
  }

  loadRolePermissions(roleId: number) {
    this.adminApi.getRolePermissions(roleId).subscribe({
      next: (rp) => {
        this.assignedPermIds = new Set(rp.map((p) => p.permission_id));
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  showAlert(text: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  selectRole(role: RoleDto) {
    this.selectedRole = role;
    this.loadRolePermissions(role.id);
  }

  isPermissionChecked(permId: number): boolean {
    return this.assignedPermIds.has(permId);
  }

  togglePermission(permId: number) {
    if (!this.selectedRole) return;
    const nextIds = new Set(this.assignedPermIds);
    if (nextIds.has(permId)) {
      nextIds.delete(permId);
    } else {
      nextIds.add(permId);
    }

    const payload = Array.from(nextIds);
    this.adminApi.assignRolePermissions(this.selectedRole.id, payload).subscribe({
      next: () => {
        this.assignedPermIds = nextIds;
        this.showAlert('Đã cập nhật quyền hạn vai trò thành công!', 'success');
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  handleCreateRole() {
    if (!this.newRole.name) {
      this.showAlert('Vui lòng nhập tên vai trò!', 'error');
      return;
    }

    this.adminApi.createRole(this.newRole).subscribe({
      next: (role) => {
        this.roles.push(role);
        this.selectRole(role);
        this.newRole = { name: '', parent_role_id: null, description: '' };
        this.showCreateRoleModal = false;
        this.showAlert('Đã tạo vai trò mới thành công!', 'success');
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }
}
