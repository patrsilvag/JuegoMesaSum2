import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor() {}

  cargarUsuarios() {
    return [
      { correo: 'admin@site.com', usuario: 'Admin', rol: 'admin', status: 'active' },
      { correo: 'user@site.com', usuario: 'User', rol: 'cliente', status: 'inactive' },
    ];
  }

  filtrarUsuarios(lista: any[], filtros: any) {
    const { correo, rol, estado } = filtros;

    return lista.filter(
      (u) =>
        (correo ? u.correo.includes(correo) : true) &&
        (rol ? u.rol === rol : true) &&
        (estado ? u.status === estado : true)
    );
  }

  toggleEstado(usuario: any) {
    usuario.status = usuario.status === 'active' ? 'inactive' : 'active';
    return usuario;
  }
}
