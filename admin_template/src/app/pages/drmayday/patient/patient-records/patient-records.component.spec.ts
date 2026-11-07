import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientRecordsComponent } from './patient-records.component';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MedicalRecordDto } from '../../../../../api/types';

describe('PatientRecordsComponent (T-006 Medical History & Prescriptions)', () => {
  let component: PatientRecordsComponent;
  let fixture: ComponentFixture<PatientRecordsComponent>;
  let mockPatientApi: jasmine.SpyObj<PatientApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const sampleRecords: MedicalRecordDto[] = [
    {
      medical_record_id: 101,
      patient_id: 1,
      template_id: 'TMPL_MAY_DAY_MAN',
      patient_name: 'Trần Thị Lan',
      status: 'completed',
      diagnosis: 'Mày đay mạn tính tự phát (CSU)',
      created_at: '2026-03-15T09:30:00Z',
    },
    {
      medical_record_id: 88,
      patient_id: 1,
      template_id: 'TMPL_MAY_DAY_CAP',
      patient_name: 'Trần Thị Lan',
      status: 'completed',
      diagnosis: 'Mày đay cấp tính nghi do hải sản',
      created_at: '2026-01-20T14:15:00Z',
    },
  ];

  beforeEach(async () => {
    mockPatientApi = jasmine.createSpyObj('PatientApiService', ['getHistory']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['currentUser']);

    mockAuthService.currentUser.and.returnValue({
      id: 1,
      full_name: 'Trần Thị Lan',
      phone: '0988776655',
      role: 'patient',
    });
    mockPatientApi.getHistory.and.returnValue(of(sampleRecords));

    await TestBed.configureTestingModule({
      imports: [PatientRecordsComponent],
      providers: [
        provideRouter([]),
        { provide: PatientApiService, useValue: mockPatientApi },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRecordsComponent);
    component = fixture.componentInstance;
  });

  it('AC-1: should load records on init and filter correctly', () => {
    component.ngOnInit();
    expect(component.records().length).toBe(2);

    // Filter Chronic
    component.setFilter('chronic');
    expect(component.filteredRecords().length).toBe(1);
    expect(component.filteredRecords()[0].medical_record_id).toBe(101);

    // Filter Acute
    component.setFilter('acute');
    expect(component.filteredRecords().length).toBe(1);
    expect(component.filteredRecords()[0].medical_record_id).toBe(88);
  });

  it('AC-2: should populate prescription details when viewing prescription', () => {
    component.ngOnInit();
    const chronicRecord = sampleRecords[0];

    component.viewPrescription(chronicRecord);
    expect(component.selectedRecord()).toBe(chronicRecord);
    expect(component.selectedPrescriptions().length).toBeGreaterThan(0);
    expect(component.selectedPrescriptions()[0].drug_name).toContain('Fexofenadine');

    component.closePrescription();
    expect(component.selectedRecord()).toBeNull();
    expect(component.selectedPrescriptions().length).toBe(0);
  });
});
