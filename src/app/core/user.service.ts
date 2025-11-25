import { Injectable } from '@angular/core';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  // 1. CACHE EN MEMORIA: Se carga una sola vez
  private usuariosLista: Usuario[] = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
  constructor(private repo: AuthRepository, private authSrv: AuthService) {}

  // ACTUALIZACIÓN: Debe sincronizar el CACHÉ
  registrarUsuario(data: Usuario): boolean {
    const ok = this.repo.registrar(data);
    if (ok) {
      // Si el registro fue exitoso, agregamos el nuevo usuario al caché
      this.usuariosLista.push(data);
    }
    return ok;
  }
  actualizarPerfil(data: Usuario): boolean {
    const ok = this.repo.actualizar(data);
    if (ok) {
      this.authSrv['guardarSesion'](data);
    }
    return ok;
  }

  // ACTUALIZACIÓN: Debe sincronizar el CACHÉ
  cambiarClave(correo: string, nueva: string): boolean {
    const ok = this.repo.cambiarClave(correo, nueva);
    if (ok) {
      // Si el cambio de clave fue exitoso, actualizamos la clave en el caché
      const user = this.usuariosLista.find((u) => u.correo === correo);
      if (user) {
        user.clave = nueva;
      }
    }
    return ok;
  }

  // REFACTORIZADO: Usa el caché en memoria
  validarClaveActual(correo: string, clave: string): boolean {
    // Usa this.usuariosLista en lugar de leer localStorage
    const user = this.usuariosLista.find((u: Usuario) => u.correo === correo);
    return user?.clave === clave;
  }

  // REFACTORIZADO: Usa el caché en memoria
  buscarPorCorreo(correo: string): Usuario | null {
    // Usa this.usuariosLista en lugar de leer localStorage
    return this.usuariosLista.find((u: Usuario) => u.correo === correo) ?? null;
  }
}
