import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from './auth';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) this.seedAdmin();
  }

  // ==========================================
  // CREAR ADMIN POR DEFECTO
  // ==========================================
  private seedAdmin() {
    const lista = this.listarUsuariosPrivado();
    if (lista.length > 0) return;

    const admin: Usuario = {
      nombre: 'Administrador',
      usuario: 'admin',
      correo: 'admin@local.com',
      fechaNacimiento: '1990-01-01',
      direccion: '',
      clave: 'Admin123!',
      rol: 'admin',
      status: 'active',
    };
    lista.push(admin);
    this.guardarUsuarios(lista);
  }

  // ==========================================
  // LOCALSTORAGE CRUD (privados)
  // ==========================================
  private listarUsuariosPrivado(): Usuario[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem('usuarios') ?? '[]');
  }

  private guardarUsuarios(lista: Usuario[]) {
    if (!this.isBrowser) return;
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }

  // ==========================================
  // MÉTODOS PÚBLICOS AGREGADOS
  // ==========================================
  listarUsuarios(): Usuario[] {
    return this.listarUsuariosPrivado();
  }

  actualizarEstado(correo: string, estado: 'active' | 'inactive'): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;

    lista[index].status = estado;
    this.guardarUsuarios(lista);
    return true;
  }

  // ==========================================
  // RESTO DE MÉTODOS EXISTENTES (sin cambios)
  // ==========================================
  registrar(user: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    if (lista.some((u) => u.correo === user.correo)) return false;

    lista.push(user);
    this.guardarUsuarios(lista);
    return true;
  }

  login(correo: string, clave: string): Usuario | null {
    return (
      this.listarUsuariosPrivado().find((u) => u.correo === correo && u.clave === clave) ?? null
    );
  }

  actualizar(data: Usuario): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === data.correo);
    if (index === -1) return false;

    lista[index] = { ...lista[index], ...data, correo: lista[index].correo };
    this.guardarUsuarios(lista);
    return true;
  }

  cambiarClave(correo: string, nueva: string): boolean {
    const lista = this.listarUsuariosPrivado();
    const index = lista.findIndex((u) => u.correo === correo);
    if (index === -1) return false;

    lista[index].clave = nueva;
    this.guardarUsuarios(lista);
    return true;
  }
}
