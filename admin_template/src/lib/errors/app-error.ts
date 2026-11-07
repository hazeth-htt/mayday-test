export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fieldErrors: Record<string, string>;
  readonly raw?: unknown;

  constructor(options: {
    code: string | number;
    message: string;
    status?: number;
    fieldErrors?: Record<string, string>;
    raw?: unknown;
  }) {
    super(options.message);
    this.name = 'AppError';
    this.code = String(options.code);
    this.status = options.status ?? 400;
    this.fieldErrors = options.fieldErrors ?? {};
    this.raw = options.raw;
  }

  isUnauthorized(): boolean {
    return this.status === 401 || ['3001', '3002', '3003'].includes(this.code);
  }

  isForbidden(): boolean {
    return this.status === 403 || this.code.startsWith('31');
  }

  isNotFound(): boolean {
    return this.status === 404 || ['3007', '4001', '4101', '6005', '7001', '7002', '7003', '8103', '9102'].includes(this.code);
  }

  isValidation(): boolean {
    return this.status === 422 || this.code.startsWith('20') || Object.keys(this.fieldErrors).length > 0;
  }

  isDuplicate(): boolean {
    return ['3006', '4102', '5002', '6006', '8003'].includes(this.code);
  }

  static fromUnknown(err: unknown): AppError {
    if (err instanceof AppError) return err;
    if (typeof err === 'object' && err !== null && 'code' in err) {
      const e = err as { code: string | number; message?: string; status?: number; data?: any };
      return new AppError({
        code: e.code,
        message: e.message || 'Đã có lỗi xảy ra trong quá trình xử lý.',
        status: e.status,
        raw: err,
      });
    }
    return new AppError({
      code: '9901',
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
      status: 500,
      raw: err,
    });
  }
}
