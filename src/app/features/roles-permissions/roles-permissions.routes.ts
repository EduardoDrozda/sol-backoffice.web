import { Routes } from "@angular/router";

export const rolesPermissionsRoutes: Routes = [
  {
    path: 'roles',
    loadComponent: () => import('./pages/role-list/role-list.component').then(m => m.RoleListComponent)
  },
  {
    path: 'permissions',
    loadComponent: () => import('./pages/permission-list/permission-list.component').then(m => m.PermissionListComponent)
  }
];
