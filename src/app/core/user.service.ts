import { Injectable } from '@angular/core';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
/**
 * @description Servicio de dominio para operaciones sobre usuarios
 * (registro, actualización de perfil y cambio de contraseña) utilizando
 * `AuthRepository` como fuente de datos y un caché en memoria cargado desde `localStorage`.
 * @usageNotes
 * Inyéctalo en componentes que necesiten manipular datos de usuario
 * fuera del flujo de login (por ejemplo, formularios de registro, perfil o cambio de contraseña).
 * Evita acceder directamente a `localStorage`; usa este servicio o `AuthService`.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  // 1. CACHE EN MEMORIA: Se carga una sola vez
  private usuariosLista: Usuario[] = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
  constructor(private repo: AuthRepository, private authSrv: AuthService) {}

  /**
   * @description Registra un nuevo usuario en el sistema a través del repositorio
   * y, si la operación tiene éxito, sincroniza también el caché en memoria.
   * @param data Objeto `Usuario` con todos los datos que se van a persistir.
   * @returns `true` si el usuario se registró correctamente;
   * `false` si ya existía un usuario con el mismo correo u ocurrió un error en el repositorio.
   * @usageNotes
   * Pensado para ser llamado desde el formulario de registro.
   * Este método solo registra; no inicia sesión automáticamente.
   * Para iniciar sesión después del registro, usa `AuthService.login`.
   */

  // ACTUALIZACIÓN: Debe sincronizar el CACHÉ
  registrarUsuario(data: Usuario): boolean {
    const ok = this.repo.registrar(data);
    if (ok) {
      // Si el registro fue exitoso, agregamos el nuevo usuario al caché
      this.usuariosLista.push(data);
    }
    return ok;
  }

  /**
   * @description Actualiza los datos de perfil de un usuario existente en el repositorio
   * y, si la actualización es exitosa, también refresca la sesión actual en `AuthService`.
   * @param data Objeto `Usuario` con los datos actualizados que se desean persistir.
   * @returns `true` si se actualizó un usuario existente; `false` si no se encontró el usuario
   * o la actualización falló en el repositorio.
   * @usageNotes
   * Úsalo desde formularios de edición de perfil.
   * Asume que `data` contiene un usuario válido y coherente con el ya almacenado.
   */

  actualizarPerfil(data: Usuario): boolean {
    const ok = this.repo.actualizar(data);
    if (ok) {
      this.authSrv['guardarSesion'](data);
    }
    return ok;
  }

  /**
   * @description Cambia la contraseña de un usuario en el repositorio
   * y sincroniza la nueva contraseña en el caché en memoria.
   * @param correo Correo del usuario cuya contraseña se va a actualizar.
   * @param nueva Nueva contraseña en texto plano que se almacenará.
   * @returns `true` si la contraseña se actualizó correctamente;
   * `false` si no se encontró el usuario o la operación falló.
   * @usageNotes
   * Normalmente se combina con validaciones en el formulario:
   * - `validarClaveActual` para comprobar la clave actual.
   * - Un validador de coincidencia para la repetición de la nueva clave.
   */
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

  /**
   * @description Verifica que la contraseña proporcionada coincida con la que
   * tiene el usuario en el caché de memoria.
   * @param correo Correo del usuario cuya contraseña se quiere validar.
   * @param clave Contraseña actual introducida por el usuario.
   * @returns `true` si la contraseña coincide con la almacenada;
   * `false` si no coincide o no existe un usuario con ese correo.
   * @usageNotes
   * Úsalo en formularios de "cambiar contraseña" para validar la clave actual
   * antes de permitir el cambio.
   */
  // REFACTORIZADO: Usa el caché en memoria
  validarClaveActual(correo: string, clave: string): boolean {
    // Usa this.usuariosLista en lugar de leer localStorage
    const user = this.usuariosLista.find((u: Usuario) => u.correo === correo);
    return user?.clave === clave;
  }

  /**
   * @description Busca un usuario en el caché en memoria por su correo electrónico.
   * @param correo Correo electrónico del usuario que se quiere localizar.
   * @returns El objeto `Usuario` si se encuentra en el caché; `null` si no existe.
   * @usageNotes
   * Método pensado para lecturas rápidas desde memoria.
   * Si el caché no está sincronizado con el almacenamiento persistente,
   * el resultado puede no reflejar el último estado guardado.
   */
  // REFACTORIZADO: Usa el caché en memoria
  buscarPorCorreo(correo: string): Usuario | null {
    // Usa this.usuariosLista en lugar de leer localStorage
    return this.usuariosLista.find((u: Usuario) => u.correo === correo) ?? null;
  }
}
