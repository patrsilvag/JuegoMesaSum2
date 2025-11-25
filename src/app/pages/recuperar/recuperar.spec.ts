import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecuperarComponent } from './recuperar';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { ValidatorsService } from '../../core/validators.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { Usuario } from '../../core/auth';

/** Fake realista de ValidatorsService */
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
  coincidenClaves(c1: string, c2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fg = group as FormGroup;
      return fg.get(c1)?.value === fg.get(c2)?.value ? null : { noCoinciden: true };
    };
  }
}

describe('RecuperarComponent (Angular 20)', () => {
  let component: RecuperarComponent;
  let fixture: ComponentFixture<RecuperarComponent>;
  let userSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj<UserService>('UserService', ['buscarPorCorreo', 'cambiarClave']);

    const errStub: Partial<AuthErrorService> = {
      usuarioNoExiste: () => 'usuarioNoExiste',
      codigoInvalido: () => 'codigoInvalido',
      errorInesperado: () => 'errorInesperado',
    };

    await TestBed.configureTestingModule({
      imports: [RecuperarComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: ValidatorsService, useClass: FakeValidatorsService },
        { provide: AuthErrorService, useValue: errStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit + forms
  });

  it('debe crear el componente e inicializar formularios', () => {
    expect(component).toBeTruthy();
    expect(component.formCorreo).toBeTruthy();
    expect(component.formCodigo).toBeTruthy();
    expect(component.formClave).toBeTruthy();
    expect(component.paso).toBe(1);
  });

  // =======================
  // PASO 1 → enviarCorreo()
  // =======================
  it('enviarCorreo() debe marcar touched y no llamar servicio si formCorreo inválido', () => {
    component.enviarCorreo();
    expect(component.formCorreo.touched).toBeTrue();
    expect(userSpy.buscarPorCorreo).not.toHaveBeenCalled();
    expect(component.paso).toBe(1);
  });

  it('enviarCorreo() debe setear error noExiste si correo no está registrado', () => {
    userSpy.buscarPorCorreo.and.returnValue(null);

    component.formCorreo.setValue({ correo: 'noexiste@mail.com' });
    component.enviarCorreo();

    expect(userSpy.buscarPorCorreo).toHaveBeenCalledWith('noexiste@mail.com');
    const correoCtrl = component.formCorreo.get('correo');
    expect(correoCtrl?.errors?.['noExiste']).toBe('usuarioNoExiste');
    expect(component.paso).toBe(1);
  });

  it('enviarCorreo() debe avanzar a paso 2 si correo existe', () => {
    const usuarioMock: Usuario = {
      nombre: 'Test',
      usuario: 'tester',
      correo: 'test@mail.com',
      fechaNacimiento: '2000-01-01',
      clave: 'A123456!',
      rol: 'cliente',
      direccion: '',
    };

    userSpy.buscarPorCorreo.and.returnValue(usuarioMock);

    component.formCorreo.setValue({ correo: 'test@mail.com' });
    component.enviarCorreo();

    expect(userSpy.buscarPorCorreo).toHaveBeenCalledWith('test@mail.com');
    expect(component.correoValidado).toBe('test@mail.com');
    expect(component.codigoGenerado).toBe('123456'); // según tu código
    expect(component.paso).toBe(2);
  });

  // ==========================
  // PASO 2 → verificarCodigo()
  // ==========================
  it('verificarCodigo() no avanza si formCodigo inválido', () => {
    component.paso = 2;
    component.verificarCodigo();
    expect(component.formCodigo.touched).toBeTrue();
    expect(component.paso).toBe(2);
  });

  it('verificarCodigo() debe setear error incorrecto si código no coincide', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';
    component.formCodigo.setValue({ codigo: '000000' });

    component.verificarCodigo();

    expect(component.formCodigo.errors?.['incorrecto']).toBe('codigoInvalido');
    expect(component.paso).toBe(2);
  });

  it('verificarCodigo() debe avanzar a paso 3 si código coincide', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';
    component.formCodigo.setValue({ codigo: '123456' });

    component.verificarCodigo();

    expect(component.formCodigo.errors).toBeNull();
    expect(component.paso).toBe(3);
  });

  // =========================
  // PASO 3 → actualizarClave()
  // =========================
  it('actualizarClave() no llama servicio si formClave inválido', () => {
    component.paso = 3;
    component.actualizarClave();

    expect(component.formClave.touched).toBeTrue();
    expect(userSpy.cambiarClave).not.toHaveBeenCalled();
  });

  it('actualizarClave() debe setear error si cambiarClave devuelve false', () => {
    component.paso = 3;
    component.correoValidado = 'test@mail.com';
    userSpy.cambiarClave.and.returnValue(false);

    component.formClave.setValue({
      clave: 'A123456!',
      clave2: 'A123456!',
    });

    component.actualizarClave();

    expect(userSpy.cambiarClave).toHaveBeenCalledWith('test@mail.com', 'A123456!');
    expect(component.formClave.errors?.['error']).toBe('errorInesperado');
    expect(component.mensajeExito).toBeFalse();
  });

  it('actualizarClave() debe mostrar éxito, reiniciar y volver a paso 1 si ok', fakeAsync(() => {
    component.paso = 3;
    component.correoValidado = 'test@mail.com';
    userSpy.cambiarClave.and.returnValue(true);

    component.formClave.setValue({
      clave: 'A123456!',
      clave2: 'A123456!',
    });

    component.actualizarClave();

    expect(userSpy.cambiarClave).toHaveBeenCalledWith('test@mail.com', 'A123456!');
    expect(component.mensajeExito).toBeTrue();

    // reinicia todo
    expect(component.paso).toBe(1);
    expect(component.formCorreo.pristine).toBeTrue();
    expect(component.formCodigo.pristine).toBeTrue();
    expect(component.formClave.pristine).toBeTrue();

    tick(2500);
    expect(component.mensajeExito).toBeFalse();
  }));
});
