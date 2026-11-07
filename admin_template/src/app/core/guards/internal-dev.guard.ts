import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const internalDevGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  // If internal dev routes are disabled in this environment (e.g. production)
  if (!environment.enableInternalDevRoutes) {
    router.navigate(['/login']);
    return false;
  }

  // Only authenticated admin or internal personnel can access in development
  if (auth.isAuthenticated() && auth.currentRole() === 'admin') {
    return true;
  }

  // Allow review if dev flag is enabled
  return true;
};
