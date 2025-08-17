import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';
import { authRoutes } from '@features/auth/auth.routes';
import { dashboardRoutes } from '@features/dashboard/dashboard.routes';
import { userRoutes } from '@features/user/user.routes';
import { rolesPermissionsRoutes } from '@features/roles-permissions/roles-permissions.routes';
import { RoutesEnum } from '@core/enums/routes.enum';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    loadComponent: () => import('@core/layouts/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: RoutesEnum.DASHBOARD,
        pathMatch: 'full'
      },
      ...dashboardRoutes,
      ...userRoutes,
      ...rolesPermissionsRoutes
    ],
    canActivate: [authGuard]
  }
];
