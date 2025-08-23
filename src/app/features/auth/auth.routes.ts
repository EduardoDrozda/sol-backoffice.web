import { Routes } from "@angular/router";
import { RoutesEnum } from "@core/enums/routes.enum";

export const authRoutes: Routes = [
  {
    path: RoutesEnum.SIGN_IN,
    loadComponent: () => import('./pages/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: RoutesEnum.CONFIRM_EMAIL,
    loadComponent: () => import('./pages/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent)
  },
  {
    path: RoutesEnum.FORGOT_PASSWORD,
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: RoutesEnum.RESET_PASSWORD,
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
];
