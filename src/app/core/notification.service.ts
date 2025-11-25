import { Injectable, signal } from '@angular/core';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

/**
 * @description Servicio para gestionar notificaciones tipo "toast" en la UI.
 * Utiliza signals de Angular para exponer el estado actual de la notificación.
 * @usageNotes
 * - Úsalo junto con `ToastComponent` para mostrar mensajes temporales.
 * - Diseñado principalmente para mensajes de éxito o error de acciones de usuario.
 */

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /**
   * @description Signal con la notificación actual o `null` si no hay nada que mostrar.
   * @usageNotes
   * Accedido típicamente desde componentes de presentación (por ej. `ToastComponent`).
   */
  readonly currentNotification = signal<Notification | null>(null);

  /**
   * @description Muestra un mensaje de éxito que desaparece automáticamente
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
