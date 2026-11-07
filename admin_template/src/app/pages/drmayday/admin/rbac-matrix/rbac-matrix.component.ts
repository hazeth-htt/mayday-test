import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { Permission, Role } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-rbac-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rbac-matrix.component.html',
})
export class RbacMatrixComponent {
  drmayday = inject(DrMayDayService);

  selectedRole: Role | null = null;
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // New role model
  showCreateRoleModal = false;
  newRole = {
    code: '',
    name: '',
    parent_role_id: null as string | null,
    description: '',
  };

  ngOnInit() {
    this.selectedRole = this.drmayday.roles()[0] || null;
  }

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  selectRole(role: Role) {
    this.selectedRole = role;
  }

  isPermissionChecked(permId: string): boolean {
    if (!this.selectedRole) return false;
    return !!this.selectedRole.permissions?.includes(permId);
  }

  togglePermission(permId: string) {
    if (!this.selectedRole) return;
    const current = this.selectedRole.permissions || [];
    let updated: string[];
    if (current.includes(permId)) {
      updated = current.filter((p) => p !== permId);
    } else {
      updated = [...current, permId];
    }
    this.selectedRole.permissions = updated;
    this.drmayday.updateRolePermissions(this.selectedRole.id, updated);
    this.showAlert('Đã cập nhật quyền hạn vai trò!', 'success');
  }

  handleCreateRole() {
    if (!this.newRole.code || !this.newRole.name) {
      this.showAlert('Vui lòng nhập mã và tên vai trò!', 'error');
      return;
    }
    const res = this.drmayday.createRole({
      ...this.newRole,
      permissions: [],
    });
    this.newRole = { code: '', name: '', parent_role_id: null, description: '' };
    this.showCreateRoleModal = false;
    this.showAlert(res.message, 'success');
  }

  getPermissionsByModule(module: 'ADMIN' | 'DOCTOR' | 'PATIENT') {
    return this.drmayday.permissions().filter((p) => p.module === module);
  }
}
