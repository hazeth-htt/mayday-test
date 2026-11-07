import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthApiService } from '../../../../api/services/auth/auth-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthApi: jasmine.SpyObj<AuthApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthApi = jasmine.createSpyObj('AuthApiService', ['signup']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['loginWithApi']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthApiService, useValue: mockAuthApi },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create RegisterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate BMI correctly based on height and weight', () => {
    component.formData.height_cm = 160;
    component.formData.weight_kg = 55;
    // 55 / (1.6 * 1.6) = 21.48 -> 21.5
    expect(component.bmiValue).toBe(21.5);
    expect(component.bmiClassification.label).toContain('Bình thường');
  });

  it('should validate required fields before proceeding to OTP step', () => {
    component.formData.full_name = '';
    component.handleProceedToOtp();
    expect(component.errorMessage).toContain('họ và tên');
    expect(component.currentStep).toBe(1);

    component.formData.full_name = 'Nguyễn Thị Mai';
    component.formData.phone = '123'; // invalid phone
    component.handleProceedToOtp();
    expect(component.errorMessage).toContain('Số điện thoại không đúng');

    component.formData.phone = '0988776655';
    component.formData.password = '123'; // too short
    component.handleProceedToOtp();
    expect(component.errorMessage).toContain('ít nhất 6 ký tự');

    component.formData.password = 'Pass123';
    component.formData.confirm_password = 'PassDifferent';
    component.handleProceedToOtp();
    expect(component.errorMessage).toContain('không khớp');
  });

  it('should prefill data when looking up a valid HIS code', () => {
    component.hisCodeInput = 'DL-2026-0888';
    component.lookupHisCode();
    expect(component.hisLookupSuccess).toBeTrue();
    expect(component.formData.full_name).toBe('Nguyễn Thị Mai');
    expect(component.formData.phone).toBe('0988776655');
  });

  it('should handle OTP verification and signup call', (done) => {
    mockAuthApi.signup.and.returnValue(
      of({
        user_id: 99,
        full_name: 'Trần Văn A',
        phone: '0988111222',
        role_id: 3,
        is_active: 1,
        created_at: new Date().toISOString(),
      })
    );
    mockAuthService.loginWithApi.and.returnValue(
      of({
        token: 'mock-token',
        user_info: {
          user_id: 99,
          full_name: 'Trần Văn A',
          phone: '0988111222',
          role_id: 3,
        },
      } as any)
    );

    component.formData.full_name = 'Trần Văn A';
    component.formData.phone = '0988111222';
    component.formData.password = 'Secret123';
    component.formData.confirm_password = 'Secret123';
    component.formData.agree_terms = true;
    component.otpCode = '123456';

    component.handleVerifyOtpAndRegister();

    setTimeout(() => {
      expect(mockAuthApi.signup).toHaveBeenCalled();
      expect(component.currentStep).toBe(3);
      done();
    }, 100);
  });
});
