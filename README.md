# Juegos de Mesa – Cuatro Esquinas

Aplicación web desarrollada con **Angular** y **TypeScript** para la exploración y compra de juegos de mesa familiares.
El proyecto fue generado con **Angular CLI 20.3.9**. 
---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Puesta en Marcha](#instalación-y-puesta-en-marcha)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Pruebas](#pruebas)
---

## Descripción General

**Juegos de Mesa – Cuatro Esquinas** es una SPA (Single Page Application) que simula una tienda de juegos de mesa.  
Permite a los usuarios:

- Explorar categorías de juegos.
- Ver el detalle de los productos.
- Agregar ítems a un carrito de compras.
- Registrarse, iniciar sesión y gestionar su perfil.
- (Opcional) Acceder a un panel de administración protegido por rol.

La aplicación está diseñada con una arquitectura modular, separando responsabilidades entre **componentes**, **servicios**, **guards** y **módulos** para favorecer la escalabilidad y el mantenimiento.
---

## Características Principales

- **Catálogo de juegos de mesa**
  - Listado de categorías.
  - Vistas de productos por categoría.
  - Detalle básico de cada juego (imagen, título, precio, etc.).

- **Carrito de compras**
  - Agregar / eliminar productos.
  - Actualizar cantidades.
  - Cálculo automático de subtotal, costo de envío y total.
  - Soporte para cupones de descuento (lógica encapsulada en servicios).

- **Autenticación de usuarios**
  - Registro de nuevos usuarios con formularios reactivos.
  - Inicio de sesión con validaciones de credenciales.
  - Gestión de sesión a nivel de frontend.

- **Perfil de usuario**
  - Visualización de datos básicos del usuario autenticado.
  - Actualización de información y cambio de contraseña.

- **Panel de administración (si aplica)**
  - Acceso protegido mediante **guards** por rol.
  - Listado de usuarios y cambio de estado (activo/inactivo).

- **Diseño responsivo**
  - Maquetación con **Bootstrap** y estilos personalizados en **SCSS**.
  - Adaptación automática a distintos tamaños de pantalla (desktop, tablet, móvil).
---

## Tecnologías Utilizadas

- **Framework Frontend:** Angular  
- **Lenguaje:** TypeScript  
- **CLI:** Angular CLI 20.3.9 :contentReference[oaicite:1]{index=1}  
- **Estilos y UI:**
  - Bootstrap (sistema de grillas, componentes básicos).
  - SCSS para estilos personalizados.
- **Pruebas:**
  - Karma + Jasmine para pruebas unitarias. :contentReference[oaicite:2]{index=2}
---

## Requisitos Previos

Antes de clonar y ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión LTS recomendada).
- [npm](https://www.npmjs.com/) (incluido con Node.js).
- Angular CLI:

```bash
npm install -g @angular/cli



## Estructura del Proyecto

La aplicación sigue una arquitectura modular organizada principalmente en **páginas** (vistas) y **componentes compartidos**. A continuación se detalla el contenido de los directorios principales dentro de `src/app`:

- **`core/`**: Contiene la lógica esencial y de única instancia, como los **guards** para proteger rutas (admin, usuarios).
- **`pages/`**: Aquí se encuentran los componentes que actúan como "vistas" o páginas completas de la aplicación:
  - **`admin/`**: Panel de gestión.
  - **`home/`**: Página de inicio (Landing page).
  - **`carrito/`**: Vista del resumen de compra.
  - **`login/`, `registro/`, `recuperar/`**: Vistas de autenticación.
  - **`categoria/`**: Exploración de productos.
- **`shared/`**: Componentes visuales reutilizables que aparecen en múltiples partes de la app, como el  **navbar**, el **footer** y las notificaciones tipo **toast**.
- **`assets/`**: Recursos estáticos, incluyendo las imágenes de las categorías de juegos.

### Árbol de Directorios

```text
+---app
|   +---core
|   |   \---guards
|   +---pages
|   |   +---admin
|   |   +---carrito
|   |   +---categoria
|   |   +---home
|   |   +---login
|   |   +---perfil
|   |   +---recuperar
|   |   \---registro
|   +---shared
|   |   +---footer
|   |   +---navbar
|   |   \---toast
|   \---styles
\---assets
    \---img
        \---categorias

## Pruebas

Las pruebas unitarias se implementan en los archivos con extensión `*.spec.ts` y cubren principalmente:

- **Creación básica** de componentes y servicios.
- **Validaciones simples** de formularios reactivos.
- **Comportamiento esperado** de métodos de lógica de negocio.

Para ejecutar las pruebas, utiliza el comando:

```bash
ng test