import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})

/**
 * @description Panel de administración para listar y filtrar usuarios,
 * así como cambiar su estado activo/inactivo.
 * @usageNotes
 * - Se apoya en `AdminService` para cargar, filtrar y actualizar usuarios.
 * - Usa un formulario reactivo `filtroForm` con campos `correo`, `rol` y `estado`.
 */
export class AdminComponent implements OnInit {
  filtroForm!: FormGroup;
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  error: string | null = null;
  debug = false;

  /**
   * @description Inyecta el `FormBuilder` y el servicio de administración.
   * @param fb Factoría para construir el formulario de filtros.
   * @param adminSrv Servicio que encapsula la lógica sobre usuarios administrables.
   */
  constructor(private fb: FormBuilder, private adminSrv: AdminService) {}

  /**
   * @description Inicializa el formulario de filtros, carga la lista de usuarios
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
   * @description Aplica los filtros actuales del formulario sobre la lista
   * de usuarios, usando `AdminService.filtrarUsuarios`.
   * @returns Nada (`void`).
   */
  filtrar() {
    this.usuariosFiltrados = this.adminSrv.filtrarUsuarios(this.usuarios, this.filtroForm.value);
  }

  /**
   * @description Resetea todos los campos del formulario de filtrado.
   * @returns Nada (`void`).
   */
  resetFiltro() {
    this.filtroForm.reset();
  }

  /**
   * @description Cambia el estado de un usuario (activo/inactivo) usando
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
