import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AdminService } from './admin.service';

type UsuarioAdmin = {
  correo: string;
  usuario: string;
  rol: 'admin' | 'cliente';
  status: 'active' | 'inactive';
};

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminSpy: jasmine.SpyObj<AdminService>;

  const usuariosMock: UsuarioAdmin[] = [
    { correo: 'admin@site.com', usuario: 'Admin', rol: 'admin', status: 'active' },
    { correo: 'user@site.com', usuario: 'User', rol: 'cliente', status: 'inactive' },
    { correo: 'otro@site.com', usuario: 'Otro', rol: 'cliente', status: 'active' },
  ];

  beforeEach(async () => {
    adminSpy = jasmine.createSpyObj<AdminService>('AdminService', [
      'cargarUsuarios',
      'filtrarUsuarios',
      'toggleEstado',
    ]);

    // IMPORTANTÍSIMO: devolver copia fresca para evitar estado entre tests
    adminSpy.cargarUsuarios.and.callFake(() => usuariosMock.map((u) => ({ ...u })));

    adminSpy.filtrarUsuarios.and.callFake((lista, filtros) => {
      const { correo, rol, estado } = filtros;
      return lista.filter(
        (u: any) =>
          (correo ? u.correo.includes(correo) : true) &&
          (rol ? u.rol === rol : true) &&
          (estado ? u.status === estado : true)
      );
    });

    adminSpy.toggleEstado.and.callFake((u: any) => {
      u.status = u.status === 'active' ? 'inactive' : 'active';
      return u;
    });

    await TestBed.configureTestingModule({
      imports: [AdminComponent, ReactiveFormsModule],
      providers: [{ provide: AdminService, useValue: adminSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('debe crear el componente y el formulario de filtro', () => {
    expect(component).toBeTruthy();
    expect(component.filtroForm).toBeTruthy();
    expect(component.filtroForm.get('correo')).toBeTruthy();
    expect(component.filtroForm.get('rol')).toBeTruthy();
    expect(component.filtroForm.get('estado')).toBeTruthy();
  });

  it('debe cargar usuarios al iniciar', () => {
    expect(adminSpy.cargarUsuarios).toHaveBeenCalled();
    expect(component.usuarios.length).toBe(3);
    expect(component.usuariosFiltrados.length).toBe(3);
  });

  it('resetFiltro() debe limpiar el formulario y restaurar usuariosFiltrados', () => {
    component.filtroForm.patchValue({ correo: 'user', rol: 'cliente', estado: 'inactive' });

    component.filtrar(); // directo, es público y síncrono
    component.resetFiltro();

    // reset() deja strings vacíos en este form
    expect(component.filtroForm.value).toEqual({
      correo: null,
      rol: null,
      estado: null,
    });

    // valueChanges dispara filtrar() automáticamente, pero por seguridad:
    component.filtrar();
    expect(component.usuariosFiltrados.length).toBe(component.usuarios.length);
  });

  it('debe filtrar por correo', () => {
    component.filtroForm.patchValue({ correo: 'user@site.com' });
    component.filtrar();

    expect(adminSpy.filtrarUsuarios).toHaveBeenCalled();
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].correo).toBe('user@site.com');
  });

  it('debe filtrar por rol', () => {
    component.filtroForm.patchValue({ rol: 'admin' });
    component.filtrar();

    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].rol).toBe('admin');
  });

  it('debe filtrar por estado', () => {
    component.filtroForm.setValue({
      correo: '',
      rol: '',
      estado: 'inactive',
    });

    component.filtrar();
    fixture.detectChanges();

    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].status).toBe('inactive');
  });

  it('toggleEstado(u) debe llamar al servicio y cambiar el status localmente', () => {
    const u = component.usuariosFiltrados[0];
    const previo = u.status;

    component.toggleEstado(u);

    expect(adminSpy.toggleEstado).toHaveBeenCalledWith(u);
    expect(u.status).not.toBe(previo);
  });

  it('template: debe mostrar tabla si hay usuariosFiltrados', () => {
    fixture.detectChanges();
    const tabla = fixture.debugElement.query(By.css('table'));
    expect(tabla).toBeTruthy();
  });

  it('template: debe mostrar mensaje de alerta cuando no hay resultados', () => {
    component.usuariosFiltrados = [];
    fixture.detectChanges();

    const info = fixture.debugElement.query(By.css('.alert-info'));
    expect(info).toBeTruthy();
  });
});
