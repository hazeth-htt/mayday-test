import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../../../api/services/auth/auth-api.service';
import { AuthService } from '../../../core/services/auth.service';

interface HisRecordMock {
  his_code: string;
  full_name: string;
  phone: string;
  year_of_birth: number;
  gender: 'female' | 'male';
  insurance_number: string;
  city_address: string;
  career: string;
}

const MOCK_HIS_DATABASE: Record<string, HisRecordMock> = {
  'DL-2026-0888': {
    his_code: 'DL-2026-0888',
    full_name: 'Nguyễn Thị Mai',
    phone: '0988776655',
    year_of_birth: 1995,
    gender: 'female',
    insurance_number: 'DN4010120894567',
    city_address: 'Phòng 402, Nhà A, Phương Mai, Đống Đa, Hà Nội',
    career: 'Nhân viên văn phòng',
  },
  'DL-2026-0912': {
    his_code: 'DL-2026-0912',
    full_name: 'Trần Văn Bình',
    phone: '0977665544',
    year_of_birth: 1988,
    gender: 'male',
    insurance_number: 'DN4010120894888',
    city_address: 'Số 28 Giải Phóng, Hai Bà Trưng, Hà Nội',
    career: 'Kỹ sư xây dựng',
  },
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authApi = inject(AuthApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Registration step: 1 = Form fill, 2 = OTP verification, 3 = Success
  currentStep: 1 | 2 | 3 = 1;

  // Registration mode: 'first_time' = Lần đầu khám, 'has_his' = Đã có mã HIS bệnh viện
  regMode: 'first_time' | 'has_his' = 'first_time';

  // HIS lookup state
  hisCodeInput = 'DL-2026-0888';
  hisLookupSuccess = false;
  hisLookupError = '';

  // Form Model
  formData = {
    full_name: '',
    phone: '',
    year_of_birth: 1995,
    gender: 'female' as 'female' | 'male',
    height_cm: 162,
    weight_kg: 54,
    career: 'Nhân viên văn phòng',
    city_address: 'Hà Nội',
    detailed_address: 'Quận Đống Đa',
    insurance_number: '',
    password: '',
    confirm_password: '',
    agree_terms: false,
  };

  // Password visibility
  showPassword = false;
  showConfirmPassword = false;

  // OTP state
  otpCode = '';
  otpTimer = 60;
  private timerInterval: any = null;

  // Status & loading
  errorMessage = '';
  isLoading = false;

  // Calculated BMI
  get bmiValue(): number {
    if (!this.formData.height_cm || !this.formData.weight_kg) return 0;
    const heightM = this.formData.height_cm / 100;
    const bmi = this.formData.weight_kg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
  }

  get bmiClassification(): { label: string; tagClass: string } {
    const v = this.bmiValue;
    if (v === 0) return { label: 'Chưa đủ dữ liệu', tagClass: 'base-tag-neutral' };
    if (v < 18.5) return { label: 'Thiếu cân (BMI < 18.5)', tagClass: 'base-tag-warning' };
    if (v < 23.0) return { label: 'Bình thường (BMI 18.5 - 22.9)', tagClass: 'base-tag-positive' };
    if (v < 25.0) return { label: 'Thừa cân / Tiền béo phì (BMI 23 - 24.9)', tagClass: 'base-tag-warning' };
    return { label: 'Béo phì (BMI ≥ 25.0)', tagClass: 'base-tag-negative' };
  }

  lookupHisCode() {
    this.hisLookupError = '';
    const code = this.hisCodeInput.trim().toUpperCase();
    if (!code) {
      this.hisLookupError = 'Vui lòng nhập mã bệnh nhân HIS ghi trên sổ khám (Ví dụ: DL-2026-0888)';
      return;
    }

    const matched = MOCK_HIS_DATABASE[code];
    if (matched) {
      this.formData.full_name = matched.full_name;
      this.formData.phone = matched.phone;
      this.formData.year_of_birth = matched.year_of_birth;
      this.formData.gender = matched.gender;
      this.formData.insurance_number = matched.insurance_number;
      this.formData.city_address = matched.city_address;
      this.formData.career = matched.career;
      this.hisLookupSuccess = true;
      this.hisLookupError = '';
    } else {
      this.hisLookupSuccess = false;
      this.hisLookupError = `Không tìm thấy hồ sơ với mã "${code}". Vui lòng kiểm tra lại hoặc chọn "Khám lần đầu".`;
    }
  }

  handleProceedToOtp() {
    this.errorMessage = '';

    // Validation
    if (!this.formData.full_name.trim()) {
      this.errorMessage = 'Vui lòng nhập họ và tên bệnh nhân.';
      return;
    }

    const phoneRegex = /(03|05|07|08|09)+([0-9]{8})\b/;
    if (!phoneRegex.test(this.formData.phone.replace(/\s+/g, ''))) {
      this.errorMessage = 'Số điện thoại không đúng định dạng di động Việt Nam (03/05/07/08/09).';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Mật khẩu bảo mật phải có ít nhất 6 ký tự.';
      return;
    }

    if (this.formData.password !== this.formData.confirm_password) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.';
      return;
    }

    if (!this.formData.agree_terms) {
      this.errorMessage = 'Vui lòng đồng ý với Điều khoản dịch vụ và Cam kết bảo mật dữ liệu y tế.';
      return;
    }

    this.isLoading = true;
    // Step 2: Request OTP and proceed
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep = 2;
      this.startOtpTimer();
    }, 400);
  }

  startOtpTimer() {
    this.otpTimer = 60;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  resendOtp() {
    if (this.otpTimer > 0) return;
    this.startOtpTimer();
    this.errorMessage = '';
  }

  handleVerifyOtpAndRegister() {
    this.errorMessage = '';
    if (this.otpCode.length < 4) {
      this.errorMessage = 'Vui lòng nhập đầy đủ mã xác thực OTP (Mặc định kiểm thử: 123456 hoặc bất kỳ 6 số).';
      return;
    }

    this.isLoading = true;
    const cleanPhone = this.formData.phone.replace(/\s+/g, '');

    this.authApi
      .signup({
        full_name: this.formData.full_name,
        phone: cleanPhone,
        password: this.formData.password,
        gender: this.formData.gender,
      })
      .subscribe({
        next: () => {
          // Auto login upon successful registration
          this.auth.loginWithApi(cleanPhone, this.formData.password).subscribe({
            next: () => {
              this.isLoading = false;
              this.currentStep = 3;
            },
            error: () => {
              this.isLoading = false;
              this.currentStep = 3;
            },
          });
        },
        error: (err) => {
          this.isLoading = false;
          // If phone exists, still let user finish or display clear message
          if (err?.error?.code === '3006') {
            this.errorMessage = 'Số điện thoại này đã được đăng ký. Bạn có thể sử dụng màn hình Đăng nhập.';
          } else {
            this.errorMessage = err?.error?.message || 'Có lỗi xảy ra trong quá trình khởi tạo tài khoản.';
          }
        },
      });
  }

  goToEmergencyScreening() {
    this.router.navigate(['/patient/emergency']);
  }

  goToPatientHome() {
    this.router.navigate(['/patient/home']);
  }
}
