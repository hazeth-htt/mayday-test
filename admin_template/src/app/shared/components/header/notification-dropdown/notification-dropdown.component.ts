import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationApiService } from '../../../../../api/services/notification/notification-api.service';
import { NotificationDto } from '../../../../../api/types';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  templateUrl: './notification-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent]
})
export class NotificationDropdownComponent implements OnInit {
  private notiApi = inject(NotificationApiService);
  private auth = inject(AuthService);

  isOpen = false;
  notifying = true;
  notifications = signal<NotificationDto[]>([]);

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notiApi.getNotifications().subscribe({
      next: (list) => {
        this.notifications.set(list || []);
      },
      error: () => {
        this.notifications.set([]);
      }
    });
  }

  get userNotifications() {
    return this.notifications();
  }

  get unreadCount(): number {
    return this.notifications().filter((n) => n.is_read === '0' || n.is_read === false).length;
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
    this.notiApi.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => ({ ...n, is_read: '1' }))
        );
      }
    });
  }

  onItemClick(item: NotificationDto) {
    if (item.is_read === '0' || item.is_read === false) {
      this.notiApi.markAsRead(item.id).subscribe({
        next: () => {
          this.notifications.update((list) =>
            list.map((n) => (n.id === item.id ? { ...n, is_read: '1' } : n))
          );
        }
      });
    }
  }
}
