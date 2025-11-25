import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
/**
 * @description Conjunto de rutas principales de la aplicación.
 * Define navegación pública, protegida por autenticación y restringida por rol.
 * @usageNotes
 * Se registra en `app.config.ts` a través de `provideRouter(routes)`.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.RegistroComponent),
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/recuperar/recuperar').then((m) => m.RecuperarComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil').then((m) => m.PerfilComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.CarritoComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'categoria/:id',
    loadComponent: () => import('./pages/categoria/categoria').then((m) => m.CategoriaComponent),
  },
  // CATEGORÍAS
  {
    path: 'categorias/:slug',
    loadComponent: () => import('./pages/categoria/categoria').then((m) => m.CategoriaComponent),
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categoria/categoria.routes').then((m) => m.categoriaRoutes),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminComponent),
    canActivate: [RoleGuard('admin')],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
