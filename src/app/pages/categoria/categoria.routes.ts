import { Routes } from '@angular/router';

export const categoriaRoutes: Routes = [
  {
    path: ':slug',
    loadComponent: () => import('./categoria').then((m) => m.CategoriaComponent),
  },
];
