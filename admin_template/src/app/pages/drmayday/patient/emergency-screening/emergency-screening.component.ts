import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';

@Component({
  selector: 'app-emergency-screening',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './emergency-screening.component.html',
})
export class EmergencyScreeningComponent {
  router = inject(Router);
  private patientApi = inject(PatientApiService);

  // Red flags questions
  hasShortnessOfBreath = false;
  hasThroatTightness = false;
  hasDizzinessOrFainting = false;

  // Duration question (Acute < 6 weeks vs Chronic >= 6 weeks)
  diseaseDuration: 'under_6_weeks' | 'over_6_weeks' | '' = '';
  isSubmitting = false;

  isRedFlagTriggered(): boolean {
    return this.hasShortnessOfBreath || this.hasThroatTightness || this.hasDizzinessOrFainting;
  }

  handleProceedToIntake() {
    if (this.isRedFlagTriggered()) {
      return; // Blocked by red flags emergency popup
    }

    this.isSubmitting = true;
    const answers = [
      { question_id: 'Q_RED_FLAGS', option_value: 'NO' },
      { question_id: 'Q_DURATION', option_value: this.diseaseDuration === 'under_6_weeks' ? 'ACUTE' : 'CHRONIC' },
    ];

    this.patientApi.classify(answers).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/patient/intake'], {
          queryParams: {
            template_id: res.template_id || 'TMPL_MAY_DAY_MAN',
            duration: this.diseaseDuration || 'over_6_weeks',
          },
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.router.navigate(['/patient/intake'], {
          queryParams: {
            template_id: 'TMPL_MAY_DAY_MAN',
            duration: this.diseaseDuration || 'over_6_weeks',
          },
        });
      },
    });
  }
}
