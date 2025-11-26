import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthErrorService } from './auth-error.service';

/**
 * @description Colección de validadores personalizados reutilizables para formularios reactivos.
 * Incluye reglas de complejidad de contraseña, coincidencia de campos y validaciones de fechas.
 * @usageNotes
 * Todos los métodos devuelven funciones compatibles con la API de validadores de Angular:
 * `(control: AbstractControl) => ValidationErrors | null` o validadores de grupo.
 * Úsalos en `FormControl` o `FormGroup` junto con los validadores estándar.
 */
@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  /**
   * @description Inyecta el servicio de errores de autenticación para obtener
   * mensajes reutilizables (por ejemplo, cuando las claves no coinciden).
   * @param err Servicio centralizado de mensajes de error de autenticación.
   */
  constructor(private err: AuthErrorService) {}
  /**
   * @description Validador que exige que el valor contenga al menos una letra mayúscula.
   * @returns Función validadora que devuelve:
   * - `null` si el valor contiene al menos una mayúscula.
   * - `{ uppercase: true }` si no se encuentra ninguna mayúscula.
   * @usageNotes
   * Suele usarse como parte de la validación de contraseñas.
   * ```ts
   * clave: new FormControl('', [validatorsService.uppercaseValidator()])
   * ```
   */
  uppercaseValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[A-Z]/.test(c.value || '') ? null : { uppercase: true };
  }

  /**
   * @description Validador que exige que el valor contenga al menos un dígito numérico.
   * @returns Función validadora que devuelve:
   * - `null` si el valor contiene al menos un número.
   * - `{ number: true }` si no contiene ningún dígito.
   * @usageNotes
   * Útil para reforzar la complejidad de contraseñas u otros campos que requieran números.
   */
  numberValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[0-9]/.test(c.value || '') ? null : { number: true };
  }

  /**
   * @description Validador que exige al menos un carácter especial (no alfanumérico).
   * @returns Función validadora que devuelve:
   * - `null` si el valor contiene al menos un carácter especial.
   * - `{ special: true }` si solo contiene letras y números.
   * @usageNotes
   * Normalmente se combina con `uppercaseValidator` y `numberValidator`
   * para construir una política de contraseñas robusta.
   */
  specialValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[^A-Za-z0-9]/.test(c.value || '') ? null : { special: true };
  }

  /**
   * @description Validador a nivel de `FormGroup` que verifica que dos campos de contraseña coincidan.
   * @param clave Nombre del control dentro del grupo que contiene la contraseña original.
   * @param repetirClave Nombre del control dentro del grupo que contiene la repetición de la contraseña.
   * @returns Función validadora que devuelve:
   * - `null` si los valores de ambos controles coinciden.
   * - `{ noCoinciden: string }` con el mensaje de error proporcionado por `AuthErrorService`
   *   si los valores difieren.
   * @usageNotes
   * Diseñado para formularios que tienen dos campos de contraseña:
   * ```ts
   * this.form = this.fb.group({
   *   clave: ['', ...],
   *   repetirClave: ['', ...],
   * }, {
   *   validators: this.validatorsService.coincidenClaves('clave', 'repetirClave')
   * });
   * ```
   */
  coincidenClaves(clave: string, repetirClave: string) {
    return (group: AbstractControl): ValidationErrors | null =>
      group.get(clave)?.value === group.get(repetirClave)?.value
        ? null
        : { noCoinciden: this.err.clavesNoCoinciden() };
  }

  /**
   * @description Validador que marca error cuando la fecha introducida es posterior a la fecha actual.
   * @returns Función validadora que devuelve:
   * - `null` si el campo está vacío o la fecha no es futura.
   * - `{ fechaFutura: true }` si la fecha es posterior al día de hoy.
   * @usageNotes
   * Compara las fechas con la hora normalizada a medianoche (00:00:00),
   * evitando falsos positivos por diferencias de horas o milisegundos.
   */
  fechaFuturaValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;

      const fecha = new Date(valor);
      const hoy = new Date();

      hoy.setHours(0, 0, 0, 0);
      fecha.setHours(0, 0, 0, 0);

      return fecha > hoy ? { fechaFutura: true } : null;
    };
  }

  /**
   * @description Validador que comprueba si la fecha de nacimiento cumple una edad mínima.
   * @param minEdad Edad mínima requerida (en años completos).
   * @returns Función validadora que devuelve:
   * - `null` si el campo está vacío o la edad calculada es mayor o igual a `minEdad`.
   * - `{ edadMinima: true }` si la edad es menor que la requerida.
   * @usageNotes
   * Calcula la edad teniendo en cuenta año, mes y día para evitar errores
   * en los límites (por ejemplo, si aún no ha llegado el cumpleaños de este año).
   */
  edadMinimaValidator(minEdad: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;

      const fechaNacimiento = new Date(valor);
      const hoy = new Date();

      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }

      return edad < minEdad ? { edadMinima: true } : null;
    };
  }
}
