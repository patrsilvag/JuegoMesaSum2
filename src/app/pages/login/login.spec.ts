import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService, LoginResultado } from '../../core/auth.service';
import { ActivatedRoute, provideRouter, Router, RouterLink } from '@angular/router';
import { Usuario } from '../../core/auth';

describe('LoginComponent (Angular 20)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterLink],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
        // evitar error rootRoute
        { provide: ActivatedRoute, useValue: { snapshot: { root: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el formulario inválido cuando los campos están vacíos', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debe iniciar sesión y navegar si credenciales válidas', () => {
    const usuarioMock: Usuario = {
      nombre: 'Test',
      usuario: 'tester',
      correo: 'test@mail.com',
      fechaNacimiento: '2000-01-01',
      clave: 'A123456',
      rol: 'cliente',
    };

    const resultadoOk: LoginResultado = { ok: true, usuario: usuarioMock };
    authSpy.login.and.returnValue(resultadoOk);

    component.form.setValue({
      correo: 'test@mail.com',
      clave: 'A123456',
    });

    component.submit();

    expect(authSpy.login).toHaveBeenCalledWith('test@mail.com', 'A123456');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.errorLogin).toBeFalsy(); // pasa con '' o null
  });

  it('debe mostrar error si credenciales inválidas', () => {
    const resultadoFail: LoginResultado = {
      ok: false,
      mensaje: 'Correo o contraseña incorrecta',
    };
    authSpy.login.and.returnValue(resultadoFail);

    component.form.setValue({
      correo: 'test@mail.com',
      clave: 'incorrecta',
    });

    component.submit();

    expect(authSpy.login).toHaveBeenCalledWith('test@mail.com', 'incorrecta');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.errorLogin).toBe('Correo o contraseña incorrecta');
  });

  it('no debe llamar login si formulario inválido', () => {
    component.submit();
    expect(authSpy.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
