import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { authRoutes } from '@features/auth/auth.routes';
import { dashboardRoutes } from '@features/dashboard/dashboard.routes';
import { userRoutes } from '@features/user/user.routes';
import { rolesPermissionsRoutes } from '@features/roles-permissions/roles-permissions.routes';

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
      ...dashboardRoutes,
      ...userRoutes,
      ...rolesPermissionsRoutes
    ],
    canActivate: [authGuard]
  }
];
