import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../client/api-client';
import { LoginRequest, LoginResponseData, SignupRequest, SignupResponseData } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private api = inject(ApiClient);

  login(payload: LoginRequest): Observable<LoginResponseData> {
    return this.api.post<LoginResponseData>('auth/login', payload, { skipAuth: true });
  }

  signup(payload: SignupRequest): Observable<SignupResponseData> {
    return this.api.post<SignupResponseData>('auth/signup', payload, { skipAuth: true });
  }

  logout(): Observable<Record<string, never>> {
    return this.api.post<Record<string, never>>('auth/logout', {});
  }

  forgotPassword(phone: string): Observable<Record<string, never>> {
    return this.api.post<Record<string, never>>('auth/forgot_password', { phone }, { skipAuth: true });
  }

  resetPassword(payload: { phone: string; otp: string; new_password: string; confirm_password: string }): Observable<Record<string, never>> {
    return this.api.post<Record<string, never>>('auth/reset_password', payload, { skipAuth: true });
  }
}
