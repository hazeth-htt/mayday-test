import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { LesionMilestone, LesionPhoto } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-lesion-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesion-tracker.component.html',
})
export class LesionTrackerComponent {
  drmayday = inject(DrMayDayService);

  alertMessage: { text: string; type: 'success' | 'error' } | null = null;

  // New episode form
  onsetTime = '2026-03-09 20:00';
  medicationsTaken = 'Đã uống 1 viên Telfast 180mg';
  notes = 'Mảng đỏ ngứa nhiều vùng cẳng tay sau khi tắm nước ấm';
  selectedBodyPart = 'Mặt trong cẳng tay trái';

  // Photo upload form for 3 milestones
  currentMilestone: LesionMilestone = 'start';
  itchScore = 6;
  painScore = 1;
  burnScore = 3;

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  handleSaveEpisode() {
    const currentPatient = this.drmayday.currentUser();
    const res = this.drmayday.addLesionEpisode({
      patient_id: currentPatient.id,
      onset_time: this.onsetTime,
      context_tags: ['Tắm nước ấm', 'Stress buổi tối'],
      medications_taken: this.medicationsTaken,
      notes: this.notes,
      locations: [
        {
          id: `loc-${Date.now()}`,
          episode_id: '',
          body_part: this.selectedBodyPart,
          photos: [
            {
              id: `ph-${Date.now()}`,
              milestone: this.currentMilestone,
              photo_url: './images/cards/card-01.jpg',
              taken_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              itch_score: this.itchScore,
              pain_score: this.painScore,
              burn_score: this.burnScore,
              hives_count: 12,
              auas_score: 2.8,
            },
          ],
        },
      ],
    });
    this.showAlert(res.message, 'success');
  }

  getEpisodes() {
    return this.drmayday.getLesionEpisodes();
  }
}
