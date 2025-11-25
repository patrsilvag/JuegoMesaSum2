import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroComponent } from './registro';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { ValidatorsService } from '../../core/validators.service';
import { Usuario } from '../../core/auth';

/**
 * Stub realista de ValidatorsService:
 * - Mantiene la misma lógica que el real
 * - Permite testear flujo del componente sin acoplarte a implementación interna
 */
class FakeValidatorsService {
  uppercaseValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      /[A-Z]/.test(c.value || '') ? null : { uppercase: true };
  }

  numberValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      /\d/.test(c.value || '') ? null : { number: true };
  }

  specialValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      /[^A-Za-z0-9]/.test(c.value || '') ? null : { special: true };
  }

  fechaFuturaValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (!c.value) return null;
      const input = new Date(c.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return input > hoy ? { fechaFutura: true } : null;
    };
  }

  edadMinimaValidator(min: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (!c.value) return null;
      const nacimiento = new Date(c.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad < min ? { edadMinima: true } : null;
    };
  }

  coincidenClaves(c1: string, c2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fg = group as FormGroup;
      const v1 = fg.get(c1)?.value;
      const v2 = fg.get(c2)?.value;
      return v1 === v2 ? null : { noCoinciden: true };
    };
  }
}

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let userSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj('UserService', ['registrarUsuario']);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: ValidatorsService, useClass: FakeValidatorsService },
        { provide: AuthErrorService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit + build form
  });

  it('debe crear el componente y el formulario', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.form.get('nombre')).toBeTruthy();
    expect(component.form.get('correo')).toBeTruthy();
  });

it('campo(nombre) debe devolver el control correcto', () => {
  const ctrl = component.campo('usuario');
  const esperado = component.form.get('usuario');

  expect(ctrl).not.toBeNull();
  expect(esperado).not.toBeNull();
  expect(ctrl!).toBe(esperado!);
});


  it('limpiar() debe resetear el formulario', () => {
    component.form.patchValue({ nombre: 'X', correo: 'a@b.com' });
    component.limpiar();
    expect(component.form.value.nombre).toBeNull();
    expect(component.form.value.correo).toBeNull();
  });

  it('submit() no debe registrar si el formulario es inválido', () => {
    component.submit();
    expect(userSpy.registrarUsuario).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue();
  });

  it('debe marcar error noCoinciden si claves no coinciden', () => {
    component.form.setValue({
      nombre: 'Test User',
      usuario: 'tester',
      correo: 'test@mail.com',
      clave: 'A123456!',
      repetirClave: 'B123456!',
      fechaNacimiento: '2000-01-01',
      direccion: '',
    });

    expect(component.form.errors).toEqual({ noCoinciden: true });
  });

  it('submit() debe llamar registrarUsuario con data correcta si formulario válido', fakeAsync(() => {
    userSpy.registrarUsuario.and.returnValue(true);

    component.form.setValue({
      nombre: 'Test User',
      usuario: 'tester',
      correo: 'test@mail.com',
      clave: 'A123456!',
      repetirClave: 'A123456!',
      fechaNacimiento: '2000-01-01',
      direccion: 'Calle 123',
    });

    component.submit();

    const expected: Usuario = {
      nombre: 'Test User',
      usuario: 'tester',
      correo: 'test@mail.com',
      clave: 'A123456!',
      fechaNacimiento: '2000-01-01',
      direccion: 'Calle 123',
      rol: 'cliente',
    };

    expect(userSpy.registrarUsuario).toHaveBeenCalledWith(expected);
    expect(component.mensajeExito).toBeTrue();

    // reset deja el form pristino
    expect(component.form.pristine).toBeTrue();

    tick(2500);
    expect(component.mensajeExito).toBeFalse();
  }));

  it('si registrarUsuario devuelve false debe setear error {existe:true} en correo', () => {
    userSpy.registrarUsuario.and.returnValue(false);

    component.form.setValue({
      nombre: 'Test User',
      usuario: 'tester',
      correo: 'repetido@mail.com',
      clave: 'A123456!',
      repetirClave: 'A123456!',
      fechaNacimiento: '2000-01-01',
      direccion: '',
    });

    component.submit();

    const correoCtrl = component.form.get('correo');
    expect(userSpy.registrarUsuario).toHaveBeenCalled();
    expect(correoCtrl?.errors).toEqual({ existe: true });
    expect(component.mensajeExito).toBeFalse();
  });
});
