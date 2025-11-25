import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs'; // Necesaria para manejar la desuscripción

import { AuthService } from '../../core/auth.service';
import { Cart } from '../../core/cart';
import { Usuario } from '../../core/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  cantidadTotal = 0;

  // ⭐️ DECLARACIÓN CORREGIDA: Propiedad para gestionar la suscripción de RxJS
  private userSubscription!: Subscription;

  constructor(private auth: AuthService, private cart: Cart) {
    // Suscripción al carrito (se mantiene)
    this.cart.carrito$.subscribe((items) => {
      this.cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);
    });
  }

  // 1. Hook para inicializar y suscribirse al stream de usuario
  ngOnInit(): void {
    // Al suscribirnos a usuarioActual$, el componente recibe el usuario CADA VEZ que cambia (login/logout)
    this.userSubscription = this.auth.usuarioActual$.subscribe((user) => {
      this.usuario = user;
    });
  }

  // 2. Hook para limpiar la suscripción al destruir el componente (buena práctica)
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Método que llama a AuthService para cerrar la sesión
  logout() {
    this.auth.logout();
  }
}
