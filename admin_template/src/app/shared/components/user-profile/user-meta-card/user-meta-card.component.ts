import { Component } from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';

import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    ModalComponent,
    InputFieldComponent,
    ButtonComponent
],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {

  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  // Example user data (could be made dynamic)
  user = {
    firstName: 'Musharof',
    lastName: 'Chowdhury',
    role: 'Cán bộ Y tế',
    location: 'Hà Nội, Việt Nam',
    avatar: '/images/user/owner.jpg',
    social: {
      facebook: 'https://dalieu.vn',
      x: 'https://dalieu.vn',
      linkedin: 'https://dalieu.vn',
      instagram: 'https://dalieu.vn',
    },
    email: 'canbo@dalieu.vn',
    phone: '1900 6951',
    bio: 'Cán bộ Y tế',
  };

  handleSave() {
    // Handle save logic here

    this.modal.closeModal();
  }
}
