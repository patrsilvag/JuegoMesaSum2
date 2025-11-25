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
export class LoginComponent {
  form!: FormGroup;
  verClave = false;
  errorLogin = '';

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

  campo(nombre: string) {
    return this.form.get(nombre)!;
  }

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
