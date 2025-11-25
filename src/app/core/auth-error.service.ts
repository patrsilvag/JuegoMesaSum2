import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AuthErrorService {
  // ============================
  // Mensajes básicos reutilizables
  // ============================
  credencialesInvalidas(): string {
    return 'Correo o contraseña incorrecta.';
  }

  usuarioNoExiste(): string {
    return 'No existe una cuenta registrada con este correo.';
  }

  claveIncorrecta(): string {
    return 'La contraseña actual no es correcta.';
  }

  clavesNoCoinciden(): string {
    return 'Las contraseñas no coinciden.';
  }

  codigoInvalido(): string {
    return 'El código ingresado no es válido.';
  }

  camposInvalidos(): string {
    return 'Revisa los campos obligatorios.';
  }

  errorInesperado(): string {
    return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
  }

  // ============================
  // NUEVO: Lógica de error para Fecha de Nacimiento
  // ============================
  getFechaErrorMessage(control: AbstractControl): string {
    if (!control.errors) return '';

    // Prioridad 1: Requerido
    if (control.errors['required']) return 'La fecha es obligatoria.';

    // Prioridad 2: Fecha Futura
    if (control.errors['fechaFutura']) return 'La fecha no puede ser futura.';

    // Prioridad 3: Edad Mínima
    if (control.errors['edadMinima']) return 'Debes tener al menos 13 años.';

    return '';
  }
  
  // ============================
  // Mapeo basado en códigos
  // ============================
  getMensaje(codigo: string): string {
    switch (codigo) {
      case 'CREDENCIALES_INVALIDAS':
        return this.credencialesInvalidas();

      case 'USUARIO_NO_EXISTE':
        return this.usuarioNoExiste();

      case 'CLAVE_INCORRECTA':
        return this.claveIncorrecta();

      case 'CLAVES_NO_COINCIDEN':
        return this.clavesNoCoinciden();

      case 'CODIGO_INVALIDO':
        return this.codigoInvalido();

      case 'CAMPOS_INVALIDOS':
        return this.camposInvalidos();

      default:
        return this.errorInesperado();
    }
  }
}
