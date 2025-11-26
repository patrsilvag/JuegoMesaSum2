import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/global-error-handler';
/**
 *   Configuración principal de la aplicación Angular: rutas,
 * detección de cambios y manejador global de errores.
 * @usageNotes
 * Se pasa directamente a `bootstrapApplication(AppComponent, appConfig)`.
 * ```ts
 * bootstrapApplication(AppComponent, appConfig);
 * ```
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // ⬇️ Registro del manejador global de errores
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
