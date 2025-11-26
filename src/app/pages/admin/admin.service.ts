import { Injectable } from '@angular/core';
/**
 * Servicio de administración de usuarios.
 *
 * Expone operaciones simples para:
 * - Cargar una lista de usuarios administrables.
 * - Filtrar usuarios según distintos criterios.
 * - Alternar el estado activo/inactivo de un usuario.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  /**
   * Constructor del servicio de administración.
   * Actualmente no inyecta dependencias, pero se mantiene
   * para facilitar futuras extensiones.
   */
  constructor() {}
  /**
   * Carga la lista completa de usuarios administrables.
   *
   * @returns Arreglo de usuarios con sus campos básicos
   * (`correo`, `usuario`, `rol`, `status`).
   */
  cargarUsuarios() {
    return [
      { correo: 'admin@site.com', usuario: 'Admin', rol: 'admin', status: 'active' },
      { correo: 'user@site.com', usuario: 'User', rol: 'cliente', status: 'inactive' },
    ];
  }
  /**
   * Aplica filtros sobre una lista de usuarios.
   *
   * Criterios soportados:
   * - `correo`: hace un `includes` sobre el campo `correo`.
   * - `rol`: compara igualdad exacta contra `u.rol`.
   * - `estado`: compara igualdad exacta contra `u.status`.
   *
   * @param lista Lista completa de usuarios a filtrar.
   * @param filtros Objeto con posibles campos `correo`, `rol` y `estado`.
   * @returns Nueva lista con los usuarios que cumplen todos los filtros.
   */
  filtrarUsuarios(lista: any[], filtros: any) {
    const { correo, rol, estado } = filtros;

    return lista.filter(
      (u) =>
        (correo ? u.correo.includes(correo) : true) &&
        (rol ? u.rol === rol : true) &&
        (estado ? u.status === estado : true)
    );
  }
  /**
   * Alterna el estado de un usuario entre `'active'` e `'inactive'`.
   *
   * @param usuario Objeto de usuario cuyo campo `status` será modificado.
   * @returns El mismo objeto de usuario con el `status` actualizado.
   */
  toggleEstado(usuario: any) {
    usuario.status = usuario.status === 'active' ? 'inactive' : 'active';
    return usuario;
  }
}
