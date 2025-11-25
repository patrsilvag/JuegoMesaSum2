import { ErrorHandler, Injectable } from '@angular/core';
/**
 * @description Implementación de `ErrorHandler` para capturar errores globales
 * de Angular.
 * @usageNotes
 * Registrado en `app.config.ts` como manejador global.
 * Aquí solo se hace `console.error`, pero se puede extender
 * para reportar a servicios externos (Sentry, etc.).
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  /**
   * @description Método de Angular llamado cuando ocurre un error no capturado.
   * @param error Error original lanzado en la aplicación.
   * @returns Nada (`void`), pero deja trazas en consola/log.
   */
  handleError(error: any): void {
    console.error('🚨 Error global capturado:', error);
  }
}
