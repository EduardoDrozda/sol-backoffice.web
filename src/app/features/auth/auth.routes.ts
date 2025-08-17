import { Routes } from "@angular/router";
import { RoutesEnum } from "@core/enums/routes.enum";

export const authRoutes: Routes = [
  {
    path: RoutesEnum.SIGN_IN,
    loadComponent: () => import('./pages/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
];
