import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
