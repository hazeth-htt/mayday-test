import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../client/api-client';
import {
  AnswerDto,
  CreateLabRequest,
  CreatePrescriptionRequest,
  LabRequestDto,
  MedicalRecordDetailDto,
  MedicalRecordDto,
  MedicalRecordStatus,
  MedicalRecordSummaryDto,
  PrescriptionDto,
  UpdateMedicalRecordRequest,
  UserProfileDto,
} from '../../types';

export interface PatientSearchParams {
  keyword?: string;
  gender?: string;
  min_year?: string | number;
  max_year?: string | number;
  page?: number;
  limit?: number;
}

export interface PatientSearchResult {
  user_id: number;
  full_name: string;
  phone: string;
  gender?: string;
  year_of_birth?: number;
  total_records?: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class DoctorApiService {
  private api = inject(ApiClient);

  // 1. Hàng đợi & Tiếp nhận ca khám
  getQueue(status?: MedicalRecordStatus | 'all', page = 1, limit = 50): Observable<MedicalRecordDto[]> {
    const params: Record<string, string | number> = { page, limit };
    if (status && status !== 'all') {
      params['status'] = status;
    }
    return this.api.get<MedicalRecordDto[]>('medicalrecords', { params });
  }

  getRecordDetail(id: number): Observable<MedicalRecordDetailDto> {
    return this.api.get<MedicalRecordDetailDto>(`medicalrecords/${id}`);
  }

  getRecordSummary(id: number): Observable<MedicalRecordSummaryDto> {
    return this.api.get<MedicalRecordSummaryDto>(`medicalrecords/${id}/summary`);
  }

  acceptRecord(id: number): Observable<MedicalRecordDto> {
    return this.api.post<MedicalRecordDto>(`medicalrecords/${id}/accept`, {});
  }

  // 2. Câu hỏi & Bệnh sử
  getRecordAnswers(recordId: number): Observable<AnswerDto[]> {
    return this.api.get<AnswerDto[]>(`medicalrecords/${recordId}/answers`);
  }

  addAnswers(
    recordId: number,
    answers: Array<{ question_id: string; answer_text?: string; option_id?: string }>
  ): Observable<{ count: string | number }> {
    return this.api.post<{ count: string | number }>(`medicalrecords/${recordId}/add_answers`, { answers });
  }

  // 3. Kết luận & Đổi trạng thái
  completeRecord(id: number, payload: UpdateMedicalRecordRequest): Observable<MedicalRecordDetailDto> {
    return this.api.put<MedicalRecordDetailDto>(`medicalrecords/${id}`, payload);
  }

  updateRecordStatus(id: number, status: MedicalRecordStatus): Observable<{ id: string | number; status: string }> {
    return this.api.patch<{ id: string | number; status: string }>(`medicalrecords/${id}/status`, { status });
  }

  // 4. Kê đơn thuốc & Chỉ định xét nghiệm
  createPrescription(payload: CreatePrescriptionRequest): Observable<PrescriptionDto> {
    return this.api.post<PrescriptionDto>('prescriptions', payload);
  }

  createLabRequest(payload: CreateLabRequest): Observable<LabRequestDto> {
    return this.api.post<LabRequestDto>('lab_requests', payload);
  }

  getLabResults(recordId: number): Observable<LabRequestDto[]> {
    return this.api.get<LabRequestDto[]>(`lab_requests/${recordId}`);
  }

  // 5. Tìm kiếm & Tạo bệnh nhân
  searchPatients(params: PatientSearchParams): Observable<PatientSearchResult[]> {
    return this.api.get<PatientSearchResult[]>('patients/search', { params: params as Record<string, string | number> });
  }

  createPatient(payload: Partial<UserProfileDto> & { password: string }): Observable<UserProfileDto> {
    return this.api.post<UserProfileDto>('patients', payload);
  }
}
