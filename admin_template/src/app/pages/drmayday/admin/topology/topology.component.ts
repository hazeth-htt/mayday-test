import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../../../api/services/admin/admin-api.service';
import { BranchDto, DepartmentDto, RoomDto } from '../../../../../api/types/admin.types';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-topology',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topology.component.html',
})
export class TopologyComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  activeTab: 'branches' | 'departments' | 'rooms' = 'branches';
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  isLoading = false;

  branches: BranchDto[] = [];
  departments: DepartmentDto[] = [];
  rooms: RoomDto[] = [];

  // New Branch Form Model
  newBranch = { name: '', address: '', phone: '' };
  // New Department Form Model
  newDept = { branch_id: 1, name: '', description: '' };
  // New Room Form Model
  newRoom = { department_id: 1, name: '', description: '' };

  // Modals visibility
  showBranchModal = false;
  showDeptModal = false;
  showRoomModal = false;

  ngOnInit() {
    this.loadTopology();
  }

  loadTopology() {
    this.isLoading = true;
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
  }

  showAlert(text: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  // Branch Handlers
  handleAddBranch() {
    if (!this.newBranch.name) {
      this.showAlert('Vui lòng nhập tên chi nhánh!', 'error');
      return;
    }
    this.adminApi.createBranch(this.newBranch).subscribe({
      next: () => {
        this.newBranch = { name: '', address: '', phone: '' };
        this.showBranchModal = false;
        this.showAlert('Đã thêm Chi nhánh mới thành công!', 'success');
        this.loadTopology();
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  handleDeleteBranch(branchId: number) {
    if (!confirm('Bạn có chắc muốn xóa chi nhánh này?')) return;
    this.adminApi.deleteBranch(branchId).subscribe({
      next: () => {
        this.showAlert('Đã xóa chi nhánh thành công!', 'success');
        this.loadTopology();
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  // Department Handlers
  handleAddDept() {
    if (!this.newDept.branch_id || !this.newDept.name) {
      this.showAlert('Vui lòng chọn chi nhánh và nhập tên khoa!', 'error');
      return;
    }
    this.adminApi.createDepartment({
      branch_id: Number(this.newDept.branch_id),
      name: this.newDept.name,
      description: this.newDept.description,
    }).subscribe({
      next: () => {
        this.newDept = { branch_id: 1, name: '', description: '' };
        this.showDeptModal = false;
        this.showAlert('Đã thêm Khoa chuyên môn thành công!', 'success');
        this.loadTopology();
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  handleDeleteDept(deptId: number) {
    if (!confirm('Xóa khoa chuyên môn này sẽ chuyển các phòng khám trực thuộc về trạng thái chưa phân khoa. Bạn có chắc chắn muốn xóa?')) return;
    this.adminApi.deleteDepartment(deptId).subscribe({
      next: () => {
        this.showAlert('Đã xóa khoa chuyên môn thành công!', 'success');
        this.loadTopology();
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  // Room Handlers
  handleAddRoom() {
    if (!this.newRoom.department_id || !this.newRoom.name) {
      this.showAlert('Vui lòng chọn khoa và nhập tên phòng khám!', 'error');
      return;
    }
    this.adminApi.createRoom({
      department_id: Number(this.newRoom.department_id),
      name: this.newRoom.name,
      description: this.newRoom.description,
    }).subscribe({
      next: () => {
        this.newRoom = { department_id: 1, name: '', description: '' };
        this.showRoomModal = false;
        this.showAlert('Đã tạo phòng khám thành công!', 'success');
        this.loadTopology();
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  handleDeleteRoom(roomId: number) {
    if (!confirm('Bạn có chắc muốn xóa phòng khám này?')) return;
    this.adminApi.deleteRoom(roomId).subscribe({
      next: () => {
        this.showAlert('Đã xóa phòng khám thành công!', 'success');
        this.loadTopology();
      },
      error: (err: AppError) => this.showAlert(err.message, 'error'),
    });
  }

  getBranchName(branchId: number): string {
    return this.branches.find((b) => b.id === branchId)?.name || 'N/A';
  }

  getDeptName(deptId?: number | null): string {
    if (!deptId) return 'Chưa phân khoa';
    return this.departments.find((d) => d.id === deptId)?.name || 'N/A';
  }
}
