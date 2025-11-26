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

/**
 * @description Página de registro de nuevos usuarios. Construye un formulario
 * con datos personales y credenciales, aplicando validaciones de negocio
 * (edad mínima, complejidad de clave, coincidencia de claves, etc.).
 * @usageNotes
 * - Crea usuarios con rol `'cliente'`.
 * - Si el correo ya existe, marca el control `correo` con el error `{ existe: true }`.
 * - Muestra un toast de éxito a través de `NotificationService` al finalizar.
 */
export class RegistroComponent implements OnInit {
  form!: FormGroup;

  verClave = false;
  verClave2 = false;
  /**
   * @description Inyecta los servicios necesarios para construir el formulario,
   * validar reglas personalizadas y persistir el nuevo usuario.
   * @param fb Factoría de formularios reactivos.
   * @param validators Servicio de validadores personalizados.
   * @param userSrv Servicio de dominio para registrar usuarios.
   * @param err Servicio de mensajes de error (incluye errores de fecha).
   * @param notifSrv Servicio de notificaciones tipo toast.
   */
  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private err: AuthErrorService,
    private notifSrv: NotificationService
  ) {}

  /**
   * @description Inicializa el `FormGroup` de registro con todos los campos
   * y validadores necesarios, incluyendo el validador de coincidencia de claves.
   * @returns Nada (`void`).
   */
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

  /**
   * @description Devuelve un control del formulario de registro por nombre.
   * @param nombre Nombre del control (ej. `'nombre'`, `'correo'`, `'fechaNacimiento'`).
   * @returns El control correspondiente (no nulo).
   */
  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  /**
   * @description Obtiene el mensaje de error para el campo `fechaNacimiento`,
   * delegando en `AuthErrorService` la lógica de construcción del mensaje.
   * @returns Cadena con el mensaje de error o cadena vacía si no hay error relevante.
   */
  // ✅ NUEVO: Función para centralizar y priorizar la lógica de errores de fecha
  // perfil.ts
  getFechaError(): string {
    return this.err.getFechaErrorMessage(this.campo('fechaNacimiento')); // si lo pones en AuthErrorService
  }

  /**
   * @description Limpia el formulario de registro.
   * @returns Nada (`void`).
   */
  limpiar() {
    this.form.reset();
  }

  /**
   * @description Envía el formulario de registro. Si el formulario es inválido,
   * marca todos los campos como tocados y no continúa. Si el registro falla
   * porque el correo ya existe, marca el control `correo` con un error.
   * @returns Nada (`void`).
   * @usageNotes
   * En caso de éxito:
   * - Llama a `userSrv.registrarUsuario`.
   * - Resetea el formulario.
   * - Muestra un toast indicando que puede iniciar sesión.
   */
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
