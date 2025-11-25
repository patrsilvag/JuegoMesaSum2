import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
/**
 * @description Guard que restringe el acceso a rutas solo a usuarios autenticados.
 * @returns `true` si hay un usuario autenticado; `false` y redirige a `/login` en caso contrario.
 * @usageNotes
 * Asigna esta función en `canActivate` de las rutas que requieran sesión.
 */
export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUsuarioActual();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
