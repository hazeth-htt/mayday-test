import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-emergency-screening',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './emergency-screening.component.html',
})
export class EmergencyScreeningComponent {
  router = inject(Router);
  auth = inject(AuthService);
  private patientApi = inject(PatientApiService);

  // Bước 0: Sàng lọc 4 dấu hiệu "Báo động nguy cấp" (< 30 giây) chuẩn Bệnh viện Da liễu TW
  hasShortnessOfBreath = false;        // 1. Khó thở, thở khò khè hoặc cảm giác nghẹn tắc ở cổ họng
  hasDizzinessOrFainting = false;      // 2. Chóng mặt, xây xẩm mặt mày, tức ngực hoặc cảm thấy sắp ngất (nghi ngờ tụt HA)
  hasRapidSwelling = false;            // 3. Sưng nề nhanh ở môi, lưỡi hoặc cổ họng (nguy cơ tắc nghẽn đường thở)
  hasStomachPainOrVomiting = false;    // 4. Đau bụng quặn dữ dội từng cơn hoặc nôn mửa liên tục

  // Bước 1 & 2: Phân loại tổn thương & Ngưỡng 6 tuần
  lesionType: 'wheals' | 'angioedema' | 'both' = 'wheals';
  diseaseDuration: 'under_6_weeks' | 'over_6_weeks' | '' = 'under_6_weeks';
  singleLesionDuration: 'under_1h' | '1_to_24h' | 'over_24h' = '1_to_24h';

  isSubmitting = false;

  isRedFlagTriggered(): boolean {
    return (
      this.hasShortnessOfBreath ||
      this.hasDizzinessOrFainting ||
      this.hasRapidSwelling ||
      this.hasStomachPainOrVomiting
    );
  }

  handleProceedToIntake() {
    if (this.isRedFlagTriggered()) {
      return; // Blocked by red flags emergency popup
    }

    if (!this.auth.isAuthenticated()) {
      // Store screening result in sessionStorage so it can be restored after login/registration
      sessionStorage.setItem(
        'drmayday_screening_result',
        JSON.stringify({
          lesionType: this.lesionType,
          diseaseDuration: this.diseaseDuration,
          singleLesionDuration: this.singleLesionDuration,
        })
      );
      this.router.navigate(['/register']);
      return;
    }

    this.isSubmitting = true;
    const answers = [
      { question_id: 'Q_RED_FLAGS', option_value: 'NO' },
      { question_id: 'Q_LESION_TYPE', option_value: this.lesionType.toUpperCase() },
      { question_id: 'Q_DURATION', option_value: this.diseaseDuration === 'under_6_weeks' ? 'ACUTE' : 'CHRONIC' },
      { question_id: 'Q_WHEAL_LIFETIME', option_value: this.singleLesionDuration.toUpperCase() },
    ];

    this.patientApi.classify(answers).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/patient/intake'], {
          queryParams: {
            template_id: res.template_id || 'TMPL_MAY_DAY_MAN',
            duration: this.diseaseDuration || 'under_6_weeks',
            lesion_type: this.lesionType,
          },
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.router.navigate(['/patient/intake'], {
          queryParams: {
            template_id: this.diseaseDuration === 'under_6_weeks' ? 'TMPL_MAY_DAY_CAP' : 'TMPL_MAY_DAY_MAN',
            duration: this.diseaseDuration || 'under_6_weeks',
            lesion_type: this.lesionType,
          },
        });
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
