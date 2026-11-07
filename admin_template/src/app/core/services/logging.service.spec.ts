import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';

describe('LoggingService (T-003 Zero-PII Sanitize & Audit)', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  it('AC-1: should redact Vietnam phone numbers in text', () => {
    const raw = 'Bệnh nhân Trần Thị Lan, SĐT 0988776655 đã khai báo phiếu khám.';
    const sanitized = service.sanitize(raw);
    expect(sanitized).toBe('Bệnh nhân Trần Thị Lan, SĐT 098****655 đã khai báo phiếu khám.');
  });

  it('AC-1: should redact BHYT insurance numbers in text', () => {
    const raw = 'Thẻ bảo hiểm: GD4010123456789 hợp lệ';
    const sanitized = service.sanitize(raw);
    expect(sanitized).toBe('Thẻ bảo hiểm: GD40*******6789 hợp lệ');
  });

  it('AC-1: should redact Bearer authorization tokens', () => {
    const raw = 'Header Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz';
    const sanitized = service.sanitize(raw);
    expect(sanitized).toContain('Bearer [REDACTED_TOKEN]');
    expect(sanitized).not.toContain('eyJhbGciOi');
  });

  it('AC-1: should recursively redact sensitive keys in nested objects', () => {
    const payload = {
      username: 'doctor_hung',
      password: 'SuperSecretPassword@123',
      nested: {
        token: 'secret_jwt_token',
        phone: '0912345678',
      },
    };

    const sanitized = service.sanitize(payload);
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.nested.token).toBe('[REDACTED]');
    expect(sanitized.nested.phone).toBe('091****678');
  });
});
