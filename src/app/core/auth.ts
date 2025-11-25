export interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  fechaNacimiento: string;
  direccion?: string;
  clave: string;
  rol: 'admin' | 'cliente';
  status?: 'active' | 'inactive'; /** Indicador de si el usuario está activo o desactivado */
}

