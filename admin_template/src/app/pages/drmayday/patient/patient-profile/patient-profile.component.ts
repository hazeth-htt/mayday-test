import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrMayDayService } from '../../../../core/services/drmayday.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile.component.html',
})
export class PatientProfileComponent {
  drmayday = inject(DrMayDayService);

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

  handleSaveProfile() {
    this.alertMessage = 'Cập nhật hồ sơ bệnh nhân thành công!';
    setTimeout(() => (this.alertMessage = null), 4000);
  }
}
