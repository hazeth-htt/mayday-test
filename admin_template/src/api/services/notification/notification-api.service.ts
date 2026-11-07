import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../client/api-client';
import { NotificationDto, FcmTokenRequest } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private api = inject(ApiClient);

  getNotifications(page = 1, limit = 20): Observable<NotificationDto[]> {
    return this.api.get<NotificationDto[]>('notifications', { params: { page, limit } });
  }

  markAsRead(id: string): Observable<NotificationDto> {
    return this.api.put<NotificationDto>(`notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<Record<string, never>> {
    return this.api.put<Record<string, never>>('notifications/read_all', {});
  }

  deleteNotification(id: string): Observable<Record<string, never>> {
    return this.api.delete<Record<string, never>>(`notifications/${id}`);
  }

  registerFcmToken(payload: FcmTokenRequest): Observable<{ id: string }> {
    return this.api.post<{ id: string }>('notifications/fcm_token', payload);
  }
}
