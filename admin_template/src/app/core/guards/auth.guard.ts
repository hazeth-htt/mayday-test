import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('drmayday_token');
  if (!auth.isAuthenticated() || !token) {
    auth.clearSession();
    return false;
  }

  const requiredRole = route.data?.['role'] as string | undefined;
  if (requiredRole && auth.currentRole() !== requiredRole) {
    router.navigate(['/forbidden']);
    return false;
  }

  const requiredPermission = route.data?.['permission'] as string | undefined;
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};
