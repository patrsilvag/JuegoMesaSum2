import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from './auth';
/**
 * @description Repositorio de usuarios. Encapsula el acceso a `localStorage`
 * y las operaciones CRUD sobre la entidad `Usuario`.
 * @usageNotes
 * - No interactúes con `localStorage` directamente para usuarios.
 * - Usa este servicio desde otros servicios de dominio (p. ej. `AuthService`, `UserService`).
 */
@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private isBrowser: boolean;

  /**
   * @description Detecta si el código corre en navegador y, en ese caso,
   * inicializa un usuario administrador por defecto.
   * @param platformId Token interno de Angular para identificar la plataforma.
   */
  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) this.seedAdmin();
  }

  // ==========================================
  // CREAR ADMIN POR DEFECTO
  // ==========================================
  private seedAdmin() {
    const lista = this.listarUsuariosPrivado();
    if (lista.length > 0) return;

    const admin: Usuario = {
      nombre: 'Administrador',
      usuario: 'admin',
      correo: 'admin@local.com',
      fechaNacimiento: '1990-01-01',
      direccion: '',
      clave: 'Admin123!',
      rol: 'admin',
      status: 'active',
    };
    lista.push(admin);
    this.guardarUsuarios(lista);
  }

  // ==========================================
  // LOCALSTORAGE CRUD (privados)
  // ==========================================

  private listarUsuariosPrivado(): Usuario[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem('usuarios') ?? '[]');
  }

  private guardarUsuarios(lista: Usuario[]) {
    if (!this.isBrowser) return;
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }

  // ==========================================
  // MÉTODOS PÚBLICOS AGREGADOS
  // ==========================================
  /**
   * @description Devuelve la lista completa de usuarios almacenados.
   * @returns Arreglo de usuarios leídos desde almacenamiento.
   */
  listarUsuarios(): Usuario[] {
    return this.listarUsuariosPrivado();
  }

  /**
   * @description Cambia el estado (`active` / `inactive`) de un usuario.
   * @param correo Correo del usuario cuyo estado se actualizará.
   * @param estado Nuevo estado a aplicar.
   * @returns `true` si se actualizó correctamente, `false` si el usuario no existe.
   */
  actualizarEstado(correo: string, estado: 'active' | 'inactive'): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;

    lista[index].status = estado;
    this.guardarUsuarios(lista);
    return true;
  }

  // ==========================================
  // RESTO DE MÉTODOS EXISTENTES (sin cambios)
  // ==========================================
  /**
   * @description Registra un nuevo usuario en el sistema.
   * @param user Datos completos del usuario a registrar.
   * @returns `true` si se insertó, `false` si ya existía un usuario con el mismo correo.
   */

  registrar(user: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    if (lista.some((u) => u.correo === user.correo)) return false;

    lista.push(user);
    this.guardarUsuarios(lista);
    return true;
  }

  /**
   * @description Realiza el login verificando correo y clave contra la lista de usuarios.
   * @param correo Correo electrónico utilizado para autenticar.
   * @param clave Contraseña en texto plano introducida por el usuario.
   * @returns El usuario autenticado o `null` si las credenciales no son válidas.
   * @usageNotes
   * Normalmente no se usa directamente desde componentes, sino a través de `AuthService`.
   */
  login(correo: string, clave: string): Usuario | null {
    return (
      this.listarUsuariosPrivado().find((u) => u.correo === correo && u.clave === clave) ?? null
    );
  }

  /**
   * @description Actualiza los datos de un usuario existente.
   * @param data Objeto usuario con la información actualizada.
   * @returns `true` si se encontró y actualizó el usuario, `false` si no existe.
   */
  actualizar(data: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === data.correo);
    if (index === -1) return false;

    lista[index] = { ...lista[index], ...data, correo: lista[index].correo };
    this.guardarUsuarios(lista);
    return true;
  }

  /**
   * @description Cambia la contraseña de un usuario.
   * @param correo Correo del usuario a modificar.
   * @param nueva Nueva contraseña a establecer.
   * @returns `true` si se pudo actualizar la clave, `false` si el usuario no existe.
   */
  cambiarClave(correo: string, nueva: string): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;

    lista[index].clave = nueva;
    this.guardarUsuarios(lista);
    return true;
  }
}
