import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
/**
 * @description Página de inicio. Muestra el listado de categorías disponibles
 * y enlaza a las rutas de detalle de categoría.
 * @usageNotes
 * Se usa como ruta raíz (`path: ''`). Cada elemento de `categorias` debe tener
 * al menos `nombre`, `slug` (usado en `/categorias/:slug`) e `imagen`.
 */
export class HomeComponent {
  /**
   * @description Listado de categorías visibles en la portada con los datos
   * necesarios para construir las tarjetas de navegación.
   */
  categorias = [
    {
      nombre: 'Estrategia',
      slug: 'estrategia',
      imagen: 'assets/img/categorias/estrategia.webp',
    },
    {
      nombre: 'Infantiles',
      slug: 'infantiles',
      imagen: 'assets/img/categorias/infantiles.webp',
    },
    {
      nombre: 'Amigos',
      slug: 'amigos',
      imagen: 'assets/img/categorias/amigos.webp',
    },
    {
      nombre: 'Cartas',
      slug: 'cartas',
      imagen: 'assets/img/categorias/cartas.webp',
    },
  ];
}
