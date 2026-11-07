import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthApiService } from '../../../../api/services/auth/auth-api.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent (T-005 OTP Reset Password Flow)', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let mockAuthApi: jasmine.SpyObj<AuthApiService>;

  beforeEach(async () => {
    mockAuthApi = jasmine.createSpyObj('AuthApiService', ['forgotPassword', 'resetPassword']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthApiService, useValue: mockAuthApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
  });

  it('AC-3: should reject invalid phone format on Step 1', () => {
    component.phone = '0123456789';
    component.handleSendOtp();

    expect(component.errorMessage).toContain('không đúng định dạng');
    expect(mockAuthApi.forgotPassword).not.toHaveBeenCalled();
  });

  it('AC-2 & AC-3: should advance to Step 2 when phone is valid', () => {
    component.phone = '0912345678';
    mockAuthApi.forgotPassword.and.returnValue(of({} as any));

    component.handleSendOtp();

    expect(component.isLoading).toBeFalse();
    expect(component.step).toBe(2);
    expect(component.successMessage).toContain('0912345678');
  });

  it('AC-3: should reject unmatched confirmation password on Step 2', () => {
    component.step = 2;
    component.phone = '0912345678';
    component.otp = '123456';
    component.newPassword = 'Password@123';
    component.confirmPassword = 'DifferentPassword@123';

    component.handleResetPassword();

    expect(component.errorMessage).toContain('không trùng khớp');
    expect(mockAuthApi.resetPassword).not.toHaveBeenCalled();
  });

  it('AC-4: should advance to Step 3 (Success) when reset succeeds', () => {
    component.step = 2 as 1 | 2 | 3;
    component.phone = '0912345678';
    component.otp = '123456';
    component.newPassword = 'NewSecretPassword@123';
    component.confirmPassword = 'NewSecretPassword@123';

    mockAuthApi.resetPassword.and.returnValue(of({} as any));

    component.handleResetPassword();

    expect(component.isLoading).toBeFalse();
    expect(component.step as number).toBe(3);
  });
});
