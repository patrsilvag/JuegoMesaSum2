import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart, CartItem } from '../../core/cart';
import { NotificationService } from '../../core/notification.service';
/**
 * Página del carrito de compras. Muestra los productos añadidos,
 * permite modificar cantidades, vaciar el carrito y aplicar cupones de descuento.
 * @usageNotes
 * - Se apoya en el servicio Cart para la lógica de negocio (totales, envío, etc.).
 * - Usa un formulario reactivo sencillo (cuponForm) para introducir el código de cupón.
 */
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class CarritoComponent implements OnInit {
  /**
   * Lista actual de ítems en el carrito, mantenida sincronizada
   * con el observable `cart.carrito$`.
   */
  carritoLista: CartItem[] = [];

  /**
   * Formulario reactivo para ingresar el código de cupón de descuento.
   */
  cuponForm!: FormGroup;

  /**
   *   Inyecta el servicio de carrito y el `FormBuilder` para el formulario
   * del cupón.
   * @param cart Servicio de carrito que mantiene el estado global de los ítems.
   * @param fb Factoría de formularios reactivos para construir `cuponForm`.
   */
  constructor(public cart: Cart, private fb: FormBuilder, private notifSrv: NotificationService) {}

  /**
   *   Inicializa el formulario de cupón y se suscribe al observable
   * `carrito$` para mantener `carritoLista` sincronizado.
   * @returns Nada (`void`).
   */
  ngOnInit() {
    /** Inicializa formulario reactivo */
    this.cuponForm = this.fb.group({
      codigoDescuento: ['', [Validators.required, Validators.minLength(4)]],
    });

    /** Escucha cambios del carrito */
    this.cart.carrito$.subscribe((items: CartItem[]) => {
      this.carritoLista = items ?? [];
    });
  }

  /**
   *   Aplica un cupón de descuento si el formulario es válido
   * y el código coincide con uno soportado (actualmente `DESCUENTO10`).
   * @returns Nada (`void`).
   * @usageNotes
   * - Si el formulario es inválido, se marcan todos los campos y se muestra
   *   un mensaje `.
   * - Si el código es válido, se llama a `cart.aplicarDescuento(10)`.
   */
  // ===================================================
  //  CUPÓN
  // ===================================================
  aplicarCupon() {
    if (this.cuponForm.invalid) {
      this.cuponForm.markAllAsTouched();
      this.notifSrv.showError('Código inválido o demasiado corto.');
      return;
    }

    const codigo = this.cuponForm.value.codigoDescuento.trim().toUpperCase();

    if (codigo === 'DESCUENTO10') {
      this.cart.aplicarDescuento(10);
      this.notifSrv.showSuccess('Cupón aplicado correctamente (10% OFF).');
    } else {
      this.notifSrv.showError('Cupón no válido.');
    }
  }

  /**
   *   Limpia el formulario de cupón y borra el mensaje asociado.
   * @returns Nada (`void`).
   */
  limpiarCupon() {
    this.cuponForm.reset();
  }

  // ===================================================
  //  MANEJO DEL CARRITO
  // ===================================================

  /**
   *   Aumenta en 1 la cantidad del producto con el id dado.
   * @param id Identificador del producto dentro del carrito.
   * @returns Nada (`void`).
   */
  sumar(id: string) {
    this.cart.sumar(id);
  }

  /**
   *   Disminuye en 1 la cantidad del producto con el id dado.
   * @param id Identificador del producto dentro del carrito.
   * @returns Nada (`void`).
   */
  restar(id: string) {
    this.cart.restar(id);
  }

  /**
   *   Elimina completamente un producto del carrito.
   * @param id Identificador del producto.
   * @returns Nada (`void`).
   */
  quitar(id: string) {
    this.cart.quitarProducto(id);
  }

  /**
   *   Vacía por completo el carrito y limpia el estado del cupón.
   * @returns Nada (`void`).
   */
  limpiarCarrito() {
    this.cart.limpiar();
    this.limpiarCupon();
  }

  // ===================================================
  //  CÁLCULOS
  // ===================================================
  /**
   *   Calcula el subtotal sin descuentos ni envío usando los datos
   * actuales de `carritoLista`.
   * @returns El subtotal numérico original.
   */
  subtotalOriginal() {
    return this.carritoLista.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  }

  /**
   *   Devuelve el total actual calculado por el servicio `Cart`
   * (puede incluir descuentos).
   * @returns Total numérico.
   */
  total() {
    return this.cart.total();
  }

  /**
   *   Devuelve el costo de envío calculado por el servicio `Cart`.
   * @returns Coste numérico del envío.
   */
  envio() {
    return this.cart.envio();
  }

  /**
   *   Devuelve el total final, sumando subtotal + envío (y descuentos
   * aplicados) según la lógica del servicio `Cart`.
   * @returns Total final numérico.
   */
  totalFinal() {
    return this.cart.totalFinal();
  }
}
