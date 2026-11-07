export type MedicalRecordStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ClassifyOptionDto {
  id: number;
  option_text: string;
  option_value: string;
}

export interface ClassifyQuestionDto {
  question_id: string;
  question_text: string;
  type_question: 'radio' | 'checkbox' | 'text';
  options: ClassifyOptionDto[];
}

export interface ClassifyAnswerItem {
  question_id: string;
  option_value: string;
}

export interface ClassifyRequest {
  answers: ClassifyAnswerItem[];
}

export interface ClassifyResponseData {
  template_id: string;
  template_name: string;
}

export interface AnswerItemPayload {
  question_id: string;
  question_option_id?: number | null;
  answer_text?: string;
  answer_value?: Record<string, unknown> | string[] | string | number | null;
}

export interface SelfCreateRecordRequest {
  patient_id?: number | null;
  template_id: string;
  answers?: AnswerItemPayload[];
}

export interface MedicalRecordDto {
  medical_record_id: number;
  patient_id: number;
  assigned_doctor_id?: number | null;
  template_id: string;
  status: MedicalRecordStatus;
  created_at: string;
  patient_name?: string;
  patient_phone?: string;
  patient_gender?: string;
}

export interface MedicalRecordDetailDto extends MedicalRecordDto {
  created_by?: number | null;
  instructions?: string | null;
  completed_at?: string | null;
  updated_at?: string;
}

export interface MedicalRecordSummaryDto {
  medical_record_id: number;
  status: MedicalRecordStatus;
  patient_name: string;
  created_at: string;
}

export interface AnswerDto {
  id: number;
  medical_record_id: number;
  question_id: string;
  question_option_id?: number | null;
  answer_text?: string | null;
  answer_value?: Record<string, unknown> | string[] | string | number | null;
  answered_by: number;
  created_at: string;
  updated_at?: string;
}

export interface UpsertAnswersRequest {
  answers: AnswerItemPayload[];
}

export interface UpdateMedicalRecordRequest {
  status: MedicalRecordStatus;
  instructions?: string;
}

export interface UpdateStatusRequest {
  status: MedicalRecordStatus;
}
