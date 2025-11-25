/**
 * @description Modelo de usuario utilizado en todo el dominio de autenticación.
 * Incluye datos básicos, credenciales y rol.
 * @usageNotes
 * - `rol` distingue entre usuario administrador y cliente.
 * - `status` permite desactivar cuentas sin borrarlas.
 * - Por seguridad, evita exponer la propiedad `clave` en la UI.
 */
export interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  fechaNacimiento: string;
  direccion?: string;
  clave: string;
  rol: 'admin' | 'cliente';
  status?: 'active' | 'inactive' /** Indicador de si el usuario está activo o desactivado */;
}
