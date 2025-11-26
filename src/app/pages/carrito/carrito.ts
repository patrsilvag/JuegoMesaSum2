import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart, CartItem } from '../../core/cart';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})

/**
 * @description Página del carrito de compras. Muestra los productos añadidos,
 * permite modificar cantidades, vaciar el carrito y aplicar cupones de descuento.
 * @usageNotes
 * - Se apoya en el servicio `Cart` para la lógica de negocio (totales, envío, etc.).
 * - Usa un formulario reactivo sencillo (`cuponForm`) para introducir el código de cupón.
 */
export class CarritoComponent implements OnInit {
  carritoLista: CartItem[] = [];

  // Reactive Form
  cuponForm!: FormGroup;
  mensajeCupon: string | null = null;

  /**
   * @description Inyecta el servicio de carrito y el `FormBuilder` para el formulario
   * del cupón.
   * @param cart Servicio de carrito que mantiene el estado global de los ítems.
   * @param fb Factoría de formularios reactivos para construir `cuponForm`.
   */
  constructor(public cart: Cart, private fb: FormBuilder) {}

  /**
   * @description Inicializa el formulario de cupón y se suscribe al observable
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
   * @description Aplica un cupón de descuento si el formulario es válido
   * y el código coincide con uno soportado (actualmente `DESCUENTO10`).
   * @returns Nada (`void`).
   * @usageNotes
   * - Si el formulario es inválido, se marcan todos los campos y se muestra
   *   un mensaje en `mensajeCupon`.
   * - Si el código es válido, se llama a `cart.aplicarDescuento(10)`.
   */
  // ===================================================
  //  CUPÓN
  // ===================================================
  aplicarCupon() {
    if (this.cuponForm.invalid) {
      this.cuponForm.markAllAsTouched();
      this.mensajeCupon = 'Código inválido o demasiado corto.';
      return;
    }

    const codigo = this.cuponForm.value.codigoDescuento.trim().toUpperCase();

    if (codigo === 'DESCUENTO10') {
      this.cart.aplicarDescuento(10);
      this.mensajeCupon = 'Cupón aplicado correctamente (10% OFF).';
    } else {
      this.mensajeCupon = 'Cupón no válido.';
    }
  }

  /**
   * @description Limpia el formulario de cupón y borra el mensaje asociado.
   * @returns Nada (`void`).
   */
  limpiarCupon() {
    this.cuponForm.reset();
    this.mensajeCupon = null;
  }

  // ===================================================
  //  MANEJO DEL CARRITO
  // ===================================================

  /**
   * @description Aumenta en 1 la cantidad del producto con el id dado.
   * @param id Identificador del producto dentro del carrito.
   * @returns Nada (`void`).
   */
  sumar(id: string) {
    this.cart.sumar(id);
  }

  /**
   * @description Disminuye en 1 la cantidad del producto con el id dado.
   * @param id Identificador del producto dentro del carrito.
   * @returns Nada (`void`).
   */
  restar(id: string) {
    this.cart.restar(id);
  }

  /**
   * @description Elimina completamente un producto del carrito.
   * @param id Identificador del producto.
   * @returns Nada (`void`).
   */
  quitar(id: string) {
    this.cart.quitarProducto(id);
  }

  /**
   * @description Vacía por completo el carrito y limpia el estado del cupón.
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
   * @description Calcula el subtotal sin descuentos ni envío usando los datos
   * actuales de `carritoLista`.
   * @returns El subtotal numérico original.
   */
  subtotalOriginal() {
    return this.carritoLista.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  }

  /**
   * @description Devuelve el total actual calculado por el servicio `Cart`
   * (puede incluir descuentos).
   * @returns Total numérico.
   */
  total() {
    return this.cart.total();
  }

  /**
   * @description Devuelve el costo de envío calculado por el servicio `Cart`.
   * @returns Coste numérico del envío.
   */
  envio() {
    return this.cart.envio();
  }

  /**
   * @description Devuelve el total final, sumando subtotal + envío (y descuentos
   * aplicados) según la lógica del servicio `Cart`.
   * @returns Total final numérico.
   */
  totalFinal() {
    return this.cart.totalFinal();
  }
}
