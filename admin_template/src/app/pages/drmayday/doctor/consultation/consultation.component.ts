import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import {
  LabRequest,
  MedicalRecord,
  Prescription,
  PrescriptionItem,
} from '../../../../core/models/drmayday.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgApexchartsModule],
  templateUrl: './consultation.component.html',
})
export class ConsultationComponent {
  route = inject(ActivatedRoute);
  drmayday = inject(DrMayDayService);

  recordId = '';
  record: MedicalRecord | undefined;
  prescription: Prescription | undefined;
  labRequest: LabRequest | undefined;

  activeTab: 'form' | 'uas7' | 'lesions' | 'rx' | 'lab' = 'form';
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // Complete record form
  diagnosisInput = '';
  instructionsInput = '';

  // New prescription item model (Slide 7: rx01)
  newRxItem: Omit<PrescriptionItem, 'id'> = {
    medication_name: '',
    active_ingredient: '',
    dosage: '',
    quantity: 10,
    unit: 'viên',
    instructions: '',
  };
  showAddRxItemModal = false;

  // UAS7 Chart
  uas7ChartOptions: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.recordId = params.get('id') || 'rec-001';
      this.loadRecordData();
    });
  }

  loadRecordData() {
    this.record = this.drmayday.getRecordDetails(this.recordId);
    if (this.record) {
      this.diagnosisInput = this.record.diagnosis || '';
      this.instructionsInput = this.record.instructions || '';
      this.prescription = this.drmayday.getPrescriptionByRecord(this.record.id);
      this.labRequest = this.drmayday.getLabRequestByRecord(this.record.id);

      // Setup UAS7 Chart for this patient
      const uasScores = this.drmayday.getUAS7ScoresForPatient(this.record.patient_id);
      this.uas7ChartOptions = {
        series: [
          {
            name: 'Điểm sẩn phù (0 - 3)',
            data: uasScores.map((s) => s.iss7),
            color: '#3b82f6',
          },
          {
            name: 'Điểm ngứa ngáy (0 - 3)',
            data: uasScores.map((s) => s.hss7),
            color: '#ec4899',
          },
          {
            name: 'Tổng điểm ngày (0 - 6)',
            data: uasScores.map((s) => s.daily_score),
            color: '#8b5cf6',
          },
        ],
        chart: {
          type: 'line',
          height: 320,
          fontFamily: 'Outfit, sans-serif',
          toolbar: { show: false },
        },
        stroke: { curve: 'smooth', width: [2, 2, 4] },
        xaxis: {
          categories: uasScores.map((s) => s.score_date),
          axisBorder: { show: false },
        },
        yaxis: {
          max: 6,
          min: 0,
          tickAmount: 6,
          title: { text: 'Thang điểm (0 - 6)' },
        },
        legend: { position: 'top' },
      };
    }
  }

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  // Slide 7: rx01 - Add medication item
  handleAddMedication() {
    if (!this.newRxItem.medication_name) {
      this.showAlert('Vui lòng nhập tên thuốc!', 'error');
      return;
    }
    if (!this.prescription) {
      const currentDoctor = this.drmayday.currentUser();
      const res = this.drmayday.createPrescription({
        medical_record_id: this.recordId,
        doctor_id: currentDoctor.id,
        diagnosis: this.diagnosisInput || 'Mày đay',
        items: [{ ...this.newRxItem, id: `rx-i-${Date.now()}` }],
      });
      this.prescription = res.data;
    } else {
      this.prescription.items.push({ ...this.newRxItem, id: `rx-i-${Date.now()}` });
    }
    this.newRxItem = { medication_name: '', active_ingredient: '', dosage: '', quantity: 10, unit: 'viên', instructions: '' };
    this.showAddRxItemModal = false;
    this.showAlert('Đã thêm thuốc vào đơn thành công!', 'success');
  }

  // Slide 5: medrec11 - Chốt hoàn tất ca khám
  handleCompleteConsultation() {
    if (!this.diagnosisInput) {
      this.showAlert('Vui lòng nhập Chẩn đoán xác định trước khi chốt bệnh án!', 'error');
      return;
    }
    const res = this.drmayday.completeMedicalRecord(
      this.recordId,
      this.diagnosisInput,
      this.instructionsInput
    );
    this.loadRecordData();
    this.showAlert(res.message, 'success');
  }

  getLesionPhotos() {
    const episodes = this.drmayday.getLesionEpisodes(this.record?.patient_id);
    return episodes[0]?.locations[0]?.photos || [];
  }
}
