import { Injectable, signal } from '@angular/core';
/**
 * Modelo de notificación mostrada en los toasts.
 *
 * @usageNotes
 * Se usa internamente por `NotificationService` y componentes de presentación
 * como `ToastComponent`.
 */
interface Notification {
  /** Mensaje de texto que se mostrará en el toast. */
  message: string;

  /** Tipo de notificación (por ejemplo: 'success', 'error' o 'info'). */
  type: 'success' | 'error' | 'info';
}

/**
 * Servicio para gestionar notificaciones tipo "toast" en la UI.
 *
 * Utiliza signals de Angular para exponer el estado actual de la notificación
 * y ofrece métodos de alto nivel para mostrar mensajes temporales.
 */

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /**
   *   Signal con la notificación actual o `null` si no hay nada que mostrar.
   * @usageNotes
   * Accedido típicamente desde componentes de presentación (por ej. `ToastComponent`).
   */
  readonly currentNotification = signal<Notification | null>(null);

  /**
   *   Muestra un mensaje de éxito que desaparece automáticamente
   * después de un tiempo.
   * @param message Mensaje a mostrar.
   * @param duration Duración en milisegundos antes de ocultar el mensaje
   * (por defecto 2500 ms).
   * @returns Nada (`void`).
   * @usageNotes
   * ```ts
   * this.notificationService.showSuccess('Operación realizada con éxito');
   * ```
   */
  /**
   * Muestra un mensaje de éxito que desaparece automáticamente después de 2.5s.
   */
  showSuccess(message: string, duration: number = 2500): void {
    this.currentNotification.set({ message, type: 'success' });

    setTimeout(() => {
      // Limpiar solo si sigue siendo el mismo mensaje (evita limpiar un mensaje nuevo)
      if (this.currentNotification()?.message === message) {
        this.currentNotification.set(null);
      }
    }, duration);
  }
}
