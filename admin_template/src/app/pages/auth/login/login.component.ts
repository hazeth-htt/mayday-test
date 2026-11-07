import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppError } from '../../../../lib/errors/app-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
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

    if (!cleanPhone) {
      this.errorMessage = 'Vui lòng nhập số điện thoại đăng ký.';
      return;
    }

    if (/[^\d]/.test(cleanPhone)) {
      this.errorMessage = 'Số điện thoại chỉ bao gồm các chữ số (không chứa chữ hoặc ký tự đặc biệt).';
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      this.errorMessage = 'Số điện thoại không đúng định dạng Việt Nam (10 chữ số, đầu số 03, 05, 07, 08 hoặc 09).';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Vui lòng nhập mật khẩu bảo mật.';
      return;
    }

    this.isLoading = true;

    this.auth.loginWithApi(cleanPhone, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.auth.navigateToDashboard();
      },
      error: (err: AppError | any) => {
        this.isLoading = false;
        if (err?.code === 3008 || err?.status === 401) {
          this.errorMessage = 'Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
        } else if (err?.status === 403) {
          this.errorMessage = 'Tài khoản tạm thời bị tạm khóa. Vui lòng liên hệ bộ phận hỗ trợ y tế.';
        } else if (err?.status === 0 || !navigator.onLine) {
          this.errorMessage = 'Không thể kết nối đến máy chủ y tế. Vui lòng kiểm tra kết nối mạng.';
        } else if (err?.status >= 500) {
          this.errorMessage = 'Hệ thống đang bận xử lý. Vui lòng thử lại sau giây lát.';
        } else {
          this.errorMessage = err?.message || 'Đăng nhập không thành công. Vui lòng thử lại.';
        }
      },
    });
  }
}
