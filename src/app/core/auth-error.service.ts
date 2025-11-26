import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
/**
 *   Servicio centralizado para construir mensajes de error
 * relacionados con autenticación y formularios de usuario.
 * @usageNotes
 * Inyéctalo en componentes, validadores o servicios que necesiten
 * mensajes homogéneos de error.
 * ```ts
 * constructor(private authErr: AuthErrorService) {}
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AuthErrorService {
  // ============================
  // Mensajes básicos reutilizables
  // ============================

  /**
   *   Mensaje genérico para credenciales inválidas.
   * @returns Texto listo para mostrar al usuario.
   */
  credencialesInvalidas(): string {
    return 'Correo o contraseña incorrecta.';
  }

  /**
   *   Mensaje para cuando no existe un usuario con el correo dado.
   * @returns Cadena explicando que el correo no está registrado.
   */
  usuarioNoExiste(): string {
    return 'No existe una cuenta registrada con este correo.';
  }

  /**
   *   Mensaje para contraseña actual incorrecta.
   * @returns Texto de error para credencial incorrecta.
   */
  claveIncorrecta(): string {
    return 'La contraseña actual no es correcta.';
  }

  /**
   *   Mensaje para cuando las contraseñas nuevas no coinciden.
   * @returns Texto de error indicando la discrepancia.
   */
  clavesNoCoinciden(): string {
    return 'Las contraseñas no coinciden.';
  }

  /**
   *   Mensaje para código de verificación inválido o expirado.
   * @returns Texto genérico de código inválido.
   */
  codigoInvalido(): string {
    return 'El código ingresado no es válido.';
  }

  /**
   *   Mensaje para formularios con campos inválidos en general.
   * @returns Texto genérico de campos inválidos.
   */
  camposInvalidos(): string {
    return 'Revisa los campos obligatorios.';
  }

  /**
   *   Mensaje genérico para errores inesperados no controlados.
   * @returns Cadena estándar de error inesperado.
   */
  errorInesperado(): string {
    return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
  }

  // ============================
  // NUEVO: Lógica de error para Fecha de Nacimiento
  // ============================
  /**
   *   Genera un mensaje de error específico para un control de fecha
   * (por ejemplo, fecha de nacimiento).
   * @param control Control de formulario que contiene el valor y los errores.
   * @returns Mensaje de error de fecha o cadena vacía si no hay error relevante.
   * @usageNotes
   * Útil para encapsular la lógica de presentación de errores de fecha.
   */
  getFechaErrorMessage(control: AbstractControl): string {
    if (!control.errors) return '';

    // Prioridad 1: Requerido
    if (control.errors['required']) return 'La fecha es obligatoria.';

    // Prioridad 2: Fecha Futura
    if (control.errors['fechaFutura']) return 'La fecha no puede ser futura.';

    // Prioridad 3: Edad Mínima
    if (control.errors['edadMinima']) return 'Debes tener al menos 13 años.';

    return '';
  }

  // ============================
  // Mapeo basado en códigos
  // ============================
  /**
   *   Devuelve el mensaje legible asociado a un código de error de negocio.
   * @param codigo Código simbólico de error (p. ej. `'USUARIO_NO_EXISTE'`).
   * @returns Mensaje listo para mostrar en la interfaz.
   */
  getMensaje(codigo: string): string {
    switch (codigo) {
      case 'CREDENCIALES_INVALIDAS':
        return this.credencialesInvalidas();

      case 'USUARIO_NO_EXISTE':
        return this.usuarioNoExiste();

      case 'CLAVE_INCORRECTA':
        return this.claveIncorrecta();

      case 'CLAVES_NO_COINCIDEN':
        return this.clavesNoCoinciden();

      case 'CODIGO_INVALIDO':
        return this.codigoInvalido();

      case 'CAMPOS_INVALIDOS':
        return this.camposInvalidos();

      default:
        return this.errorInesperado();
    }
  }
}
