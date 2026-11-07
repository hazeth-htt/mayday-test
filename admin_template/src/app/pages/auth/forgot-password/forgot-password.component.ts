import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../../../api/services/auth/auth-api.service';
import { AppError } from '../../../../lib/errors/app-error';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  authApi = inject(AuthApiService);
  router = inject(Router);

  step: 1 | 2 | 3 = 1;

  phone = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  handleSendOtp() {
    this.errorMessage = '';
    const cleanPhone = this.phone.trim();

    if (!cleanPhone) {
      this.errorMessage = 'Vui lòng nhập số điện thoại đăng ký.';
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      this.errorMessage = 'Số điện thoại không đúng định dạng Việt Nam (10 chữ số, đầu 03, 05, 07, 08, 09).';
      return;
    }

    this.isLoading = true;
    this.authApi.forgotPassword(cleanPhone).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 2;
        this.successMessage = `Mã xác thực OTP đã được gửi tới số điện thoại ${cleanPhone}.`;
      },
      error: (err: AppError | any) => {
        this.isLoading = false;
        this.errorMessage = err?.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau giây lát.';
      },
    });
  }

  handleResetPassword() {
    this.errorMessage = '';
    const cleanOtp = this.otp.trim();

    if (!cleanOtp) {
      this.errorMessage = 'Vui lòng nhập mã xác thực OTP.';
      return;
    }

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'Mật khẩu mới phải có tối thiểu 6 ký tự.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không trùng khớp với mật khẩu mới.';
      return;
    }

    this.isLoading = true;
    this.authApi
      .resetPassword({
        phone: this.phone.trim(),
        otp: cleanOtp,
        new_password: this.newPassword,
        confirm_password: this.confirmPassword,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.step = 3;
        },
        error: (err: AppError | any) => {
          this.isLoading = false;
          this.errorMessage = err?.message || 'Mã OTP không đúng hoặc đã hết hạn. Vui lòng kiểm tra lại.';
        },
      });
  }
}
