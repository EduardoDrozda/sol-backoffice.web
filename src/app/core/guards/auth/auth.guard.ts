import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from '@shared/modules/toast/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  authService.checkToken().subscribe({
    next: (res) => {
      if (res.result) {
        return true;
      }

      toast.showError('Sessão expirada');
      router.navigate(['/sign-in']);

      return false;
    }
  })

  return true;
};
