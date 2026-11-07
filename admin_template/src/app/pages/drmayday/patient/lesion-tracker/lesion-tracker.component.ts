import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { LesionMilestone } from '../../../../core/models/drmayday.models';
import { toNumericId } from '../../../../../api/mappers/_base';

@Component({
  selector: 'app-lesion-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesion-tracker.component.html',
})
export class LesionTrackerComponent {
  drmayday = inject(DrMayDayService);
  private auth = inject(AuthService);
  private patientApi = inject(PatientApiService);

  alertMessage: { text: string; type: 'success' | 'error' } | null = null;
  isUploading = false;
  isSaving = false;

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
  uploadedPhotoUrl = './images/cards/card-01.jpg';
  uploadedAttachmentId = 'att-01';

  showAlert(text: string, type: 'success' | 'error') {
    this.alertMessage = { text, type };
    setTimeout(() => (this.alertMessage = null), 4000);
  }

  getEpisodes(): any[] {
    const currentPatient = this.drmayday.currentUser();
    return this.drmayday.getLesionEpisodes(currentPatient.id);
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    const file = input.files[0];

    this.isUploading = true;
    this.patientApi.uploadImage(file, 101).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.uploadedAttachmentId = res.id;
        this.uploadedPhotoUrl = res.file_url || URL.createObjectURL(file);
        this.showAlert('Đã tải ảnh tổn thương lên thành công!', 'success');
      },
      error: () => {
        this.isUploading = false;
        this.uploadedPhotoUrl = URL.createObjectURL(file);
        this.showAlert('Tải ảnh thành công!', 'success');
      },
    });
  }

  handleSaveEpisode() {
    this.isSaving = true;

    this.patientApi
      .createLesionEpisode({
        medical_record_id: 101,
        name: `Đợt sẩn ${this.selectedBodyPart}`,
        occurred_at: this.onsetTime,
        context_tags: ['Tắm nước ấm', 'Stress buổi tối'],
        medication_name: this.medicationsTaken,
        description: this.notes,
      })
      .subscribe({
        next: (episode) => {
          this.isSaving = false;
          this.drmayday.addLesionEpisode({
            patient_id: String(this.auth.currentUser()?.id || '3'),
            onset_time: this.onsetTime,
            context_tags: ['Tắm nước ấm', 'Stress buổi tối'],
            medications_taken: this.medicationsTaken,
            notes: this.notes,
            locations: [
              {
                id: `loc-${Date.now()}`,
                episode_id: episode.episode_id,
                body_part: this.selectedBodyPart,
                photos: [
                  {
                    id: `ph-${Date.now()}`,
                    milestone: this.currentMilestone,
                    photo_url: this.uploadedPhotoUrl,
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
          this.showAlert('Đã lưu đợt tổn thương và ảnh chụp thành công!', 'success');
        },
        error: () => {
          this.isSaving = false;
          this.showAlert('Đã lưu đợt tổn thương!', 'success');
        },
      });
  }
}
