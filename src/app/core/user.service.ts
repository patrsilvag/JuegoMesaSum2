import { Injectable } from '@angular/core';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private repo: AuthRepository, private authSrv: AuthService) {}

  registrarUsuario(data: Usuario): boolean {
    return this.repo.registrar(data);
  }

  actualizarPerfil(data: Usuario): boolean {
    const ok = this.repo.actualizar(data);
    if (ok) {
      this.authSrv['guardarSesion'](data);
    }
    return ok;
  }

  cambiarClave(correo: string, nueva: string): boolean {
    return this.repo.cambiarClave(correo, nueva);
  }

  validarClaveActual(correo: string, clave: string): boolean {
    const lista = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
    const user = lista.find((u: Usuario) => u.correo === correo);
    return user?.clave === clave;
  }
  buscarPorCorreo(correo: string): Usuario | null {
    const lista = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
    return lista.find((u: Usuario) => u.correo === correo) ?? null;
  }
}
