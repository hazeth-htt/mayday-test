import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IdleTimeoutService } from './idle-timeout.service';
import { AuthService } from './auth.service';

describe('IdleTimeoutService (T-004 Hospital Session Guard)', () => {
  let service: IdleTimeoutService;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'currentRole',
      'logout',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(IdleTimeoutService);
  });

  afterEach(() => {
    service.stopMonitoring();
  });

  it('AC-2: should not start monitoring if user is not doctor or admin', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.currentRole.and.returnValue('patient');

    service.startMonitoring();
    expect(service.isWarningOpen()).toBeFalse();
  });

  it('AC-1 & AC-3: should trigger warning after idle limit approaches', fakeAsync(() => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.currentRole.and.returnValue('doctor');

    service.startMonitoring();
    expect(service.isWarningOpen()).toBeFalse();

    // Fast-forward 14 minutes (840,000 ms)
    tick(14 * 60 * 1000);

    expect(service.isWarningOpen()).toBeTrue();
    expect(service.countdownSeconds()).toBe(60);

    // Click stay logged in
    service.stayLoggedIn();
    expect(service.isWarningOpen()).toBeFalse();

    service.stopMonitoring();
  }));

  it('AC-4: should auto-logout when countdown reaches 0 without response', fakeAsync(() => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.currentRole.and.returnValue('admin');

    service.startMonitoring();

    // Fast forward to warning
    tick(14 * 60 * 1000);
    expect(service.isWarningOpen()).toBeTrue();

    // Fast forward countdown (60 seconds)
    tick(60 * 1000);

    expect(mockAuthService.logout).toHaveBeenCalled();
    service.stopMonitoring();
  }));
});
