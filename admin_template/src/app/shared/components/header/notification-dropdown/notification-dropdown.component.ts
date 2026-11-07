import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DrMayDayService } from '../../../../core/services/drmayday.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SystemNotification } from '../../../../core/models/drmayday.models';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent]
})
export class NotificationDropdownComponent {
  drmayday = inject(DrMayDayService);
  auth = inject(AuthService);

  isOpen = false;
  notifying = true;

  get userNotifications(): SystemNotification[] {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.drmayday.notifications().filter((n: SystemNotification) => n.user_id === user.id || !n.user_id);
  }

  get unreadCount(): number {
    return this.userNotifications.filter((n: SystemNotification) => !n.is_read).length;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.notifying = false;
    }
  }

  closeDropdown() {
    this.isOpen = false;
  }

  markAllAsRead() {
    this.userNotifications.forEach((n: SystemNotification) => {
      this.drmayday.markNotificationAsRead(n.id);
    });
  }
}
