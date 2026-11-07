import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppError } from '../../../../lib/errors/app-error';

describe('LoginComponent (T-001 Production Login)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'navigateToDashboard',
      'loginWithApi',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('AC-2 & AC-3: inputs should be empty by default (no hardcoded accounts)', () => {
    expect(component.phone).toBe('');
    expect(component.password).toBe('');
    expect(component.errorMessage).toBe('');
  });

  describe('AC-3: Identifier (Phone) validation', () => {
    it('should reject empty phone number', () => {
      component.phone = '';
      component.password = 'ValidPass123';
      component.handleLogin();

      expect(component.errorMessage).toContain('Vui lòng nhập số điện thoại');
      expect(mockAuthService.loginWithApi).not.toHaveBeenCalled();
    });

    it('should reject phone with characters or email format', () => {
      component.phone = 'admin@hospital.vn';
      component.password = 'ValidPass123';
      component.handleLogin();

      expect(component.errorMessage).toContain('chỉ bao gồm các chữ số');
      expect(mockAuthService.loginWithApi).not.toHaveBeenCalled();
    });

    it('should reject invalid Vietnam phone prefix or incorrect length', () => {
      component.phone = '0123456789'; // not starting with 03, 05, 07, 08, 09
      component.password = 'ValidPass123';
      component.handleLogin();

      expect(component.errorMessage).toContain('không đúng định dạng Việt Nam');
      expect(mockAuthService.loginWithApi).not.toHaveBeenCalled();
    });

    it('should reject empty password when phone is valid', () => {
      component.phone = '0912345678';
      component.password = '';
      component.handleLogin();

      expect(component.errorMessage).toContain('Vui lòng nhập mật khẩu');
      expect(mockAuthService.loginWithApi).not.toHaveBeenCalled();
    });
  });

  describe('AC-4: Error handling and friendly messages', () => {
    it('should show friendly generic error on 401 / bad credentials', () => {
      component.phone = '0912345678';
      component.password = 'WrongPass123';
      mockAuthService.loginWithApi.and.returnValue(
        throwError(() => ({ status: 401, code: 3008, message: 'Invalid credentials' }))
      );

      component.handleLogin();

      expect(component.errorMessage).toBe(
        'Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.'
      );
      expect(component.isLoading).toBeFalse();
    });

    it('should show locked account error on 403', () => {
      component.phone = '0912345678';
      component.password = 'Pass123';
      mockAuthService.loginWithApi.and.returnValue(
        throwError(() => ({ status: 403, message: 'Forbidden' }))
      );

      component.handleLogin();

      expect(component.errorMessage).toContain('tạm khóa');
    });

    it('should show network failure error on status 0', () => {
      component.phone = '0912345678';
      component.password = 'Pass123';
      mockAuthService.loginWithApi.and.returnValue(
        throwError(() => ({ status: 0, message: 'Network Error' }))
      );

      component.handleLogin();

      expect(component.errorMessage).toContain('kết nối mạng');
    });
  });

  describe('AC-5: Role-based navigation on success', () => {
    it('should call navigateToDashboard on successful login', () => {
      component.phone = '0912345678';
      component.password = 'CorrectPass123';
      mockAuthService.loginWithApi.and.returnValue(
        of({ token: 'mock-token', user_info: { user_id: 1, full_name: 'BS Hùng', phone: '0912345678', role_id: 2 } } as any)
      );

      component.handleLogin();

      expect(component.isLoading).toBeFalse();
      expect(mockAuthService.navigateToDashboard).toHaveBeenCalled();
    });
  });
});
