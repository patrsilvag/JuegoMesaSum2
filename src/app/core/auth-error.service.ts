import { Injectable } from '@angular/core';

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
