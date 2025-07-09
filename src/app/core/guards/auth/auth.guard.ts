import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkToken().subscribe({
    next: (res) => {
      if (res.result) {
        return true;
      }

      router.navigate(['/sign-in']);

      return false;
    }
  })

  return true;
};
