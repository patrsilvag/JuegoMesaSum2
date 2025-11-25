import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

import { ValidatorsService } from '../../core/validators.service';
import { UserService } from '../../core/user.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { Usuario } from '../../core/auth';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent implements OnInit {
  form!: FormGroup;

  verClave = false;
  verClave2 = false;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private err: AuthErrorService,
    private notifSrv: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        usuario: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        clave: [
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
        fechaNacimiento: [
          '',
          [
            Validators.required,
            this.validators.fechaFuturaValidator(),
            this.validators.edadMinimaValidator(13),
          ],
        ],
        direccion: [''], // opcional
      },
      {
        validators: this.validators.coincidenClaves('clave', 'repetirClave'),
      }
    );
  }

  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  // ✅ NUEVO: Función para centralizar y priorizar la lógica de errores de fecha
  getFechaError(): string {
    const control = this.campo('fechaNacimiento');
    if (!control.errors) return '';

    // Prioridad 1: Requerido
    if (control.errors['required']) {
      // Nota: Si AuthErrorService tuviera un método para 'required', usaríamos: this.err.campoRequerido()
      return 'La fecha es obligatoria.';
    }
    // Prioridad 2: Fecha Futura
    if (control.errors['fechaFutura']) {
      // Nota: Si AuthErrorService tuviera un método para 'fechaFutura', usaríamos: this.err.fechaFuturaNoPermitida()
      return 'La fecha no puede ser futura.';
    }
    // Prioridad 3: Edad Mínima
    if (control.errors['edadMinima']) {
      // Nota: Si AuthErrorService tuviera un método para 'edadMinima', usaríamos: this.err.edadMinimaNoCumplida()
      return 'Debes tener al menos 13 años.';
    }

    return '';
  }

  limpiar() {
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: Usuario = {
      nombre: this.form.value.nombre!,
      usuario: this.form.value.usuario!,
      correo: this.form.value.correo!,
      clave: this.form.value.clave!,
      fechaNacimiento: this.form.value.fechaNacimiento!,
      direccion: this.form.value.direccion ?? '',
      rol: 'cliente',
    };

    const ok = this.userSrv.registrarUsuario(data);

    if (!ok) {
      // correo ya existe
      this.form.get('correo')?.setErrors({ existe: true });
      return;
    }

    this.form.reset();
    this.notifSrv.showSuccess('¡Registro completado! Puedes iniciar sesión.');
  }
}
