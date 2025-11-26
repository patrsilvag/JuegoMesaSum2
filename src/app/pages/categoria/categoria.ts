import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../../core/cart';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.scss'],
})

/**
 * @description Página de listado de productos por categoría. Escucha el parámetro
 * `slug` de la ruta, obtiene los textos de `categoriasData` y filtra `productos`
 * para mostrar solo los de esa categoría.
 * @usageNotes
 * - Se accede típicamente por ruta `/categorias/:slug`.
 * - Usa `Cart` para añadir productos al carrito con cantidad 1.
 */
export class CategoriaComponent implements OnInit {
  slug!: string;
  categoriaActual: any = null;
  productosFiltrados: any[] = [];

  categoriasData: any = {
    amigos: {
      titulo: 'Juegos para Amigos',
      subtitulo: '¡Dibuja, adivina y tiembla! La diversión se apila.',
    },
    cartas: {
      titulo: 'Juegos de Cartas',
      subtitulo: 'Barajas y juegos rápidos para todos',
    },
    estrategia: {
      titulo: 'Juegos de Estrategia',
      subtitulo: 'Planifica, conquista y desafía tu mente',
    },
    infantiles: {
      titulo: 'Juegos Infantiles',
      subtitulo: 'Aprendizaje y diversión para los más pequeños',
    },
  };

  productos = [
    // Estrategia
    {
      id: 'sku-catan',
      nombre: 'Catan',
      categoria: 'estrategia',
      precio: 29990,
      descuento: true,
      imagen: 'assets/img/catan.webp',
      alt: 'Tablero Catan',
      desc: 'Coloniza la isla y comercia recursos.',
    },
    {
      id: 'sku-risk',
      nombre: 'Risk',
      categoria: 'estrategia',
      precio: 24990,
      descuento: false,
      imagen: 'assets/img/risk.webp',
      alt: 'Tablero Risk',
      desc: 'Conquista el mundo con estrategia.',
    },
    {
      id: 'sku-ajed',
      nombre: 'Ajedrez Clásico',
      categoria: 'estrategia',
      precio: 14990,
      descuento: true,
      imagen: 'assets/img/ajedrez.webp',
      alt: 'Ajedrez',
      desc: 'Clásico de estrategia.',
    },

    // Cartas
    {
      id: 'sku-ek',
      nombre: 'Exploding Kittens',
      categoria: 'cartas',
      precio: 16990,
      descuento: true,
      imagen: 'assets/img/exploding_kittens.webp',
      alt: 'Exploding Kittens',
      desc: 'Evita explotar con cartas de defensa.',
    },
    {
      id: 'sku-dob',
      nombre: 'Dobble',
      categoria: 'cartas',
      precio: 10990,
      descuento: false,
      imagen: 'assets/img/dobble.webp',
      alt: 'Dobble',
      desc: 'Encuentra el símbolo común.',
    },
    {
      id: 'sku-poker',
      nombre: 'Set Póker Clásico',
      categoria: 'cartas',
      precio: 19990,
      descuento: true,
      imagen: 'assets/img/cartas_poker.webp',
      alt: 'Poker',
      desc: 'Baraja y fichas clásicas.',
    },

    // Amigos
    {
      id: 'sku-pict',
      nombre: 'Pictionary',
      categoria: 'amigos',
      precio: 18990,
      descuento: true,
      imagen: 'assets/img/pictionary.webp',
      alt: 'Pictionary',
      desc: 'Dibuja y adivina.',
    },
    {
      id: 'sku-jenga',
      nombre: 'Jenga',
      categoria: 'amigos',
      precio: 13990,
      descuento: false,
      imagen: 'assets/img/jenga.webp',
      alt: 'Jenga',
      desc: 'Pulso firme para no botar la torre.',
    },
    {
      id: 'sku-uno',
      nombre: 'UNO',
      categoria: 'amigos',
      precio: 8990,
      descuento: true,
      imagen: 'assets/img/uno.webp',
      alt: 'UNO',
      desc: 'Clásico rápido y divertido.',
    },

    // Infantiles
    {
      id: 'sku-candy',
      nombre: 'Candy Land',
      categoria: 'infantiles',
      precio: 12990,
      descuento: true,
      imagen: 'assets/img/candyland.webp',
      alt: 'Candy Land',
      desc: 'Aprenden colores y turnos.',
    },
    {
      id: 'sku-serp',
      nombre: 'Serpientes y Escaleras',
      categoria: 'infantiles',
      precio: 9990,
      descuento: false,
      imagen: 'assets/img/serpientes.webp',
      alt: 'Serpientes y Escaleras',
      desc: 'Azar y diversión.',
    },
    {
      id: 'sku-memo',
      nombre: 'Memoria Animales',
      categoria: 'infantiles',
      precio: 7990,
      descuento: true,
      imagen: 'assets/img/memoria.webp',
      alt: 'Memoria',
      desc: 'Mejora la concentración.',
    },
  ];

  /**
   * @description Inyecta la ruta activada para leer el parámetro `slug`
   * y el servicio de carrito para añadir productos.
   * @param route Ruta activada con acceso a `params`.
   * @param cart Servicio de carrito.
   */
  constructor(private route: ActivatedRoute, private cart: Cart) {}

  /**
   * @description Se suscribe a los parámetros de la ruta para:
   * - Actualizar `slug`.
   * - Calcular `categoriaActual` a partir de `categoriasData`.
   * - Filtrar `productos` por categoría y quedarse con los 3 primeros.
   * @returns Nada (`void`).
   */
  ngOnInit(): void {
    // 🔥 escuchar SIEMPRE los cambios de categoría
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];

      this.categoriaActual = this.categoriasData[this.slug] ?? null;

      // Filtrar productos y mostrar solo los 3 primeros
      this.productosFiltrados = this.productos.filter((p) => p.categoria === this.slug).slice(0, 3);
    });
  }

  /**
   * @description Añade un producto al carrito con cantidad 1 usando `Cart.agregar`.
   * @param p Objeto de producto tal y como está definido en `productos`.
   * @returns Nada (`void`).
   */
  agregarProducto(p: any) {
    this.cart.agregar({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      cantidad: 1,
    });
  }
}
