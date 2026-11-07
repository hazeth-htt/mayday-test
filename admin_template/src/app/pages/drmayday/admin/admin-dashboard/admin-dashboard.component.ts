import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  drmayday = inject(DrMayDayService);

  // Stats calculation
  totalRecords = () => this.drmayday.records().length;
  pendingRecords = () => this.drmayday.records().filter((r) => r.status === 'pending').length;
  inProgressRecords = () => this.drmayday.records().filter((r) => r.status === 'in_progress').length;
  completedRecords = () => this.drmayday.records().filter((r) => r.status === 'completed').length;
  totalUsers = () => this.drmayday.users().length;
  totalBranches = () => this.drmayday.branches().length;
  totalRooms = () => this.drmayday.rooms().length;
  activeTemplates = () => this.drmayday.templates().filter((t) => t.is_active).length;

  // Chart configuration for weekly consultations
  chartOptions = {
    series: [
      {
        name: 'Mày đay Mạn tính (CSU)',
        data: [12, 18, 15, 22, 28, 24, 30],
        color: '#465fff',
      },
      {
        name: 'Mày đay Cấp tính',
        data: [8, 11, 9, 14, 16, 13, 19],
        color: '#10b981',
      },
    ],
    chart: {
      type: 'area' as const,
      height: 310,
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: {
      categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { text: 'Số lượng ca khám' } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    legend: { position: 'top' as const },
  };
}
