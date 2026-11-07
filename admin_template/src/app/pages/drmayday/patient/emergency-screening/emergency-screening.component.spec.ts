import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmergencyScreeningComponent } from './emergency-screening.component';
import { PatientApiService } from '../../../../../api/services/patient/patient-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

describe('EmergencyScreeningComponent', () => {
  let component: EmergencyScreeningComponent;
  let fixture: ComponentFixture<EmergencyScreeningComponent>;
  let mockPatientApi: jasmine.SpyObj<PatientApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockPatientApi = jasmine.createSpyObj('PatientApiService', ['classify']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'currentUser']);

    await TestBed.configureTestingModule({
      imports: [EmergencyScreeningComponent],
      providers: [
        provideRouter([]),
        { provide: PatientApiService, useValue: mockPatientApi },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmergencyScreeningComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create EmergencyScreeningComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should not trigger red flag by default', () => {
    expect(component.isRedFlagTriggered()).toBeFalse();
  });

  it('should trigger red flag when any of the 4 emergency symptoms is checked', () => {
    component.hasShortnessOfBreath = true;
    expect(component.isRedFlagTriggered()).toBeTrue();

    component.hasShortnessOfBreath = false;
    component.hasDizzinessOrFainting = true;
    expect(component.isRedFlagTriggered()).toBeTrue();

    component.hasDizzinessOrFainting = false;
    component.hasRapidSwelling = true;
    expect(component.isRedFlagTriggered()).toBeTrue();

    component.hasRapidSwelling = false;
    component.hasStomachPainOrVomiting = true;
    expect(component.isRedFlagTriggered()).toBeTrue();
  });

  it('should block proceeding to intake when red flag is triggered', () => {
    component.hasShortnessOfBreath = true;
    component.handleProceedToIntake();
    expect(mockPatientApi.classify).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to register if patient is not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    component.handleProceedToIntake();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should call classify and navigate to intake if patient is authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockPatientApi.classify.and.returnValue(of({ template_id: 'TMPL_MAY_DAY_CAP', template_name: 'Mẫu Khám Mày Đay Cấp Tính' }));

    component.diseaseDuration = 'under_6_weeks';
    component.lesionType = 'wheals';
    component.handleProceedToIntake();

    expect(mockPatientApi.classify).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/patient/intake'], {
      queryParams: {
        template_id: 'TMPL_MAY_DAY_CAP',
        duration: 'under_6_weeks',
        lesion_type: 'wheals',
      },
    });
  });
});
