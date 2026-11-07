import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { MedicalRecord, MedicalRecordStatus } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-waiting-queue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './waiting-queue.component.html',
})
export class WaitingQueueComponent {
  drmayday = inject(DrMayDayService);

  activeFilter: 'all' | MedicalRecordStatus = 'pending';
  alertMessage: string | null = null;

  filteredRecords() {
    if (this.activeFilter === 'all') return this.drmayday.records();
    return this.drmayday.records().filter((r) => r.status === this.activeFilter);
  }

  showAlert(text: string) {
    this.alertMessage = text;
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  // Slide 5: medrec07 - Bác sĩ bấm nhận ca
  handleAcceptRecord(rec: MedicalRecord) {
    const currentDoctor = this.drmayday.currentUser();
    const res = this.drmayday.assignDoctorToRecord(
      rec.id,
      currentDoctor.id,
      currentDoctor.full_name
    );
    this.showAlert(`Đã tiếp nhận ca khám ${rec.record_code} cho ${currentDoctor.full_name}!`);
  }
}
