export interface Uas7EligibilityDto {
  eligible: 'true' | 'false' | boolean;
  medical_record_id?: number | string | null;
}

export interface CreateUas7ScoreRequest {
  medical_record_id: number;
  score_date: string; // YYYY-MM-DD
  iss7: number; // 0 - 3
  hss7: number; // 0 - 3
  note?: string;
}

export interface Uas7ScoreDto {
  patient_id: number;
  medical_record_id: number;
  score_date: string;
  iss7: number;
  hss7: number;
  daily_score: number;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Uas7WeekSummaryDto {
  patient_id: number;
  week_score: number;
  severity_label: string; // 'Kiểm soát tốt' | 'Nhẹ' | 'Vừa' | 'Nặng'
  completed_days: number;
}
