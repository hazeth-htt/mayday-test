import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard (T-002 Lazy Loading & RBAC Isolation)', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'currentRole',
      'hasPermission',
      'clearSession',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    localStorage.setItem('drmayday_token', 'valid-token-123');
  });

  afterEach(() => {
    localStorage.removeItem('drmayday_token');
  });

  function executeGuard(routeData: any = {}): boolean {
    const routeSnapshot = { data: routeData } as unknown as ActivatedRouteSnapshot;
    const stateSnapshot = {} as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => authGuard(routeSnapshot, stateSnapshot)) as boolean;
  }

  it('AC-4: should redirect unauthenticated users to login', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    const result = executeGuard();

    expect(result).toBeFalse();
    expect(mockAuthService.clearSession).toHaveBeenCalled();
  });

  it('AC-4: should allow access when role matches', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.currentRole.and.returnValue('doctor');

    const result = executeGuard({ role: 'doctor' });
    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('AC-4: should redirect to /forbidden when role mismatches (e.g. Patient accessing Doctor route)', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.currentRole.and.returnValue('patient');

    const result = executeGuard({ role: 'doctor' });
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forbidden']);
  });

  it('AC-4: should redirect to /forbidden when required permission is missing', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.currentRole.and.returnValue('doctor');
    mockAuthService.hasPermission.and.returnValue(false);

    const result = executeGuard({ role: 'doctor', permission: 'admin_audit' });
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forbidden']);
  });
});
