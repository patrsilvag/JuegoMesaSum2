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

/**
 * @description Página de perfil de usuario. Permite editar datos personales
 * y cambiar la contraseña del usuario actualmente autenticado.
 * @usageNotes
 * - Requiere que `AuthService` tenga un usuario actual; si no lo hay, no se inicializan los formularios.
 * - Usa dos formularios: `formDatos` (datos personales) y `formClave` (cambio de contraseña).
 * - Muestra notificaciones de éxito vía `NotificationService`.
 */
export class PerfilComponent implements OnInit {
  usuario!: Usuario | null;
  // mensajeExito = false; // <-- ELIMINADO

  verActual = false;
  verNueva = false;
  verRepetir = false;

  formDatos!: FormGroup;
  formClave!: FormGroup;

  /**
   * @description Inyecta servicios para construir formularios, validar reglas,
   * actualizar usuarios y gestionar sesión y mensajes de error.
   * @param fb Factoría de formularios reactivos.
   * @param validators Servicio de validadores personalizados (fecha, claves, etc.).
   * @param userSrv Servicio de usuarios para actualizar datos y contraseña.
   * @param authSrv Servicio de autenticación para leer el usuario actual.
   * @param err Servicio de mensajes de error de autenticación/validación.
   * @param notifSrv Servicio de notificaciones tipo toast.
   */
  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private authSrv: AuthService,
    private err: AuthErrorService,
    private notifSrv: NotificationService // <-- SERVICIO INYECTADO
  ) {}

  /**
   * @description Carga el usuario actual desde `AuthService` y construye:
   * - `formDatos` con los campos personales.
   * - `formClave` para cambio de contraseña con validadores de complejidad
   *   y coincidencia de claves.
   * Si no hay usuario, no hace nada.
   * @returns Nada (`void`).
   */
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

  /**
   * @description Devuelve un control del formulario de datos personales.
   * @param fechaNacimiento Nombre del control (no solo fecha; p. ej. `'nombre'`, `'usuario'`, etc.).
   * @returns El control correspondiente (no nulo).
   */
  fcDatos(fechaNacimiento: string) {
    return this.formDatos.get(fechaNacimiento)!;
  }

  /**
   * @description Devuelve un control del formulario de cambio de contraseña.
   * @param nombre Nombre del control (p. ej. `'claveActual'`, `'nuevaClave'`, `'repetirClave'`).
   * @returns El control correspondiente (no nulo).
   */
  fcClave(nombre: string) {
    return this.formClave.get(nombre)!;
  }

  /**
   * @description Obtiene el mensaje de error asociado al campo `fechaNacimiento`
   * del formulario de datos personales.
   * @returns Cadena con el mensaje de error o cadena vacía si no hay error relevante.
   */

  getFechaError(): string {
    return this.err.getFechaErrorMessage(this.fcDatos('fechaNacimiento')); // si lo pones en AuthErrorService
  }

  /**
   * @description Guarda los datos personales del usuario. Si el formulario es inválido,
   * marca todos los campos como tocados. En caso contrario:
   * - Fusiona los datos actuales del usuario con `formDatos`.
   * - Llama a `userSrv.actualizarPerfil`.
   * - Si falla, muestra un error genérico.
   * - Si tiene éxito, actualiza `this.usuario` y muestra un toast.
   * @returns Nada (`void`).
   */
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

  /**
   * @description Cambia la contraseña del usuario actual.
   * Flujo:
   * 1. Valida que `formClave` sea válido.
   * 2. Comprueba la contraseña actual con `userSrv.validarClaveActual`.
   * 3. Si la clave actual es incorrecta, establece un error en el control `claveActual`.
   * 4. Si es correcta, llama a `userSrv.cambiarClave`.
   * 5. Ante errores de actualización, marca un error de formulario.
   * 6. En éxito, resetea el formulario y muestra un toast.
   * @returns Nada (`void`).
   */
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
