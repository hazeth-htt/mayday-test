import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DrMayDayService } from '../../../../core/services/drmayday.service';

@Component({
  selector: 'app-patient-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-home.component.html',
})
export class PatientHomeComponent {
  auth = inject(AuthService);
  drmayday = inject(DrMayDayService);

  patientId = 'u-pat-01'; // matches the demo patient

  scores = computed(() =>
    this.drmayday
      .getUAS7ScoresForPatient(this.patientId)
      .sort((a, b) => b.score_date.localeCompare(a.score_date))
  );

  todayDate = new Date().toISOString().split('T')[0];

  todayScore = computed(() =>
    this.scores().find((s) => s.score_date === this.todayDate)
  );

  last7Scores = computed(() => this.scores().slice(0, 7).reverse());

  recentRecord = computed(() => {
    const records = this.drmayday.records().filter(r => r.patient_id === this.patientId);
    return records.sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;
  });

  currentPrescription = computed(() => {
    const record = this.recentRecord();
    if (!record) return null;
    return this.drmayday.getPrescriptionByRecord(record.id) ?? null;
  });

  weeklyTotal = computed(() => {
    const s = this.last7Scores();
    if (!s.length) return null;
    return s.reduce((acc, cur) => acc + cur.daily_score, 0);
  });

  weeklyAvg = computed(() => {
    const s = this.last7Scores();
    if (!s.length) return null;
    return (s.reduce((acc, cur) => acc + cur.daily_score, 0) / s.length).toFixed(1);
  });

  getSeverityLabel(total: number): string {
    if (total <= 6) return 'Kiểm soát tốt (0 - 6)';
    if (total <= 15) return 'Nhẹ (7 - 15)';
    if (total <= 27) return 'Vừa (16 - 27)';
    return 'Nặng (28 - 42)';
  }

  getSeverityTagClass(total: number): string {
    if (total <= 6) return 'base-tag-positive';
    if (total <= 15) return 'base-tag-info';
    if (total <= 27) return 'base-tag-warning';
    return 'base-tag-negative';
  }

  getBarHeight(score: number): number {
    return Math.max(10, (score / 6) * 100);
  }
}
