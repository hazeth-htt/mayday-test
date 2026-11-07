import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  avatar?: string;
}

const DEMO_ACCOUNTS: (AuthUser & { password: string })[] = [
  {
    id: 'u-admin-01',
    email: 'admin@drmayday.vn',
    password: 'Admin@123',
    full_name: 'Quản trị viên Hệ thống',
    role: 'admin',
  },
  {
    id: 'u-doc-01',
    email: 'dr.hung@drmayday.vn',
    password: 'Doctor@123',
    full_name: 'TS.BS. Nguyễn Văn Hùng',
    role: 'doctor',
  },
  {
    id: 'u-pat-01',
    email: 'nguyenmai@gmail.com',
    password: 'Patient@123',
    full_name: 'Nguyễn Thị Mai',
    role: 'patient',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<AuthUser | null>(this.loadFromStorage());

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);
  currentRole = computed(() => this._currentUser()?.role ?? null);

  constructor(private router: Router) {}

  login(email: string, password: string): { success: boolean; error?: string } {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );
    if (!account) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
    }
    const { password: _, ...user } = account;
    this._currentUser.set(user);
    localStorage.setItem('drmayday_user', JSON.stringify(user));
    return { success: true };
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('drmayday_user');
    this.router.navigate(['/login']);
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
