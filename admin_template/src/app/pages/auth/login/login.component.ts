import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    // If already authenticated, redirect to dashboard
    if (this.auth.isAuthenticated()) {
      this.auth.navigateToDashboard();
    }
  }

  handleLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ email và mật khẩu.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    // Simulate async (small delay for UX)
    setTimeout(() => {
      const result = this.auth.login(this.email, this.password);
      this.isLoading = false;
      if (result.success) {
        this.auth.navigateToDashboard();
      } else {
        this.errorMessage = result.error || 'Đăng nhập thất bại.';
      }
    }, 400);
  }

  quickLogin(role: 'admin' | 'doctor' | 'patient') {
    const accounts = {
      admin: { email: 'admin@drmayday.vn', password: 'Admin@123' },
      doctor: { email: 'dr.hung@drmayday.vn', password: 'Doctor@123' },
      patient: { email: 'nguyenmai@gmail.com', password: 'Patient@123' },
    };
    const acc = accounts[role];
    this.email = acc.email;
    this.password = acc.password;
    this.handleLogin();
  }
}
