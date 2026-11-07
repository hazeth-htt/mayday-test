import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminApiService } from '../../../../../api/services/admin/admin-api.service';
import { DoctorApiService } from '../../../../../api/services/doctor/doctor-api.service';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { MedicalRecordDto } from '../../../../../api/types/medical-record.types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  drmayday = inject(DrMayDayService);
  private adminApi = inject(AdminApiService);
  private doctorApi = inject(DoctorApiService);

  totalRecords = signal(12);
  pendingRecords = signal(2);
  inProgressRecords = signal(3);
  completedRecords = signal(7);
  totalUsers = signal(4);
  totalBranches = signal(1);
  totalRooms = signal(2);
  activeTemplates = signal(1);
  isLoading = false;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.doctorApi.getQueue().subscribe({
      next: (queue: MedicalRecordDto[]) => {
        const pending = queue.filter((r) => r.status === 'pending').length;
        const inProg = queue.filter((r) => r.status === 'in_progress').length;
        const comp = queue.filter((r) => r.status === 'completed').length;
        this.pendingRecords.set(pending);
        this.inProgressRecords.set(inProg);
        this.completedRecords.set(comp);
        this.totalRecords.set(queue.length);
      },
    });

    this.adminApi.getUsers().subscribe({
      next: (users) => this.totalUsers.set(users.length),
    });

    this.adminApi.getBranches().subscribe({
      next: (branches) => this.totalBranches.set(branches.length),
    });

    this.adminApi.getRooms().subscribe({
      next: (rooms) => this.totalRooms.set(rooms.length),
    });

    this.adminApi.getTemplates().subscribe({
      next: (tmpls) => {
        this.activeTemplates.set(tmpls.length);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

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
