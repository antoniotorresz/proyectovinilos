
# Music Market - Frontend

Frontend del proyecto **Music Market**, desarrollado con React, TypeScript y Vite.

La aplicación permite explorar publicaciones de productos musicales como vinilos, CDs y cassettes, además de gestionar las publicaciones asociadas a un usuario.

## Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Requisitos previos

Antes de ejecutar el frontend es necesario tener instalado:

- Node.js
- npm

Para comprobar la instalación:

```bash
node --version
npm --version
```

## Instalación

Después de clonar el repositorio, abrir una terminal en la carpeta del frontend:

```bash
cd ui
```

Instalar las dependencias:

```bash
npm install
```

## Ejecutar el frontend

Desde la carpeta `ui` ejecutar:

```bash
npm run dev
```

Vite iniciará el servidor de desarrollo.

Por defecto la aplicación estará disponible en:

```text
http://localhost:5173
```

## Backend

El frontend consume la API REST del proyecto Spring Boot.

El backend debe estar ejecutándose en:

```text
http://localhost:8080
```

Desde la raíz del proyecto se puede iniciar con:

```bash
mvn spring-boot:run
```

Antes de iniciar el backend se debe configurar correctamente la conexión a la base de datos.

## Ejecución completa del proyecto

Se recomienda utilizar dos terminales.

### Terminal 1 - Backend

Desde la raíz del proyecto:

```bash
mvn spring-boot:run
```

### Terminal 2 - Frontend

Desde la carpeta `ui`:

```bash
npm install
npm run dev
```

Después abrir:

```text
http://localhost:5173
```

## Estructura principal del frontend

```text
ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── publications/
│   │   │   └── ui/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── imports/
│   ├── styles/
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Páginas

Actualmente el frontend dispone de las siguientes rutas:

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/explore` | Exploración de publicaciones |
| `/publish` | Crear una publicación |
| `/my-publications` | Publicaciones del usuario |
| `/profile` | Perfil del usuario |
| `/publications/:id/edit` | Editar una publicación |

## Integración con la API

Los servicios encargados de comunicarse con Spring Boot se encuentran en:

```text
src/app/services/
```

La interfaz de datos de las publicaciones se encuentra en:

```text
src/app/types/Publication.ts
```

El frontend actualmente permite consultar publicaciones, consultar publicaciones de un usuario, crear publicaciones, editar publicaciones y eliminar publicaciones.

## Notas de desarrollo

Actualmente se utiliza el usuario con ID `1` como usuario de prueba para las operaciones relacionadas con publicaciones.

Esta asociación es temporal mientras se implementa el sistema definitivo de autenticación y sesión de usuario.