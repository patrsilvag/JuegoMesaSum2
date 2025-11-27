import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthErrorService } from './auth-error.service';

/**
 * Tipo de resultado devuelto por AuthService.login
 */
export type LoginResultado = { ok: true; usuario: Usuario } | { ok: false; mensaje: string };

/**
 * Servicio de alto nivel para autenticación de usuarios.
 * Gestiona el estado de sesión en memoria y en `localStorage`.
 * @usageNotes
 * - Inyéctalo en guards y componentes que necesiten saber quién está logueado.
 * - Usa `usuarioActual$` para reaccionar a cambios de sesión.
 */

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Fuente de verdad para el usuario actualmente autenticado.
   * Emite `null` si no hay sesión activa.
   */
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  /**
   * Observable que permite a los componentes suscribirse
   * a los cambios de sesión del usuario.
   */
  usuarioActual$ = this.usuarioActual.asObservable();

  /**
   * Inicializa el servicio cargando el usuario persistido (si existe).
   * @param repo Repositorio de usuarios (acceso a almacenamiento).
   * @param err Servicio de mensajes de error para autenticación.
   */
  constructor(private repo: AuthRepository, private err: AuthErrorService) {
    this.cargarUsuarioActual();
  }

  /**
   * Carga el usuario actual desde `localStorage` y actualiza el `BehaviorSubject`.
   * @returns Nada (`void`).
   * @usageNotes
   * Normalmente solo se invoca desde el constructor.
   */
  private cargarUsuarioActual() {
    const raw = localStorage.getItem('usuarioActual');
    this.usuarioActual.next(raw ? JSON.parse(raw) : null);
  }

  /**
   * Persiste o limpia la sesión de usuario en `localStorage`
   * y actualiza el estado observable.
   * @param u Usuario autenticado o `null` para cerrar sesión.
   * @returns Nada (`void`).
   */
  private guardarSesion(u: Usuario | null) {
    if (u) {
      localStorage.setItem('usuarioActual', JSON.stringify(u));
    } else {
      localStorage.removeItem('usuarioActual');
    }
    this.usuarioActual.next(u);
  }

  /**
   * Devuelve el usuario actualmente autenticado.
   * @returns El usuario actual o `null` si no hay sesión.
   * @usageNotes
   * Para observar cambios en tiempo real, usa mejor `usuarioActual$`.
   */
  getUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }

  /**
   * Intenta autenticar al usuario con correo y clave.
   * @param correo Correo electrónico del usuario.
   * @param clave Contraseña en texto plano.
   * @returns
   * - `{ ok: true, usuario }` si las credenciales son correctas.
   * - `{ ok: false, mensaje }` si las credenciales son inválidas o hay un error.
   * @usageNotes
   * ```ts
   * const res = this.auth.login(correo, clave);
   * if (!res.ok) {
   *   this.errorMensaje = res.mensaje;
   * }
   * ```
   */
  login(correo: string, clave: string): LoginResultado {
    try {
      const email = correo.trim();
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

  /**
   * @description Cierra la sesión del usuario actual y limpia la información persistida.
   * @returns Nada (`void`). // Compodoc debería reconocer esto, si no, usa @returns {void}
   * @usageNotes
   * Úsalo desde botones de "Cerrar sesión" o guards cuando invalida sesión.
   */
  logout() {
    this.guardarSesion(null);
  }
}
