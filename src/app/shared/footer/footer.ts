import { Component } from '@angular/core';
/**
 * @description Componente de pie de página. Contiene el contenido estático
 * del footer de la aplicación (enlaces, créditos, etc.).
 * @usageNotes
 * Normalmente se incluye una sola vez en el layout principal (por ejemplo,
 * en `AppComponent`).
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})

export class FooterComponent {}
