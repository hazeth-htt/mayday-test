import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';

@Component({
  selector: 'app-user-info-card',
  imports: [
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent
],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent {

  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  user = {
    firstName: 'Musharof',
    lastName: 'Chowdhury',
    email: 'canbo@dalieu.vn',
    phone: '1900 6951',
    bio: 'Cán bộ Y tế',
    social: {
      facebook: 'https://dalieu.vn',
      x: 'https://dalieu.vn',
      linkedin: 'https://dalieu.vn',
      instagram: 'https://dalieu.vn',
    },
  };

  handleSave() {
    // Handle save logic here

    this.modal.closeModal();
  }
}
