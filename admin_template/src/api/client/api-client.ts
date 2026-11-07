import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/common.types';
import { AppError } from '../../lib/errors/app-error';
import { getErrorMessageByCode } from '../../lib/errors/error-codes';

export interface RequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  withCredentials?: boolean;
  skipAuth?: boolean;
  retryCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly baseUrl = environment.apiUrl || '/api';

  get<T>(endpoint: string, options: RequestOptions = {}): Observable<T> {
    const url = this.resolveUrl(endpoint);
    const headers = this.buildHeaders(options);
    const params = options.params;
    const retryCount = options.retryCount ?? 1; // Idempotent GET retries once on network failure

    return this.http.get<ApiResponse<T>>(url, { headers, params }).pipe(
      retry(retryCount),
      map((res) => this.unwrapResponse<T>(res)),
      catchError((err) => this.handleError(err))
    );
  }

  post<T>(endpoint: string, body: unknown = {}, options: RequestOptions = {}): Observable<T> {
    const url = this.resolveUrl(endpoint);
    const headers = this.buildHeaders(options);
    const params = options.params;

    return this.http.post<ApiResponse<T>>(url, body, { headers, params }).pipe(
      map((res) => this.unwrapResponse<T>(res)),
      catchError((err) => this.handleError(err))
    );
  }

  put<T>(endpoint: string, body: unknown = {}, options: RequestOptions = {}): Observable<T> {
    const url = this.resolveUrl(endpoint);
    const headers = this.buildHeaders(options);
    const params = options.params;

    return this.http.put<ApiResponse<T>>(url, body, { headers, params }).pipe(
      map((res) => this.unwrapResponse<T>(res)),
      catchError((err) => this.handleError(err))
    );
  }

  patch<T>(endpoint: string, body: unknown = {}, options: RequestOptions = {}): Observable<T> {
    const url = this.resolveUrl(endpoint);
    const headers = this.buildHeaders(options);
    const params = options.params;

    return this.http.patch<ApiResponse<T>>(url, body, { headers, params }).pipe(
      map((res) => this.unwrapResponse<T>(res)),
      catchError((err) => this.handleError(err))
    );
  }

  delete<T>(endpoint: string, options: RequestOptions = {}): Observable<T> {
    const url = this.resolveUrl(endpoint);
    const headers = this.buildHeaders(options);
    const params = options.params;

    return this.http.delete<ApiResponse<T>>(url, { headers, params }).pipe(
      map((res) => this.unwrapResponse<T>(res)),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Post multipart form data (File uploads)
   */
  upload<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Observable<T> {
    const url = this.resolveUrl(endpoint);
    let headers = this.buildHeaders(options);
    // Don't set Content-Type header so browser sets multipart boundary automatically

    return this.http.post<ApiResponse<T>>(url, formData, { headers }).pipe(
      map((res) => this.unwrapResponse<T>(res)),
      catchError((err) => this.handleError(err))
    );
  }

  private resolveUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  private buildHeaders(options: RequestOptions): HttpHeaders {
    let headers = new HttpHeaders();

    if (!options.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (options.headers) {
      if (options.headers instanceof HttpHeaders) {
        const httpHeaders = options.headers as HttpHeaders;
        httpHeaders.keys().forEach((k) => {
          const val = httpHeaders.get(k);
          if (val !== null) {
            headers = headers.set(k, val);
          }
        });
      } else {
        Object.entries(options.headers).forEach(([k, v]) => {
          headers = headers.set(k, v);
        });
      }
    }

    return headers;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('drmayday_token') || null;
  }

  private unwrapResponse<T>(res: ApiResponse<T>): T {
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === '1000' || res.code === '1001') {
        return res.data;
      }
      throw new AppError({
        code: res.code,
        message: getErrorMessageByCode(res.code, res.message),
        raw: res,
      });
    }
    return res as unknown as T;
  }

  private handleError(err: unknown): Observable<never> {
    if (err instanceof AppError) {
      return throwError(() => err);
    }

    if (err instanceof HttpErrorResponse) {
      // 401 Unauthorized: Session expired or invalid
      if (err.status === 401) {
        localStorage.removeItem('drmayday_token');
        localStorage.removeItem('drmayday_user');
        this.router.navigate(['/login']);
        const appErr = new AppError({
          code: '3002',
          message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
          status: 401,
          raw: err,
        });
        return throwError(() => appErr);
      }

      // Check if backend returned structured error envelope
      if (err.error && typeof err.error === 'object' && 'code' in err.error) {
        const backendCode = String(err.error.code);
        const appErr = new AppError({
          code: backendCode,
          message: getErrorMessageByCode(backendCode, err.error.message),
          status: err.status,
          raw: err.error,
        });
        return throwError(() => appErr);
      }

      const appErr = new AppError({
        code: String(err.status),
        message: err.status === 0
          ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.'
          : err.statusText || 'Lỗi kết nối máy chủ.',
        status: err.status,
        raw: err,
      });
      return throwError(() => appErr);
    }

    return throwError(() => AppError.fromUnknown(err));
  }
}
