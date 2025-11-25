import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Asegúrese de que la ruta de importación sea correcta
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notification(); as n) {
    <div
      class="toast-message alert"
      [class.alert-success]="n.type === 'success'"
      role="alert"
    >
      {{ n.message }}
    </div>
    }
  `,
  styles: [
    `
      .toast-message {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 250px;
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
})
export class ToastComponent {
  /** * ✅ SOLUCIÓN: Usar inject() para inicializar la dependencia
   * antes de que se usen sus propiedades.
   */
  private notificationSrv = inject(NotificationService);

  /** * Ahora, la propiedad 'notification' puede acceder a 'this.notificationSrv'
   * sin problemas de inicialización.
   */
  readonly notification = this.notificationSrv.currentNotification;
}
