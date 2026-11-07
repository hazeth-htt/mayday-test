import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {
  auth = inject(AuthService);
  router = inject(Router);

  get roleName(): string {
    const role = this.auth.currentRole();
    if (role === 'admin') return 'Quản Trị Viên';
    if (role === 'doctor') return 'Bác Sĩ';
    if (role === 'patient') return 'Bệnh Nhân';
    return 'Chưa Đăng Nhập';
  }

  returnHome() {
    this.auth.navigateToDashboard();
  }
}
