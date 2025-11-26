import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
/**
 *   Factoría de guards que restringen el acceso por rol de usuario.
 * @param roleRequerido Rol necesario para acceder a la ruta (p. ej. `'admin'`).
 * @returns Función guard que valida la sesión y el rol; retorna `true` si
 * el usuario cumple el rol, `false` en caso contrario y navega a una ruta segura.
 * @usageNotes
 * ```ts
 * {
 *   path: 'admin',
 *   canActivate: [RoleGuard('admin')],
 *   loadComponent: ...
 * }
 * ```
 */
export const RoleGuard = (roleRequerido: string) => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.getUsuarioActual();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (user.rol !== roleRequerido) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};
