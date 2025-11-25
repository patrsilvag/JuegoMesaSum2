import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { ToastComponent } from './shared/toast/toast';
/**
 * @description Componente raíz de la aplicación. Orquesta el layout principal
 * (navbar, contenido de rutas y footer).
 * @usageNotes
 * Normalmente se declara una sola vez en el `bootstrap` de la aplicación.
 * ```html
 * <app-root></app-root>
 * ```
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
})
export class AppComponent {}
