export interface FcmTokenRequest {
  fcm_token: string;
  device_type: 'android' | 'ios' | 'web';
}

export interface NotificationDto {
  id: string;
  user_id: number;
  title: string;
  body: string;
  type: 'appointment' | 'lab_result' | 'uas7_reminder' | 'general' | 'system';
  avatar?: string | null;
  reference_id?: string | null;
  is_read: '0' | '1' | boolean;
  created_at: string;
  updated_at?: string;
}
