import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../client/api-client';
import {
  AnswerItemPayload,
  ClassifyAnswerItem,
  ClassifyQuestionDto,
  ClassifyResponseData,
  CreateEpisodeRequest,
  CreateLocationRequest,
  CreatePhotoRequest,
  CreateUas7ScoreRequest,
  ImageAttachmentDto,
  LesionEpisodeDto,
  LesionLocationDto,
  LesionPhotoDto,
  MedicalRecordDetailDto,
  MedicalRecordDto,
  SelfCreateRecordRequest,
  Uas7EligibilityDto,
  Uas7ScoreDto,
  Uas7WeekSummaryDto,
  UpdateUserProfileRequest,
  UserProfileDto,
} from '../../types';

@Injectable({
  providedIn: 'root',
})
export class PatientApiService {
  private api = inject(ApiClient);

  // 1. Classification & Sàng lọc
  getClassifyQuestions(): Observable<ClassifyQuestionDto[]> {
    return this.api.get<ClassifyQuestionDto[]>('medicalrecords/classifyquestions');
  }

  classify(answers: ClassifyAnswerItem[]): Observable<ClassifyResponseData> {
    return this.api.post<ClassifyResponseData>('medicalrecords/classify', { answers });
  }

  selfCreateRecord(payload: SelfCreateRecordRequest): Observable<MedicalRecordDetailDto> {
    return this.api.post<MedicalRecordDetailDto>('medicalrecords/selfcreate', payload);
  }

  upsertAnswers(recordId: number, answers: AnswerItemPayload[]): Observable<{ count: number }> {
    return this.api.post<{ count: number }>(`medicalrecords/${recordId}/answers`, { answers });
  }

  // 2. UAS7 Scoring
  checkUas7Eligibility(): Observable<Uas7EligibilityDto> {
    return this.api.get<Uas7EligibilityDto>('uas7scores/eligibility');
  }

  createUas7Score(payload: CreateUas7ScoreRequest): Observable<Uas7ScoreDto[]> {
    return this.api.post<Uas7ScoreDto[]>('uas7scores', payload);
  }

  getUas7WeekSummary(startDate?: string, patientId?: number): Observable<Uas7WeekSummaryDto> {
    return this.api.get<Uas7WeekSummaryDto>('uas7scores/week', {
      params: { ...(startDate ? { start_date: startDate } : {}), ...(patientId ? { patient_id: patientId } : {}) },
    });
  }

  getUas7ScoresForPatient(patientId: number): Observable<Uas7ScoreDto[]> {
    return this.api.get<Uas7ScoreDto[]>(`uas7scores/patient/${patientId}`);
  }

  // 3. Lesion Tracker & Images
  getMyLesionEpisodes(recordId?: number): Observable<LesionEpisodeDto[]> {
    return this.api.get<LesionEpisodeDto[]>('lesion_episodes/my', {
      params: recordId ? { medical_record_id: recordId } : {},
    });
  }

  createLesionEpisode(payload: CreateEpisodeRequest): Observable<LesionEpisodeDto> {
    return this.api.post<LesionEpisodeDto>('lesion_episodes', payload);
  }

  createLesionLocation(payload: CreateLocationRequest): Observable<LesionLocationDto> {
    return this.api.post<LesionLocationDto>('lesion_locations', payload);
  }

  uploadImage(file: File, recordId?: number, questionId?: string): Observable<ImageAttachmentDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (recordId) formData.append('medical_record_id', String(recordId));
    if (questionId) formData.append('question_id', questionId);
    return this.api.upload<ImageAttachmentDto>('image_attachments', formData);
  }

  createLesionPhoto(payload: CreatePhotoRequest): Observable<LesionPhotoDto> {
    return this.api.post<LesionPhotoDto>('lesion_photos', payload);
  }

  // 4. Patient Profile
  getProfile(): Observable<UserProfileDto> {
    return this.api.get<UserProfileDto>('users/info');
  }

  updateProfile(payload: UpdateUserProfileRequest): Observable<UserProfileDto> {
    return this.api.put<UserProfileDto>('users/info', payload);
  }

  // 5. History
  getHistory(patientId: number): Observable<MedicalRecordDto[]> {
    return this.api.get<MedicalRecordDto[]>(`medicalrecords/history/${patientId}`);
  }
}
