import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../../../../api/services/doctor/doctor-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MedicalRecordDto, MedicalRecordStatus } from '../../../../../api/types';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-waiting-queue',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './waiting-queue.component.html',
})
export class WaitingQueueComponent implements OnInit {
  private doctorApi = inject(DoctorApiService);
  auth = inject(AuthService);

  activeFilter: 'all' | MedicalRecordStatus = 'all';
  records = signal<MedicalRecordDto[]>([]);
  isLoading = signal(true);
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  searchTerm = '';
  showCreatePatientModal = false;

  newPatient = {
    full_name: '',
    phone: '',
    password: 'Patient@123',
    gender: 'female' as 'male' | 'female' | 'other',
    year_of_birth: 1995,
  };

  ngOnInit() {
    this.loadQueue();
  }

  loadQueue() {
    this.isLoading.set(true);
    this.doctorApi.getQueue(this.activeFilter).subscribe({
      next: (list) => {
        this.records.set(list || []);
        this.isLoading.set(false);
      },
      error: (err: AppError) => {
        this.records.set([]);
        this.isLoading.set(false);
        this.showAlert(err.message, 'error');
      },
    });
  }

  setFilter(filter: 'all' | MedicalRecordStatus) {
    this.activeFilter = filter;
    this.loadQueue();
  }

  filteredRecords(): MedicalRecordDto[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.records().filter((r) => {
      const matchFilter = this.activeFilter === 'all' || r.status === this.activeFilter;
      if (!term) return matchFilter;
      const matchSearch =
        (r.patient_name && r.patient_name.toLowerCase().includes(term)) ||
        (r.patient_phone && r.patient_phone.includes(term)) ||
        String(r.medical_record_id).includes(term);
      return matchFilter && matchSearch;
    });
  }

  showAlert(text: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleAcceptRecord(rec: MedicalRecordDto) {
    this.doctorApi.acceptRecord(rec.medical_record_id).subscribe({
      next: () => {
        this.showAlert(`Đã tiếp nhận ca khám BA-2026-${rec.medical_record_id} thành công!`, 'success');
        this.loadQueue();
      },
      error: (err: AppError) => {
        this.showAlert(err.message, 'error');
      },
    });
  }

  handleCreatePatient() {
    if (!this.newPatient.full_name || !this.newPatient.phone) {
      this.showAlert('Vui lòng điền họ tên và số điện thoại bệnh nhân!', 'error');
      return;
    }
    this.doctorApi.createPatient(this.newPatient).subscribe({
      next: (res) => {
        this.showCreatePatientModal = false;
        this.showAlert(`Đã tạo hồ sơ bệnh nhân ${res.full_name} thành công!`, 'success');
        this.newPatient = { full_name: '', phone: '', password: 'Patient@123', gender: 'female', year_of_birth: 1995 };
        this.loadQueue();
      },
      error: (err: AppError) => {
        this.showAlert(err.message, 'error');
      },
    });
  }
}
