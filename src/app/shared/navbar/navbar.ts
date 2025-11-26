import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs'; // Necesaria para manejar la desuscripción

import { AuthService } from '../../core/auth.service';
import { Cart } from '../../core/cart';
import { Usuario } from '../../core/auth';
/**
 *   Barra de navegación principal. Muestra enlaces de la app,
 * el usuario autenticado (si existe) y la cantidad total de ítems en el carrito.
 * @usageNotes
 * - Se suscribe a `AuthService.usuarioActual$` para reaccionar a login/logout.
 * - Calcula la cantidad total del carrito escuchando `Cart.carrito$`.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * Usuario actualmente autenticado. `null` si no hay sesión iniciada.
   */
  usuario: Usuario | null = null;

  /**
   * Cantidad total de ítems en el carrito, calculada a partir de `cart.carrito$`.
   */
  cantidadTotal = 0;

  /**
   * Suscripción al stream `usuarioActual$` de `AuthService` usada
   * para mantener `usuario` sincronizado y poder desuscribir en `ngOnDestroy`.
   */
  private userSubscription!: Subscription;

  /**
   * Inyecta los servicios necesarios para el navbar:
   * - `AuthService` para gestionar la sesión del usuario.
   * - `Cart` para obtener el estado del carrito y calcular `cantidadTotal`.
   * - `Router` para realizar navegaciones explícitas (por ejemplo, tras logout).
   *
   * Además se suscribe al observable del carrito (`carrito$`) para mantener
   * siempre actualizada la cantidad total de ítems mostrada en el navbar.
   *
   * @param auth   Servicio de autenticación.
   * @param cart   Servicio de carrito.
   * @param router Servicio de enrutamiento de Angular.
   */
  constructor(private auth: AuthService, private cart: Cart, private router: Router) {
    // Suscripción al carrito (se mantiene)
    this.cart.carrito$.subscribe((items) => {
      this.cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);
    });
  }

  /**
   *   Hook de inicialización. Se suscribe al observable
   * `usuarioActual$` para mantener `usuario` sincronizado con el estado
   * de sesión.
   * @returns Nada (`void`).
   */
  // 1. Hook para inicializar y suscribirse al stream de usuario
  ngOnInit(): void {
    // Al suscribirnos a usuarioActual$, el componente recibe el usuario CADA VEZ que cambia (login/logout)
    this.userSubscription = this.auth.usuarioActual$.subscribe((user) => {
      this.usuario = user;
    });
  }

  /**
   *   Hook de destrucción. Libera la suscripción a `usuarioActual$`
   * para evitar fugas de memoria.
   * @returns Nada (`void`).
   */
  // 2. Hook para limpiar la suscripción al destruir el componente (buena práctica)
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Cierra la sesión del usuario actual:
   * - Delegando en `AuthService.logout` para limpiar credenciales y estado.
   * - Reseteando la propiedad `usuario` del navbar.
   * - Redirigiendo explícitamente a la ruta de inicio (`'/'`).
   *
   * @returns void
   */
  // Método que llama a AuthService para cerrar la sesión
  logout() {
    this.auth.logout(); // limpia sesión en el servicio
    this.usuario = null; // opcional, pero deja el navbar consistente al instante
    this.router.navigate(['/']); // fuerza ir al home
  }
}
