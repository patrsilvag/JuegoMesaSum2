/**
 * @description Modelo de usuario utilizado en todo el dominio de autenticación.
 * Incluye datos básicos, credenciales y rol.
 * @usageNotes
 * - `rol` distingue entre usuario administrador y cliente.
 * - `status` permite desactivar cuentas sin borrarlas.
 * - Por seguridad, evita exponer la propiedad `clave` en la UI.
 */
export interface Usuario {
  /** Nombre completo del usuario mostrado en la interfaz. */
  nombre: string;

  /** Nombre de usuario (alias) visible en la aplicación. */
  usuario: string;

  /** Correo electrónico único usado para autenticación y contacto. */
  correo: string;

  /** Fecha de nacimiento en formato ISO (por ejemplo, `YYYY-MM-DD`). */
  fechaNacimiento: string;

  /** Dirección postal opcional (envíos, facturación, etc.). */
  direccion?: string;

  /**
   * Contraseña del usuario.
   * ⚠ No debería persistirse en texto plano en un sistema real.
   */
  clave: string;

  /** Rol del usuario dentro de la aplicación. */
  rol: 'admin' | 'cliente';

  /** Indicador de si el usuario está activo o desactivado. */
  status?: 'active' | 'inactive';
}
