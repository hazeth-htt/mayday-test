import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { UAS7DailyScore } from '../../../../core/models/drmayday.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-uas7-scoring',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './uas7-scoring.component.html',
})
export class Uas7ScoringComponent {
  drmayday = inject(DrMayDayService);

  today = new Date().toISOString().split('T')[0];
  selectedDate = this.today;
  iss7 = 1; // Điểm sẩn (0 - 3)
  hss7 = 2; // Điểm ngứa (0 - 3)
  notes = '';

  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  uas7ChartOptions: any;

  ngOnInit() {
    this.updateChart();
  }

  get dailyScore(): number {
    return Number(this.iss7) + Number(this.hss7);
  }

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleSubmitScore() {
    const currentPatient = this.drmayday.currentUser();
    const res = this.drmayday.createUAS7Score({
      patient_id: currentPatient.id,
      score_date: this.selectedDate,
      iss7: this.iss7,
      hss7: this.hss7,
      notes: this.notes,
    });

    if (res.error) {
      this.showAlert(res.error, 'error');
    } else {
      this.showAlert('Đã ghi nhận điểm UAS7 thành công!', 'success');
      this.notes = '';
      this.updateChart();
    }
  }

  updateChart() {
    const currentPatient = this.drmayday.currentUser();
    const scores = this.drmayday.getUAS7ScoresForPatient(currentPatient.id);

    this.uas7ChartOptions = {
      series: [
        {
          name: 'Điểm Sẩn Phù (0 - 3)',
          data: scores.map((s) => s.iss7),
          color: '#3b82f6',
        },
        {
          name: 'Điểm Ngứa Ngáy (0 - 3)',
          data: scores.map((s) => s.hss7),
          color: '#ec4899',
        },
        {
          name: 'Tổng Điểm Ngày (0 - 6)',
          data: scores.map((s) => s.daily_score),
          color: '#8b5cf6',
        },
      ],
      chart: {
        type: 'bar',
        height: 280,
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      xaxis: {
        categories: scores.map((s) => s.score_date),
      },
      yaxis: {
        max: 6,
        min: 0,
        tickAmount: 6,
      },
      legend: { position: 'top' },
    };
  }

  getHistoryScores() {
    const currentPatient = this.drmayday.currentUser();
    return this.drmayday.getUAS7ScoresForPatient(currentPatient.id).slice().reverse();
  }
}
