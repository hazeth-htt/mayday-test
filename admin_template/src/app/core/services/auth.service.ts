import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthApiService } from '../../../api/services/auth/auth-api.service';
import { AuthUserInfo, LoginResponseData } from '../../../api/types';

export interface AuthUser {
  id: string | number;
  full_name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'doctor' | 'patient';
  permissions?: string[];
  avatar?: string;
}

function mapRoleIdToRole(roleId: number | string): 'admin' | 'doctor' | 'patient' {
  const r = String(roleId).toLowerCase();
  if (r === '1' || r.includes('admin')) return 'admin';
  if (r === '2' || r.includes('doctor')) return 'doctor';
  return 'patient';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private authApi = inject(AuthApiService);

  private _currentUser = signal<AuthUser | null>(this.loadFromStorage());

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);
  currentRole = computed(() => this._currentUser()?.role ?? null);

  loginWithApi(phone: string, password: string): Observable<LoginResponseData> {
    return this.authApi.login({ phone, password }).pipe(
      tap((res) => {
        const role = mapRoleIdToRole(res.user_info.role_id);
        const user: AuthUser = {
          id: res.user_info.user_id,
          full_name: res.user_info.full_name,
          phone: res.user_info.phone,
          role,
          permissions: res.user_info.permissions || [],
        };
        this._currentUser.set(user);
        localStorage.setItem('drmayday_token', res.token);
        localStorage.setItem('drmayday_user', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.authApi.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  clearSession() {
    this._currentUser.set(null);
    localStorage.removeItem('drmayday_token');
    localStorage.removeItem('drmayday_user');
    this.router.navigate(['/login']);
  }

  hasPermission(permName: string): boolean {
    const user = this._currentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permName) ?? false;
  }

  navigateToDashboard() {
    const role = this.currentRole();
    if (role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'doctor') this.router.navigate(['/doctor/queue']);
    else if (role === 'patient') this.router.navigate(['/patient/home']);
    else this.router.navigate(['/login']);
  }

  private loadFromStorage(): AuthUser | null {
    try {
      const stored = localStorage.getItem('drmayday_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
