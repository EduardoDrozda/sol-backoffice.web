import { Routes } from "@angular/router";

export const userRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent)
      }
    ]
  },
];
