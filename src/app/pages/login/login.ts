import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginResultado } from '../../core/auth.service';
import { AuthErrorService } from '../../core/auth-error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
/**
 * @description Página de inicio de sesión. Gestiona un formulario reactivo
 * con correo y contraseña, delegando la autenticación en `AuthService`.
 * @usageNotes
 * - El mensaje de error de login se expone en `errorLogin`.
 * - Tras un login exitoso se navega a la ruta raíz (`'/'`).
 * - El formulario define los campos `correo` y `clave`.
 */
export class LoginComponent {
  form!: FormGroup;
  verClave = false;
  errorLogin = '';
  /**
   * @description Inicializa el formulario de login con validación básica
   * de correo y contraseña.
   * @param fb Factoría para construir el formulario reactivo.
   * @param authSrv Servicio responsable de autenticar al usuario.
   * @param err Servicio centralizado de mensajes de error de autenticación.
   * @param router Router de Angular usado para redirigir tras el login.
   */
  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private err: AuthErrorService,
    private router: Router
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required]],
    });
  }

  /**
   * @description Devuelve un control del formulario de login por nombre.
   * @param nombre Nombre del control (por ejemplo, `'correo'` o `'clave'`).
   * @returns El control de formulario correspondiente (no nulo).
   */
  campo(nombre: string) {
    return this.form.get(nombre)!;
  }

  /**
   * @description Intenta autenticar al usuario usando los valores del formulario.
   * Si el formulario es inválido, no hace nada. Si las credenciales fallan,
   * rellena `errorLogin` con el mensaje devuelto por `AuthErrorService`.
   * @returns Nada (`void`).
   * @usageNotes
   * Este método debería llamarse desde el submit del formulario en la plantilla.
   */
  submit() {
    if (this.form.invalid) return;

    const { correo, clave } = this.form.value;

    const resultado: LoginResultado = this.authSrv.login(correo, clave);

    if (!resultado.ok) {
      this.errorLogin = resultado.mensaje;
      return;
    }

    this.router.navigate(['/']);
  }
}
