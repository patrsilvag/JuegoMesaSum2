import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
/**
 * @description Punto de entrada de la aplicación. Realiza el bootstrap de Angular
 * con el componente raíz y la configuración global.
 * @usageNotes
 * Normalmente no se modifica salvo para añadir providers globales.
 */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
