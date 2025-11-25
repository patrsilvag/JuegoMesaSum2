import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

import { ValidatorsService } from '../../core/validators.service';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { NotificationService } from '../../core/notification.service'; // <-- NUEVA IMPORTACIÓN
import { Usuario } from '../../core/auth';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario | null;
  // mensajeExito = false; // <-- ELIMINADO

  verActual = false;
  verNueva = false;
  verRepetir = false;

  formDatos!: FormGroup;
  formClave!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private authSrv: AuthService,
    private err: AuthErrorService,
    private notifSrv: NotificationService // <-- SERVICIO INYECTADO
  ) {}

  ngOnInit(): void {
    this.usuario = this.authSrv.getUsuarioActual();

    if (!this.usuario) return;

    this.formDatos = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      usuario: [this.usuario.usuario, [Validators.required]],
      correo: [{ value: this.usuario.correo, disabled: true }],
      fechaNacimiento: [
        this.usuario.fechaNacimiento,
        [
          Validators.required,
          this.validators.fechaFuturaValidator(),
          this.validators.edadMinimaValidator(13),
        ],
      ],
      direccion: [this.usuario.direccion ?? ''],
    });

    this.formClave = this.fb.group(
      {
        claveActual: ['', Validators.required],
        nuevaClave: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(18),
            this.validators.uppercaseValidator(),
            this.validators.numberValidator(),
          ],
        ],
        repetirClave: ['', Validators.required],
      },
      {
        validators: this.validators.coincidenClaves('nuevaClave', 'repetirClave'),
      }
    );
  }

  fcDatos(fechaNacimiento: string) {
    return this.formDatos.get(fechaNacimiento)!;
  }

  fcClave(nombre: string) {
    return this.formClave.get(nombre)!;
  }

  // perfil.ts
  getFechaError(): string {
    return this.err.getFechaErrorMessage(this.fcDatos('fechaNacimiento')); // si lo pones en AuthErrorService
  }

  // ==============================================
  //   GUARDAR DATOS PERSONALES
  // ==============================================
  guardarDatos() {
    if (this.formDatos.invalid) {
      this.formDatos.markAllAsTouched();
      return;
    }

    const data: Usuario = {
      ...this.usuario!,
      ...this.formDatos.getRawValue(),
    };

    const ok = this.userSrv.actualizarPerfil(data);

    if (!ok) {
      // Error inesperado
      alert(this.err.errorInesperado());
      return;
    }

    this.usuario = data;
    // this.mensajeExito = true;
    // setTimeout(() => (this.mensajeExito = false), 2500);
    this.notifSrv.showSuccess('Datos de perfil actualizados.'); // <-- REEMPLAZO
  }

  // ==============================================
  //   CAMBIAR CONTRASEÑA
  // ==============================================
  actualizarClave() {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }

    // 1. Obtener el control de forma explícita
    const claveActualControl = this.fcClave('claveActual');

    // 2. Validar clave actual
    const esCorrecta = this.userSrv.validarClaveActual(
      this.usuario!.correo,
      claveActualControl.value // Usar el valor del control
    );

    if (!esCorrecta) {
      this.fcClave('claveActual').setErrors({
        incorrecta: this.err.claveIncorrecta(),
      });
      return;
    }

    // Cambiar clave
    const ok = this.userSrv.cambiarClave(this.usuario!.correo, this.formClave.value.nuevaClave);

    if (!ok) {
      this.formClave.setErrors({ error: this.err.errorInesperado() });
      return;
    }

    // Éxito
    this.formClave.reset();
    this.notifSrv.showSuccess('Contraseña actualizada con éxito.'); // <-- REEMPLAZO
  }
}
