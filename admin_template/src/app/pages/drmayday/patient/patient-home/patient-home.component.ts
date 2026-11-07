import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { Uas7ScoreDto, Uas7WeekSummaryDto, MedicalRecordDto } from '../../../../../api/types';
import { toNumericId } from '../../../../../api/mappers/_base';

@Component({
  selector: 'app-patient-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-home.component.html',
})
export class PatientHomeComponent implements OnInit {
  auth = inject(AuthService);
  private patientApi = inject(PatientApiService);

  isLoading = signal(true);
  todayDate = new Date().toISOString().split('T')[0];

  scores = signal<Uas7ScoreDto[]>([]);
  weekSummary = signal<Uas7WeekSummaryDto | null>(null);
  recentRecord = signal<MedicalRecordDto | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    const userId = toNumericId(this.auth.currentUser()?.id) || 3;

    this.patientApi.getUas7ScoresForPatient(userId).subscribe({
      next: (data) => {
        this.scores.set(data || []);
      },
      error: () => this.scores.set([]),
    });

    this.patientApi.getUas7WeekSummary(undefined, userId).subscribe({
      next: (summary) => {
        this.weekSummary.set(summary);
      },
      error: () => this.weekSummary.set(null),
    });

    this.patientApi.getHistory(userId).subscribe({
      next: (records) => {
        const sorted = (records || []).sort((a, b) => b.created_at.localeCompare(a.created_at));
        this.recentRecord.set(sorted[0] || null);
        this.isLoading.set(false);
      },
      error: () => {
        this.recentRecord.set(null);
        this.isLoading.set(false);
      },
    });
  }

  todayScore = computed(() =>
    this.scores().find((s) => s.score_date === this.todayDate)
  );

  last7Scores = computed(() => this.scores().slice(-7));

  weeklyTotal = computed(() => {
    if (this.weekSummary()) return this.weekSummary()!.week_score;
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
    return Math.max(15, Math.round((score / 6) * 100));
  }
}
