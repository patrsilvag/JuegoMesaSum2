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
   * Muestra una notificación del tipo indicado que desaparece automáticamente.
   * @param message Mensaje a mostrar.
   * @param type Tipo de notificación.
   * @param duration Duración en ms antes de ocultar (por defecto 2200).
   */
  private show(
    message: string,
    type: Notification['type'],
    duration: number = 2200
  ): void {
    this.currentNotification.set({ message, type });

    setTimeout(() => {
      // Solo limpia si sigue siendo el mismo mensaje (evita borrar uno nuevo).
      if (this.currentNotification()?.message === message) {
        this.currentNotification.set(null);
      }
    }, duration);
  }

  /** Atajo para mensajes de éxito. */
  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /** Atajo para mensajes de error. */
  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /** Atajo para mensajes informativos. */
  showInfo(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}