import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  uppercaseValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[A-Z]/.test(c.value || '') ? null : { uppercase: true };
  }

  numberValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[0-9]/.test(c.value || '') ? null : { number: true };
  }

  specialValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[^A-Za-z0-9]/.test(c.value || '') ? null : { special: true };
  }

  coincidenClaves(clave: string, repetirClave: string) {
    return (group: AbstractControl): ValidationErrors | null =>
      group.get(clave)?.value === group.get(repetirClave)?.value
        ? null
        : { noCoinciden: true };
  }

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
