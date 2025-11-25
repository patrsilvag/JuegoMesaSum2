import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
})
export class AdminComponent implements OnInit {
  filtroForm!: FormGroup;
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  error: string | null = null;
  debug = false;

  constructor(private fb: FormBuilder, private adminSrv: AdminService) {}

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

  filtrar() {
    this.usuariosFiltrados = this.adminSrv.filtrarUsuarios(this.usuarios, this.filtroForm.value);
  }

  resetFiltro() {
    this.filtroForm.reset();
  }

  toggleEstado(usuario: any) {
    this.adminSrv.toggleEstado(usuario);
    this.filtrar();
  }
}
