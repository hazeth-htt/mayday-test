import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emergency-screening',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './emergency-screening.component.html',
})
export class EmergencyScreeningComponent {
  router = inject(Router);

  // Red flags questions
  hasShortnessOfBreath = false;
  hasThroatTightness = false;
  hasDizzinessOrFainting = false;

  // Duration question (Acute < 6 weeks vs Chronic >= 6 weeks)
  diseaseDuration: 'under_6_weeks' | 'over_6_weeks' | '' = '';

  isRedFlagTriggered(): boolean {
    return this.hasShortnessOfBreath || this.hasThroatTightness || this.hasDizzinessOrFainting;
  }

  handleProceedToIntake() {
    if (this.isRedFlagTriggered()) {
      return; // Blocked by red flags emergency popup
    }
    // Navigate to dynamic questionnaire
    this.router.navigate(['/patient/intake'], {
      queryParams: { duration: this.diseaseDuration || 'over_6_weeks' },
    });
  }
}
