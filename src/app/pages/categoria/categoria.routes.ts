import { Routes } from '@angular/router';

/**
 * @description Rutas relacionadas con la sección de categorías.
 * @usageNotes
 * - Se usa en el módulo de categorías para lazy loading del componente `CategoriaComponent`.
 * - El parámetro `:slug` permite identificar la categoría específica en la URL.
 * - Estas rutas se pueden combinar con rutas principales mediante `loadChildren`.
 */
export const categoriaRoutes: Routes = [
  {
    /**
     * @description Ruta dinámica para mostrar una categoría específica.
     * @param slug Identificador de la categoría en la URL.
     * @returns Carga perezosa del componente `CategoriaComponent`.
     */
    path: ':slug',
    loadComponent: () => import('./categoria').then((m) => m.CategoriaComponent),
  },
];
