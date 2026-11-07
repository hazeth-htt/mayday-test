import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { DoctorApiService } from '../../../../../api/services/doctor/doctor-api.service';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { toNumericId } from '../../../../../api/mappers/_base';
import {
  AnswerDto,
  LabRequestDto,
  MedicalRecordDetailDto,
  PrescriptionDto,
} from '../../../../../api/types';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgApexchartsModule],
  templateUrl: './consultation.component.html',
})
export class ConsultationComponent implements OnInit {
  route = inject(ActivatedRoute);
  drmayday = inject(DrMayDayService);
  auth = inject(AuthService);
  private doctorApi = inject(DoctorApiService);
  private patientApi = inject(PatientApiService);

  recordId = 101;
  record: MedicalRecordDetailDto | undefined;
  prescription: PrescriptionDto | undefined;
  labRequest: LabRequestDto | undefined;
  answers: AnswerDto[] = [];
  isLoading = true;

  activeTab: 'form' | 'uas7' | 'lesions' | 'rx' | 'lab' = 'form';
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // Complete record form
  diagnosisInput = '';
  instructionsInput = '';

  // New prescription item model
  newRxItem = {
    medicine_name: '',
    dosage: '180mg',
    frequency: '1 lần/ngày',
    duration: '14 ngày',
    instruction: 'Uống sau ăn',
  };
  showAddRxItemModal = false;
  uas7ChartOptions: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const rawId = params.get('id');
      this.recordId = toNumericId(rawId) || 101;
      this.loadRecordData();
    });
  }

  loadRecordData() {
    this.isLoading = true;
    this.doctorApi.getRecordDetail(this.recordId).subscribe({
      next: (rec) => {
        this.record = rec;
        this.diagnosisInput = rec.instructions || 'Mày đay mạn tính tự phát (CSU)';
        this.instructionsInput = rec.instructions || 'Uống thuốc đều đặn theo đơn, tái khám sau 2 tuần.';
        this.isLoading = false;
        this.loadSupportingData(rec.patient_id);
      },
      error: () => {
        // Fallback to mock
        this.record = {
          medical_record_id: this.recordId,
          patient_id: 3,
          assigned_doctor_id: 2,
          template_id: 'TMPL_MAY_DAY_MAN',
          status: 'in_progress',
          created_at: new Date().toISOString(),
          patient_name: 'Nguyễn Thị Mai',
          patient_phone: '0988776655',
          patient_gender: 'female',
        };
        this.isLoading = false;
        this.loadSupportingData(3);
      },
    });
  }

  private loadSupportingData(patientId: number) {
    this.doctorApi.getRecordAnswers(this.recordId).subscribe({
      next: (ans) => (this.answers = ans || []),
      error: () => (this.answers = []),
    });

    this.doctorApi.getLabResults(this.recordId).subscribe({
      next: (labs) => {
        if (labs && labs.length) this.labRequest = labs[0];
      },
    });

    this.patientApi.getUas7ScoresForPatient(patientId).subscribe({
      next: (scores) => this.renderUasChart(scores),
      error: () => this.renderUasChart([]),
    });
  }

  private renderUasChart(uasScores: any[]) {
    const list = uasScores.length ? uasScores : this.drmayday.getUAS7ScoresForPatient('3');
    this.uas7ChartOptions = {
      series: [
        {
          name: 'Điểm sẩn phù (0 - 3)',
          data: list.map((s) => s.iss7),
          color: '#3b82f6',
        },
        {
          name: 'Điểm ngứa ngáy (0 - 3)',
          data: list.map((s) => s.hss7),
          color: '#ec4899',
        },
        {
          name: 'Tổng điểm ngày (0 - 6)',
          data: list.map((s) => s.daily_score),
          color: '#8b5cf6',
        },
      ],
      chart: {
        type: 'line',
        height: 300,
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      stroke: { curve: 'smooth', width: [2, 2, 4] },
      xaxis: {
        categories: list.map((s) => s.score_date),
        axisBorder: { show: false },
      },
      yaxis: {
        max: 6,
        min: 0,
        tickAmount: 6,
      },
      legend: { position: 'top' },
    };
  }

  showAlert(text: string, type: 'success' | 'error' = 'success') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleAddMedication() {
    if (!this.newRxItem.medicine_name) {
      this.showAlert('Vui lòng nhập tên thuốc!', 'error');
      return;
    }

    const payload = {
      medical_record_id: this.recordId,
      note: 'Uống thuốc đúng giờ sau ăn.',
      items: [
        {
          medicine_name: this.newRxItem.medicine_name,
          dosage: this.newRxItem.dosage,
          frequency: this.newRxItem.frequency,
          duration: this.newRxItem.duration,
          instruction: this.newRxItem.instruction,
        },
      ],
    };

    this.doctorApi.createPrescription(payload).subscribe({
      next: (rx) => {
        this.prescription = rx;
        this.showAddRxItemModal = false;
        this.showAlert('Đã kê đơn thuốc thành công!', 'success');
        this.newRxItem = { medicine_name: '', dosage: '180mg', frequency: '1 lần/ngày', duration: '14 ngày', instruction: 'Uống sau ăn' };
      },
      error: (err: AppError) => {
        this.showAlert(err.message, 'error');
      },
    });
  }

  handleCompleteConsultation() {
    if (!this.diagnosisInput) {
      this.showAlert('Vui lòng nhập Chẩn đoán xác định trước khi chốt bệnh án!', 'error');
      return;
    }

    this.doctorApi
      .completeRecord(this.recordId, {
        status: 'completed',
        instructions: `${this.diagnosisInput}. ${this.instructionsInput}`,
      })
      .subscribe({
        next: (rec) => {
          this.record = rec;
          this.showAlert('Đã chốt hoàn tất ca khám và lưu hồ sơ bệnh án thành công!', 'success');
        },
        error: (err: AppError) => {
          this.showAlert(err.message, 'error');
        },
      });
  }

  getLesionPhotos() {
    const episodes = this.drmayday.getLesionEpisodes(String(this.record?.patient_id || '3'));
    return episodes[0]?.locations[0]?.photos || [];
  }
}
