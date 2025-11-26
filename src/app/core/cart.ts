import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 *   Servicio de carrito. Gestiona productos, cantidades
 * y totales de la compra.
 * @usageNotes
 * - Expone un observable `carrito$` para reaccionar a cambios.
 * - Contiene lógica de subtotal, descuento y envío.
 */
export interface CartItem {
  /** Identificador único del producto en el carrito. */
  id: string;

  /** Nombre legible del producto. */
  nombre: string;

  /** Precio unitario del producto. */
  precio: number;

  /** Ruta de la imagen que se muestra en el carrito. */
  imagen: string;

  /** Cantidad de unidades de este producto en el carrito. */
  cantidad: number;
}

/**
 * Servicio de carrito. Gestiona productos, cantidades, descuentos
 * y totales de la compra.
 *
 * @usageNotes
 * - Expone el observable `carrito$` para reaccionar a cambios en la UI.
 * - Ofrece métodos para agregar, sumar, restar y eliminar ítems.
 * - Implementa lógica de subtotal, descuento, envío y total final.
 */
@Injectable({ providedIn: 'root' })
export class Cart {
  /**
   * Fuente interna de datos del carrito. Mantiene la lista actual
   * de ítems y emite cambios a través de un `BehaviorSubject`.
   */
  private items = new BehaviorSubject<CartItem[]>([]);

  /**
   * Observable público del carrito. Se suscribe la UI para reaccionar
   * a cambios en la lista de productos.
   */
  carrito$ = this.items.asObservable();

  /**
   * Porcentaje de descuento global aplicado al total del carrito.
   * Se establece mediante `aplicarDescuento`.
   */
  private descuento = 0;

  /**
   *   Aplica un porcentaje de descuento sobre el total actual.
   * @param porcentaje Porcentaje de descuento (0–100).
   * @returns Nada (`void`).
   */
  // 🔹 Aplicar descuento (llamado desde el formulario reactivo)
  aplicarDescuento(porcentaje: number) {
    this.descuento = porcentaje;
  }
  /**
   *   Agrega un producto al carrito o incrementa su cantidad si ya existe.
   * @param p Producto a agregar.
   * @returns Nada (`void`).
   */
  // 🔹 Agregar al carrito
  agregar(p: CartItem) {
    const actual = [...this.items.value];
    const existe = actual.find((i) => i.id === p.id);

    if (existe) {
      existe.cantidad += p.cantidad;
    } else {
      actual.push({ ...p });
    }

    this.items.next(actual);
  }

  /**
   *   Incrementa en 1 la cantidad de un ítem del carrito.
   * @param id Identificador del producto.
   */
  // 🔹 Sumar cantidad
  sumar(id: string) {
    const actual = [...this.items.value];
    const item = actual.find((i) => i.id === id);

    if (item) {
      item.cantidad++;
      this.items.next(actual);
    }
  }

  /**
   *   Decrementa en 1 la cantidad de un ítem del carrito.
   * Elimina el ítem si la cantidad llega a 0.
   * @param id Identificador del producto.
   */
  // 🔹 Restar cantidad
  restar(id: string) {
    const actual = [...this.items.value];
    const item = actual.find((i) => i.id === id);

    if (item && item.cantidad > 1) {
      item.cantidad--;
      this.items.next(actual);
    }
  }

  /**
   *   Elimina por completo un producto del carrito.
   * @param id Identificador del producto a quitar.
   */
  // 🔹 Eliminar producto
  quitarProducto(id: string) {
    const actual = this.items.value.filter((i) => i.id !== id);
    this.items.next(actual);
  }

  /**
   *   Limpia el carrito y elimina todos los ítems.
   * @returns Nada (`void`).
   */
  // 🔹 Limpiar carrito (resetea descuento también)
  limpiar() {
    this.items.next([]);
    this.descuento = 0;
  }

  /**
   *   Calcula el subtotal (sin envío) del carrito.
   * @returns Monto numérico del subtotal.
   */
  // 🔹 Total general (YA INCLUYE DESCUENTO)
  total() {
    const base = this.items.value.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

    return base - (base * this.descuento) / 100;
  }

  /**
   *   Calcula el costo de envío en función del subtotal.
   * @returns `0` si se alcanza el umbral de envío gratis; en otro caso el costo fijo.
   * @usageNotes
   * La lógica concreta (umbral, monto) está codificada en el método.
   */
  // 🔹 Envío basado en subtotal
  envio() {
    const subtotal = this.total();
    return subtotal >= 50000 ? 0 : 3990;
  }

  /**
   *   Calcula el total final incluyendo envío.
   * @returns Monto total de la compra.
   */
  // 🔹 Total final con envío incluido
  totalFinal() {
    return this.total() + this.envio();
  }
}
