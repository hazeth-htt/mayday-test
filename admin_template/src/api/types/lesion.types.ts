export type LesionMilestone = 'start' | 'peak' | 'normal';

export interface CreateEpisodeRequest {
  medical_record_id: number;
  name: string;
  occurred_at?: string;
  context_tags?: string | string[];
  context_other?: string;
  medication_name?: string;
  medication_taken_ago?: string;
  medication_unit?: string;
  description?: string;
}

export interface LesionEpisodeDto {
  episode_id: string;
  medical_record_id: number;
  patient_id: number;
  name: string;
  occurred_at?: string;
  context_tags?: string | string[];
  context_other?: string;
  medication_name?: string;
  medication_taken_ago?: string;
  medication_unit?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateLocationRequest {
  episode_id: string;
  body_part: string;
  occurred_at?: string;
  context_tags?: string | string[];
  context_other?: string;
  medication_name?: string;
  medication_taken_ago?: string;
  medication_unit?: string;
}

export interface LesionLocationDto {
  lesion_location_id: string;
  episode_id: string;
  body_part: string;
  occurred_at?: string;
  context_tags?: string | string[];
  context_other?: string;
  medication_name?: string;
  medication_taken_ago?: string;
  medication_unit?: string;
  created_at: string;
  updated_at?: string;
}

export interface ImageAttachmentDto {
  id: string;
  user_id: number;
  medical_record_id?: number | null;
  question_id?: string | null;
  file_path?: string;
  file_url: string;
  file_name?: string;
  file_type?: string;
  created_at: string;
}

export interface CreatePhotoRequest {
  episode_id: string;
  location_id?: string;
  attachment_id: string;
  taken_at?: string;
  milestone: LesionMilestone;
  itch_score?: number;
  pain_score?: number;
  burn_score?: number;
  hives_count?: number;
  local_auas?: number;
  annotated_url?: string;
}

export interface LesionPhotoDto {
  photo_id: string;
  episode_id: string;
  location_id?: string;
  attachment_id: string;
  taken_at?: string;
  milestone: LesionMilestone;
  itch_score?: number;
  pain_score?: number;
  burn_score?: number;
  hives_count?: number;
  local_auas?: number;
  annotated_url?: string;
  attachment?: {
    attachment_id: string;
    file_url: string;
    file_name?: string;
  };
  created_at?: string;
  updated_at?: string;
}
