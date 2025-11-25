import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { ValidatorsService } from '../../core/validators.service';
import { AuthService } from '../../core/auth.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { Usuario } from '../../core/auth';
import { NotificationService } from '../../core/notification.service'; // <-- NUEVO: Importación del servicio

/** Fake de ValidatorsService alineado con PerfilComponent */
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
      return fg.get(c1)?.value === fg.get(c2)?.value ? null : { noCoinciden: true };
    };
  }
}

describe('PerfilComponent (Angular 20)', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  let userSpy: jasmine.SpyObj<UserService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let errSpy: jasmine.SpyObj<AuthErrorService>;
  let notifSpy: jasmine.SpyObj<NotificationService>; // <-- NUEVO: Spy para notificaciones

  const usuarioMock: Usuario = {
    nombre: 'Test User',
    usuario: 'tester',
    correo: 'test@mail.com',
    fechaNacimiento: '2000-01-01',
    direccion: 'Calle 1',
    clave: 'A123456!',
    rol: 'cliente',
    status: 'active',
  };

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj<UserService>('UserService', [
      'actualizarPerfil',
      'validarClaveActual',
      'cambiarClave',
    ]);

    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUsuarioActual']);

    errSpy = jasmine.createSpyObj<AuthErrorService>('AuthErrorService', [
      'errorInesperado',
      'claveIncorrecta',
    ]);

    // <-- NUEVO: Inicialización del spy de notificaciones
    notifSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['showSuccess']);

    authSpy.getUsuarioActual.and.returnValue(usuarioMock);

    userSpy.actualizarPerfil.and.returnValue(true);
    userSpy.validarClaveActual.and.returnValue(true);
    userSpy.cambiarClave.and.returnValue(true);

    errSpy.errorInesperado.and.returnValue('errorInesperado');
    errSpy.claveIncorrecta.and.returnValue('claveIncorrecta');

    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        { provide: ValidatorsService, useClass: FakeValidatorsService },
        { provide: UserService, useValue: userSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: AuthErrorService, useValue: errSpy },
        { provide: NotificationService, useValue: notifSpy }, // <-- NUEVO: Proveedor del spy
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('debe crear el componente y construir formularios si hay usuario', () => {
    expect(component).toBeTruthy();
    expect(authSpy.getUsuarioActual).toHaveBeenCalled();

    expect(component.usuario).toEqual(usuarioMock);
    expect(component.formDatos).toBeTruthy();
    expect(component.formClave).toBeTruthy();
    expect(component.formDatos.get('correo')?.disabled).toBeTrue();
  });

  it('si no hay usuario actual, no debe construir formularios', () => {
    authSpy.getUsuarioActual.and.returnValue(null);

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.usuario).toBeNull();
    expect(component.formDatos).toBeUndefined();
    expect(component.formClave).toBeUndefined();
  });

  // ==========================
  // guardarDatos()
  // ==========================
  it('guardarDatos() no debe llamar actualizarPerfil si formDatos inválido', () => {
    component.formDatos.patchValue({ nombre: '' });
    component.guardarDatos();

    expect(userSpy.actualizarPerfil).not.toHaveBeenCalled();
    expect(component.formDatos.touched).toBeTrue();
  });

  // <-- MODIFICADO: Se elimina fakeAsync y las aserciones sobre mensajeExito
  it('guardarDatos() debe llamar actualizarPerfil con datos combinados y mostrar éxito', () => {
    component.formDatos.setValue({
      nombre: 'Nuevo Nombre',
      usuario: 'nuevoUser',
      correo: usuarioMock.correo,
      fechaNacimiento: '1999-12-31',
      direccion: 'Nueva dir',
    });

    component.guardarDatos();

    const esperado: Usuario = {
      ...usuarioMock,
      ...component.formDatos.getRawValue(),
    };

    expect(userSpy.actualizarPerfil).toHaveBeenCalledWith(esperado);
    expect(component.usuario).toEqual(esperado);
    expect(notifSpy.showSuccess).toHaveBeenCalledWith('Datos de perfil actualizados.'); // <-- NUEVA ASÉRCIÓN
  });

  // <-- MODIFICADO: Se elimina la aserción sobre mensajeExito
  it('guardarDatos() si actualizarPerfil falla debe alertar y no activar mensajeExito', () => {
    userSpy.actualizarPerfil.and.returnValue(false);
    spyOn(window, 'alert');

    component.formDatos.setValue({
      nombre: 'Nuevo',
      usuario: 'nuevo',
      correo: usuarioMock.correo,
      fechaNacimiento: usuarioMock.fechaNacimiento,
      direccion: '',
    });

    component.guardarDatos();

    expect(window.alert).toHaveBeenCalledWith('errorInesperado');
   
  });

  // ==========================
  // actualizarClave()
  // ==========================
  it('actualizarClave() no debe llamar servicios si formClave inválido', () => {
    component.actualizarClave();

    expect(userSpy.validarClaveActual).not.toHaveBeenCalled();
    expect(userSpy.cambiarClave).not.toHaveBeenCalled();
    expect(component.formClave.touched).toBeTrue();
  });

  it('actualizarClave() debe setear error incorrecta si clave actual no coincide', () => {
   userSpy.validarClaveActual.and.returnValue(false); // Simula que la clave es incorrecta

   component.formClave.setValue({
     claveActual: 'mala',
     nuevaClave: 'A123456!',
     repetirClave: 'A123456!',
   });

   component.actualizarClave();

   expect(userSpy.validarClaveActual).toHaveBeenCalledWith('test@mail.com', 'mala');

   const claveActualControl = component.formClave.get('claveActual');

   // ✅ CORRECCIÓN: Esperar el valor de la cadena simulada, no 'true'.
   expect(claveActualControl?.errors).toEqual({ incorrecta: 'claveIncorrecta' });

   expect(userSpy.cambiarClave).not.toHaveBeenCalled();
  });

  it('actualizarClave() debe setear error si cambiarClave falla', () => {
    userSpy.cambiarClave.and.returnValue(false);

    component.formClave.setValue({
      claveActual: 'A123456!',
      nuevaClave: 'B123456!',
      repetirClave: 'B123456!',
    });

    component.actualizarClave();

    expect(userSpy.validarClaveActual).toHaveBeenCalledWith('test@mail.com', 'A123456!');
    expect(userSpy.cambiarClave).toHaveBeenCalledWith('test@mail.com', 'B123456!');
    expect(component.formClave.errors).toEqual({ error: 'errorInesperado' });
  });

  // <-- MODIFICADO: Se elimina fakeAsync y las aserciones sobre mensajeExito
  it('actualizarClave() debe cambiar clave, resetear form y mostrar éxito', () => {
    component.formClave.setValue({
      claveActual: 'A123456!',
      nuevaClave: 'B123456!',
      repetirClave: 'B123456!',
    });

    component.actualizarClave();

    expect(userSpy.validarClaveActual).toHaveBeenCalledWith('test@mail.com', 'A123456!');
    expect(userSpy.cambiarClave).toHaveBeenCalledWith('test@mail.com', 'B123456!');

    expect(notifSpy.showSuccess).toHaveBeenCalledWith('Contraseña actualizada con éxito.'); // <-- NUEVA ASÉRCIÓN
    expect(component.formClave.pristine).toBeTrue();
  });
});
