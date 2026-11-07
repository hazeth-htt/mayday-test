import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppError } from '../../../../lib/errors/app-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  phone = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.navigateToDashboard();
    }
  }

  handleLogin() {
    this.errorMessage = '';
    const cleanPhone = this.phone.trim();
    if (!cleanPhone || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu.';
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      this.errorMessage = 'Số điện thoại không đúng chuẩn Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09).';
      return;
    }

    this.isLoading = true;

    this.auth.loginWithApi(cleanPhone, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.auth.navigateToDashboard();
      },
      error: (err: AppError) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Số điện thoại hoặc mật khẩu không chính xác.';
      },
    });
  }

  quickLogin(role: 'admin' | 'doctor' | 'patient') {
    const accounts = {
      admin: { phone: '0901234567', password: 'Admin@123' },
      doctor: { phone: '0912345678', password: 'Doctor@123' },
      patient: { phone: '0988776655', password: 'Patient@123' },
    };
    const acc = accounts[role];
    this.phone = acc.phone;
    this.password = acc.password;
    this.handleLogin();
  }
}
