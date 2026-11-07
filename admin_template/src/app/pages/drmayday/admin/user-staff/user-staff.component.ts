import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { RoleType, User } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-user-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-staff.component.html',
})
export class UserStaffComponent {
  drmayday = inject(DrMayDayService);

  activeRoleFilter: 'all' | RoleType = 'all';
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // New user model
  showCreateModal = false;
  newUser = {
    full_name: '',
    phone_number: '',
    email: '',
    role: 'doctor' as RoleType,
    is_active: true,
  };

  // Assign staff model (Slide 3: admin06)
  showAssignModal = false;
  assignForm = {
    staff_id: '',
    branch_id: '',
    department_id: '',
    room_id: '',
  };

  filteredUsers() {
    if (this.activeRoleFilter === 'all') return this.drmayday.users();
    return this.drmayday.users().filter((u) => u.role === this.activeRoleFilter);
  }

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleCreateUser() {
    if (!this.newUser.full_name || !this.newUser.phone_number) {
      this.showAlert('Vui lòng điền họ tên và số điện thoại!', 'error');
      return;
    }
    const res = this.drmayday.createUser(this.newUser);
    this.newUser = { full_name: '', phone_number: '', email: '', role: 'doctor', is_active: true };
    this.showCreateModal = false;
    this.showAlert(res.message, 'success');
  }

  handleDeleteUser(userId: string) {
    if (!confirm('Lưu ý nghiệp vụ y tế: Xóa tài khoản người dùng này vẫn bảo toàn toàn bộ hồ sơ bệnh án liên quan. Bạn có chắc chắn muốn xóa?')) return;
    const res = this.drmayday.deleteUser(userId);
    this.showAlert(res.message, 'success');
  }

  openAssignModal(staffId: string) {
    const staff = this.drmayday.staffs().find((s) => s.id === staffId);
    this.assignForm = {
      staff_id: staffId,
      branch_id: staff?.branch_id || '',
      department_id: staff?.department_id || '',
      room_id: staff?.room_id || '',
    };
    this.showAssignModal = true;
  }

  handleSaveAssign() {
    const res = this.drmayday.assignUser(
      this.assignForm.staff_id,
      this.assignForm.branch_id,
      this.assignForm.department_id,
      this.assignForm.room_id
    );
    this.showAssignModal = false;
    this.showAlert(res.message, 'success');
  }

  getBranchName(id?: string) {
    return this.drmayday.branches().find((b) => b.id === id)?.name || 'Chưa gán';
  }

  getDeptName(id?: string) {
    return this.drmayday.departments().find((d) => d.id === id)?.name || 'Chưa gán';
  }

  getRoomName(id?: string) {
    return this.drmayday.rooms().find((r) => r.id === id)?.name || 'Chưa gán';
  }
}
