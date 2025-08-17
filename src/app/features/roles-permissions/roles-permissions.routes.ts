import { Routes } from "@angular/router";

export const rolesPermissionsRoutes: Routes = [
  {
    path: 'roles',
    loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent)
  },
  {
    path: 'permissions',
    loadComponent: () => import('./pages/permissions/permissions.component').then(m => m.PermissionsComponent)
  }
];
