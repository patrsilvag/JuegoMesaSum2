import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

import { UserService } from '../../core/user.service';
import { ValidatorsService } from '../../core/validators.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.scss'],
})

/**
 * @description Flujo de recuperación de contraseña en tres pasos:
 * 1) Validar correo, 2) Validar código, 3) Establecer nueva clave.
 * Gestiona tres formularios independientes para cada paso.
 * @usageNotes
 * - La propiedad `paso` controla qué parte del flujo se muestra (1, 2 o 3).
 * - Usa `UserService` para localizar al usuario y cambiar la contraseña.
 * - Usa `NotificationService` para informar del éxito al finalizar.
 */
export class RecuperarComponent {
  paso = 1;

  codigoGenerado = '';
  correoValidado = '';

  verClave = false;
  verClave2 = false;

  formCorreo!: FormGroup;
  formCodigo!: FormGroup;
  formClave!: FormGroup;

  /**
   * @description Inyecta dependencias para construir formularios, acceder a usuarios,
   * aplicar validadores personalizados y mostrar notificaciones.
   * @param fb Factoría de formularios reactivos.
   * @param userSrv Servicio de usuarios para buscar y actualizar claves.
   * @param validators Servicio de validadores personalizados (claves).
   * @param err Servicio de mensajes de error de autenticación.
   * @param notifSrv Servicio de notificaciones tipo toast.
   */
  constructor(
    private fb: FormBuilder,
    private userSrv: UserService,
    private validators: ValidatorsService,
    private err: AuthErrorService,
    private notifSrv: NotificationService
  ) {}

  /**
   * @description Inicializa los tres formularios:
   * - `formCorreo` con campo `correo`.
   * - `formCodigo` con campo `codigo` numérico de 6 dígitos.
   * - `formClave` con los campos `clave` y `clave2` y validadores de complejidad.
   * @returns Nada (`void`).
   */
  ngOnInit() {
    this.formCorreo = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });

    this.formCodigo = this.fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });

    this.formClave = this.fb.group(
      {
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
        clave2: ['', Validators.required],
      },
      { validators: this.validators.coincidenClaves('clave', 'clave2') }
    );
  }

  /**
   * @description Devuelve un control del formulario de cambio de clave (`formClave`).
   * @param c Nombre del control (`'clave'` o `'clave2'`).
   * @returns El control correspondiente (no nulo).
   */
  // === GETTER PARA CAMPOS ===
  fc(c: string): AbstractControl {
    return this.formClave.get(c)!;
  }

  /**
   * @description Paso 1: valida el formulario de correo, comprueba si el usuario
   * existe y, si es así, genera un código (simulado) y avanza al paso 2.
   * @returns Nada (`void`).
   * @usageNotes
   * - Si el correo no existe, se marca el control `correo` con el error `noExiste`.
   * - El código actual está simulado como `'123456'`.
   */
  // =======================
  // PASO 1 → Validar correo
  // =======================
  enviarCorreo() {
    if (this.formCorreo.invalid) {
      this.formCorreo.markAllAsTouched();
      return;
    }

    const correo = this.formCorreo.value.correo;
    const user = this.userSrv.buscarPorCorreo(correo);

    if (!user) {
      this.formCorreo.get('correo')?.setErrors({
        noExiste: this.err.usuarioNoExiste(),
      });
      return;
    }

    // Simulación de envío de código
    this.correoValidado = correo;
    this.codigoGenerado = '123456';

    this.paso = 2;
  }

  /**
   * @description Paso 2: valida el formulario de código e intenta comprobar
   * que el código introducido coincida con el código generado.
   * @returns Nada (`void`).
   * @usageNotes
   * Si el código no coincide, se establece un error en el formulario `formCodigo`
   * con la clave `incorrecto`.
   */
  // =======================
  // PASO 2 → Validar código
  // =======================
  verificarCodigo() {
    if (this.formCodigo.invalid) {
      this.formCodigo.markAllAsTouched();
      return;
    }

    if (this.formCodigo.value.codigo !== this.codigoGenerado) {
      this.formCodigo.setErrors({
        incorrecto: this.err.codigoInvalido(),
      });
      return;
    }

    this.paso = 3;
  }

  /**
   * @description Paso 3: valida el formulario de nueva clave y, si es correcto,
   * actualiza la contraseña del usuario usando `UserService`.
   * @returns Nada (`void`).
   * @usageNotes
   * - En éxito, muestra un toast de confirmación, reinicia todos los formularios
   *   y vuelve a `paso = 1`.
   * - En error, marca un error genérico en `formClave`.
   */
  // =======================
  // PASO 3 → Cambiar clave
  // =======================
  actualizarClave() {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }

    const ok = this.userSrv.cambiarClave(this.correoValidado, this.formClave.value.clave);

    if (!ok) {
      this.formClave.setErrors({
        error: this.err.errorInesperado(),
      });
      return;
    }

    this.notifSrv.showSuccess('Contraseña restaurada con éxito.');
    this.paso = 1;

    // Reiniciar todo
    this.formCorreo.reset();
    this.formCodigo.reset();
    this.formClave.reset();
  }
}
