import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthErrorService } from './auth-error.service';

export type LoginResultado = { ok: true; usuario: Usuario } | { ok: false; mensaje: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$ = this.usuarioActual.asObservable();

  constructor(private repo: AuthRepository, private err: AuthErrorService) {
    this.cargarUsuarioActual();
  }

  private cargarUsuarioActual() {
    const raw = localStorage.getItem('usuarioActual');
    this.usuarioActual.next(raw ? JSON.parse(raw) : null);
  }

  private guardarSesion(u: Usuario | null) {
    if (u) {
      localStorage.setItem('usuarioActual', JSON.stringify(u));
    } else {
      localStorage.removeItem('usuarioActual');
    }
    this.usuarioActual.next(u);
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }

  login(correo: string, clave: string): LoginResultado {
    try {
      const email = correo.trim().toLowerCase();
      const pass = clave.trim();

      const usuario = this.repo.login(email, pass);

      if (!usuario) {
        return { ok: false, mensaje: this.err.credencialesInvalidas() };
      }

      this.guardarSesion(usuario);
      return { ok: true, usuario };
    } catch (error) {
      console.error('Error en AuthService.login():', error);
      return { ok: false, mensaje: this.err.errorInesperado() };
    }
  }

  logout() {
    this.guardarSesion(null);
  }
}
