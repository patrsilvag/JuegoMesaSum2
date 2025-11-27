import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from './admin.service';
/**
 * Panel de administración para listar y filtrar usuarios,
 * así como cambiar su estado activo/inactivo.
 * @usageNotes
 * - Se apoya en AdminService para cargar, filtrar y actualizar usuarios.
 * - Usa un formulario reactivo filtroForm con campos correo, rol y estado.
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminComponent implements OnInit {
  /**
   *  Formulario reactivo que contiene los campos de filtrado:
   * `correo`, `rol` y `estado`.
   *  @type {FormGroup} 
   */
  filtroForm!: FormGroup;
  /**
   * Lista completa de usuarios cargados desde `AdminService`
   * antes de aplicar cualquier filtro.
   */
  usuarios: any[] = [];
  /**
   * Lista de usuarios resultante de aplicar los filtros del
   * formulario sobre `usuarios`.
   */
  usuariosFiltrados: any[] = [];
  /**
   * Mensaje de error a mostrar en la vista cuando ocurre
   * algún problema al cargar o filtrar usuarios. `null` si no hay error.
   */
  error: string | null = null;
  /**
   * Bandera interna para habilitar/deshabilitar información
   * de depuración en la plantilla.
   */
  debug = false;

  /**
   * Inyecta el `FormBuilder` y el servicio de administración.
   * @param fb Factoría para construir el formulario de filtros.
   * @param adminSrv Servicio que encapsula la lógica sobre usuarios administrables.
   */
  constructor(private fb: FormBuilder, private adminSrv: AdminService) {}

  /**
   * Inicializa el formulario de filtros, carga la lista de usuarios
   * desde `AdminService` y configura una suscripción a `valueChanges` para
   * filtrar automáticamente.
   * @returns Nada (`void`).
   */
  ngOnInit() {
    // Formulario reactivo
    this.filtroForm = this.fb.group({
      correo: ['', [Validators.email]],
      rol: [''],
      estado: [''],
    });

    // Cargar datos desde el servicio
    this.usuarios = this.adminSrv.cargarUsuarios();
    this.usuariosFiltrados = [...this.usuarios];

    // Filtrar automáticamente cuando cambian los campos del formulario
    this.filtroForm.valueChanges.subscribe(() => this.filtrar());
  }

  /**
   * Aplica los filtros actuales del formulario sobre la lista
   * de usuarios, usando `AdminService.filtrarUsuarios`.
   * @returns Nada (`void`).
   */
  filtrar() {
    this.usuariosFiltrados = this.adminSrv.filtrarUsuarios(this.usuarios, this.filtroForm.value);
  }

  /**
   * Resetea todos los campos del formulario de filtrado.
   * @returns Nada (`void`).
   */
  resetFiltro() {
    this.filtroForm.reset();
  }

  /**
   * Cambia el estado de un usuario (activo/inactivo) usando
   * `AdminService.toggleEstado` y vuelve a aplicar los filtros para refrescar
   * la vista.
   * @param usuario Objeto usuario tal y como lo devuelve `AdminService`.
   * @returns Nada (`void`).
   */
  toggleEstado(usuario: any) {
    this.adminSrv.toggleEstado(usuario);
    this.filtrar();
  }
}
