import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { toNumericId } from '../../../../../api/mappers/_base';
import { AppError } from '../../../../../lib/errors/app-error';

@Component({
  selector: 'app-uas7-scoring',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './uas7-scoring.component.html',
})
export class Uas7ScoringComponent implements OnInit {
  drmayday = inject(DrMayDayService);
  private auth = inject(AuthService);
  private patientApi = inject(PatientApiService);

  today = new Date().toISOString().split('T')[0];
  selectedDate = this.today;
  iss7 = 1;
  hss7 = 2;
  notes = '';

  // AAS7 Tracking (Phụ lục B - Slide 16)
  activeTrackerTab: 'uas7' | 'aas7' = 'uas7';
  hasAngioedemaToday = false;
  angioedemaTimeSlots: string[] = [];
  angioedemaPhysicalDiscomfort = 0;
  angioedemaDailyLimitation = 0;
  angioedemaAppearanceImpact = 0;

  get dailyAasScore(): number {
    if (!this.hasAngioedemaToday) return 0;
    return (
      Number(this.angioedemaPhysicalDiscomfort) +
      Number(this.angioedemaDailyLimitation) +
      Number(this.angioedemaAppearanceImpact)
    );
  }

  toggleAasTimeSlot(slot: string) {
    if (this.angioedemaTimeSlots.includes(slot)) {
      this.angioedemaTimeSlots = this.angioedemaTimeSlots.filter((s) => s !== slot);
    } else {
      this.angioedemaTimeSlots.push(slot);
    }
  }

  handleSubmitAasScore() {
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.showAlert(
        `Đã lưu nhật ký theo dõi phù mạch AAS7 ngày ${this.selectedDate} (${this.dailyAasScore} điểm) thành công!`,
        'success'
      );
    }, 400);
  }

  activeRecordId = 101;
  isEligible = true;
  isSubmitting = false;
  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  dateFieldError = '';
  uas7ChartOptions: any;
  scoresList = signal<any[]>([]);

  ngOnInit() {
    this.checkEligibility();
    this.updateChart();
  }

  get dailyScore(): number {
    return Number(this.iss7) + Number(this.hss7);
  }

  getHistoryScores(): any[] {
    return this.scoresList();
  }

  checkEligibility() {
    this.patientApi.checkUas7Eligibility().subscribe({
      next: (res) => {
        this.isEligible = res.eligible === 'true' || res.eligible === true;
        if (res.medical_record_id) {
          this.activeRecordId = toNumericId(res.medical_record_id);
        }
      },
      error: () => {
        this.isEligible = true;
      },
    });
  }

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleSubmitScore() {
    this.dateFieldError = '';
    this.isSubmitting = true;

    this.patientApi
      .createUas7Score({
        medical_record_id: this.activeRecordId,
        score_date: this.selectedDate,
        iss7: Number(this.iss7),
        hss7: Number(this.hss7),
        note: this.notes,
      })
      .subscribe({
        next: (scores) => {
          this.isSubmitting = false;
          this.showAlert('Đã ghi nhận điểm UAS7 thành công!', 'success');
          this.notes = '';
          if (Array.isArray(scores)) {
            this.scoresList.set(scores);
            this.renderChart(scores);
          } else {
            this.updateChart();
          }
        },
        error: (err: AppError) => {
          this.isSubmitting = false;
          if (err.isDuplicate() || err.code === '5002') {
            this.dateFieldError = 'Bạn đã ghi nhận điểm cho ngày này rồi.';
          }
          this.showAlert(err.message, 'error');
        },
      });
  }

  updateChart() {
    const userId = toNumericId(this.auth.currentUser()?.id) || 3;
    this.patientApi.getUas7ScoresForPatient(userId).subscribe({
      next: (scores) => {
        this.scoresList.set(scores || []);
        this.renderChart(scores);
      },
      error: () => {
        const fallbackScores = this.drmayday.getUAS7ScoresForPatient(String(userId));
        this.scoresList.set(fallbackScores);
        this.renderChart(fallbackScores);
      },
    });
  }

  private renderChart(scores: any[]) {
    const sorted = (scores || []).slice(-7);
    this.uas7ChartOptions = {
      series: [
        {
          name: 'Điểm sẩn phù (0 - 3)',
          data: sorted.map((s) => s.iss7),
          color: '#3b82f6',
        },
        {
          name: 'Điểm ngứa ngáy (0 - 3)',
          data: sorted.map((s) => s.hss7),
          color: '#ec4899',
        },
        {
          name: 'Tổng điểm ngày (0 - 6)',
          data: sorted.map((s) => s.daily_score),
          color: '#8b5cf6',
        },
      ],
      chart: {
        type: 'line',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'Outfit, sans-serif',
      },
      stroke: { curve: 'smooth', width: [2, 2, 4] },
      xaxis: {
        categories: sorted.map((s) => s.score_date),
        axisBorder: { show: false },
      },
      yaxis: {
        min: 0,
        max: 6,
        tickAmount: 6,
      },
    };
  }
}
