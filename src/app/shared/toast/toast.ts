import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification.service';
/**
 * @description Componente de presentación para notificaciones tipo "toast".
 * Escucha el estado expuesto por `NotificationService` y muestra un mensaje
 * flotante temporal con estilos según el tipo (`success`, `error`, `info`).
 *
 * @usageNotes
 * Debe estar montado en el árbol de la aplicación (por ejemplo, en `AppComponent`)
 * para que cualquier servicio pueda disparar notificaciones globales.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notification as n) {
    <div
      class="toast-message alert"
      [class.alert-success]="n.type === 'success'"
      [class.alert-danger]="n.type === 'error'"
      [class.alert-info]="n.type === 'info'"
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
  /**
   * @description Servicio de notificaciones inyectado mediante la API `inject`.
   * Se usa para leer el signal con la notificación actual.
   */
  private notificationSrv = inject(NotificationService);

  /**
   * @description Signal de solo lectura con la notificación actual o `null`
   * si no hay nada que mostrar.
   * @returns El valor actual del signal (`{ message, type } | null`).
   */
  readonly notification = this.notificationSrv.currentNotification;
}
