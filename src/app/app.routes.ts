import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { authRoutes } from '@features/auth/auth.routes';
import { dashboardRoutes } from '@features/dashboard/dashboard.routes';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    loadComponent: () => import('@core/layouts/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      ...dashboardRoutes
    ],
    canActivate: [authGuard]
  }
];
