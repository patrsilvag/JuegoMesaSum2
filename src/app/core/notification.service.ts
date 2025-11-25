import { Injectable, signal } from '@angular/core';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly currentNotification = signal<Notification | null>(null);

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
