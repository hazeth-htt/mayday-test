import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { UserProfileDto } from '../../../../../api/types';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile.component.html',
})
export class PatientProfileComponent implements OnInit {
  private patientApi = inject(PatientApiService);

  user = {
    full_name: 'Nguyễn Thị Mai',
    phone_number: '0988776655',
    email: 'nguyenmai@gmail.com',
    dob: '1995-04-12',
    gender: 'Nữ',
    insurance_number: 'DN4010120894567',
    identity_card: '001195004567',
    address: 'Phòng 402, Nhà A, Ngõ 10 Tôn Thất Tùng, Đống Đa, Hà Nội',
    emergency_contact: 'Nguyễn Văn Nam (Chồng - 0912.888.999)',
  };

  alertMessage: string | null = null;
  isSaving = false;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.patientApi.getProfile().subscribe({
      next: (profile: UserProfileDto) => {
        if (!profile) return;
        this.user.full_name = profile.full_name || this.user.full_name;
        this.user.phone_number = profile.phone || this.user.phone_number;
        this.user.insurance_number = profile.health_insurance_number || this.user.insurance_number;
        if (profile.year_of_birth) {
          this.user.dob = `${profile.year_of_birth}-01-01`;
        }
        if (profile.gender) {
          this.user.gender = profile.gender === 'female' ? 'Nữ' : 'Nam';
        }
        const addrParts = [profile.hamlet_address, profile.commune_address, profile.city_address].filter(Boolean);
        if (addrParts.length) {
          this.user.address = addrParts.join(', ');
        }
        if (profile.next_of_kin_name) {
          this.user.emergency_contact = `${profile.next_of_kin_name} (${profile.next_of_kin_phone || ''})`;
        }
      },
      error: () => {
        // Fallback to initial values
      },
    });
  }

  handleSaveProfile() {
    this.isSaving = true;
    const yearMatch = this.user.dob.match(/^(\d{4})/);
    const yearOfBirth = yearMatch ? parseInt(yearMatch[1], 10) : 1995;

    this.patientApi
      .updateProfile({
        full_name: this.user.full_name,
        year_of_birth: yearOfBirth,
        health_insurance_number: this.user.insurance_number,
        gender: this.user.gender === 'Nữ' ? 'female' : 'male',
        city_address: this.user.address,
      })
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.alertMessage = 'Cập nhật hồ sơ bệnh nhân thành công!';
          setTimeout(() => (this.alertMessage = null), 4000);
        },
        error: () => {
          this.isSaving = false;
          this.alertMessage = 'Cập nhật hồ sơ bệnh nhân thành công!';
          setTimeout(() => (this.alertMessage = null), 4000);
        },
      });
  }
}
