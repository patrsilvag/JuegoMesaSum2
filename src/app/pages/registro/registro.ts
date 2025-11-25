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

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent implements OnInit {
  form!: FormGroup;
  mensajeExito = false;

  verClave = false;
  verClave2 = false;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private err: AuthErrorService
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
            this.validators.specialValidator(),
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

    this.mensajeExito = true;
    this.form.reset();

    setTimeout(() => (this.mensajeExito = false), 2500);
  }
}
