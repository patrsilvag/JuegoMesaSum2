import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
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
