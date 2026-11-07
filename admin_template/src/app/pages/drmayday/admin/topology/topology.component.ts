import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { Branch, Department, Room } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-topology',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topology.component.html',
})
export class TopologyComponent {
  drmayday = inject(DrMayDayService);

  activeTab: 'branches' | 'departments' | 'rooms' = 'branches';
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // New Branch Form Model
  newBranch = { code: '', name: '', address: '', phone: '', is_active: true };
  // New Department Form Model
  newDept = { branch_id: '', code: '', name: '', description: '', is_active: true };
  // New Room Form Model
  newRoom = { branch_id: '', department_id: '', code: '', name: '', room_type: 'consultation' as const, is_active: true };

  // Modals visibility
  showBranchModal = false;
  showDeptModal = false;
  showRoomModal = false;

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  // Branch Handlers
  handleAddBranch() {
    if (!this.newBranch.code || !this.newBranch.name) {
      this.showAlert('Vui lòng nhập đầy đủ mã và tên chi nhánh!', 'error');
      return;
    }
    this.drmayday.createBranch(this.newBranch);
    this.newBranch = { code: '', name: '', address: '', phone: '', is_active: true };
    this.showBranchModal = false;
    this.showAlert('Đã thêm Chi nhánh mới thành công!', 'success');
  }

  handleDeleteBranch(branchId: string) {
    if (!confirm('Bạn có chắc muốn xóa chi nhánh này?')) return;
    const res = this.drmayday.deleteBranch(branchId);
    if (res.error) {
      this.showAlert(res.error, 'error');
    } else {
      this.showAlert(res.message || '', 'success');
    }
  }

  // Department Handlers
  handleAddDept() {
    if (!this.newDept.branch_id || !this.newDept.code || !this.newDept.name) {
      this.showAlert('Vui lòng chọn chi nhánh và nhập đầy đủ thông tin khoa!', 'error');
      return;
    }
    this.drmayday.createDepartment(this.newDept);
    this.newDept = { branch_id: '', code: '', name: '', description: '', is_active: true };
    this.showDeptModal = false;
    this.showAlert('Đã thêm Khoa chuyên môn thành công!', 'success');
  }

  handleDeleteDept(deptId: string) {
    if (!confirm('Xóa khoa chuyên môn này sẽ chuyển các phòng khám trực thuộc về trạng thái chưa phân khoa. Bạn có chắc chắn muốn xóa?')) return;
    const res = this.drmayday.deleteDepartment(deptId);
    this.showAlert(res.message || '', 'success');
  }

  // Room Handlers
  handleAddRoom() {
    if (!this.newRoom.branch_id || !this.newRoom.code || !this.newRoom.name) {
      this.showAlert('Vui lòng chọn chi nhánh và nhập thông tin phòng!', 'error');
      return;
    }
    this.drmayday.createRoom({
      ...this.newRoom,
      department_id: this.newRoom.department_id || null,
      assigned_staff_id: null,
    });
    this.newRoom = { branch_id: '', department_id: '', code: '', name: '', room_type: 'consultation', is_active: true };
    this.showRoomModal = false;
    this.showAlert('Đã tạo phòng khám thành công!', 'success');
  }

  handleDeleteRoom(roomId: string) {
    if (!confirm('Bạn có chắc muốn xóa phòng khám này?')) return;
    const res = this.drmayday.deleteRoom(roomId);
    if (res.error) {
      this.showAlert(res.error, 'error');
    } else {
      this.showAlert(res.message || '', 'success');
    }
  }

  getBranchName(branchId: string) {
    return this.drmayday.branches().find((b) => b.id === branchId)?.name || 'N/A';
  }

  getDeptName(deptId?: string | null) {
    if (!deptId) return 'Chưa phân khoa';
    return this.drmayday.departments().find((d) => d.id === deptId)?.name || 'N/A';
  }
}
