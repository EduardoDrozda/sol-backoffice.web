import { Routes } from "@angular/router";

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./pages/sign-in/sign-in.component').then(m => m.SignInComponent)
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent)
      }
    ]
  }
];
