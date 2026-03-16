# BookShop API - Práctica Backend Avanzado

<div align="center">

[![Node.js](https://img.shields.io/badge/nodejs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

</div>

Este proyecto es una **API REST** para una plataforma de compra y venta de libros, desarrollada como parte de la práctica de Backend Avanzado con Node.js. La API permite a los usuarios registrarse, publicar libros a la venta, buscar libros disponibles y comprarlos, con notificaciones por email y una tarea programada semanal.

El principal requisito técnico de la práctica es el uso de **Node.js** con **TypeScript**, siguiendo una arquitectura modular organizada por funcionalidad, con **Express** como framework y **MongoDB** como base de datos.

## ✨ Características Implementadas

### Funcionalidades Obligatorias

- **Autenticación de usuario**: Registro (signup) e inicio de sesión (signin) con **tokens JWT**. Las contraseñas se almacenan hasheadas con bcrypt.
- **Gestión de libros**: CRUD completo con creación, edición, eliminación (solo por el dueño) y consulta de libros.
- **Compra de libros**: Endpoint dedicado (`POST /books/:id/buy`) que cambia el estado del libro a `SOLD`, registra la fecha de venta y envía un email de notificación al vendedor.
- **Consulta pública**: Listado de libros publicados con búsqueda por título o autor y paginación. Solo muestra libros con estado `PUBLISHED`.
- **Mis libros**: Endpoint privado (`GET /me/books`) para que cada usuario vea todos sus libros (publicados y vendidos).
- **Tarea programada**: Cron job semanal (lunes a las 10:00) que envía un email sugiriendo bajada de precio a los vendedores con libros publicados hace más de 7 días.
- **Tests e2e**: 19 tests en 5 suites cubriendo los endpoints de crear libro, consultar libros, comprar libro, eliminar libro y mis libros.

### Reglas de Negocio

- **Email único**: No se pueden registrar dos usuarios con el mismo email.
- **Contraseñas hasheadas**: Las contraseñas nunca se almacenan en texto plano.
- **Solo el dueño edita y elimina**: Únicamente el propietario del libro puede modificar o eliminar sus datos.
- **No puedes comprar tu propio libro**: Validación que impide la autocompra.
- **Libros vendidos ocultos**: Los libros con estado `SOLD` no aparecen en la consulta pública.
- **Notificación al vendedor**: Al comprarse un libro, se envía un email automático al vendedor.

## 🏗️ Arquitectura

El módulo de **Books** sigue una **arquitectura hexagonal** (Ports & Adapters), separando la lógica de negocio de los detalles de infraestructura:

```text
src/books/
├── domain/           # Entidades y puertos (contratos/interfaces)
├── application/      # Casos de uso (lógica de negocio)
└── infrastructure/   # Implementaciones concretas (Express, MongoDB)
```

- **Domain**: Define las entidades (`Book`) y los puertos (`BookRepositoryPort`, `EmailPort`, `UserRepositoryPort`), sin dependencias externas.
- **Application**: Contiene los casos de uso (`CreateBookUseCase`, `BuyBookUseCase`, etc.), que orquestan la lógica de negocio usando los puertos.
- **Infrastructure**: Implementa los puertos con tecnologías concretas (Mongoose, Mailtrap, Express) y contiene el *composition root* que conecta todas las piezas.

## 🚀 Instalación y Puesta en Marcha

### Requisitos previos

- **Node.js** v22 (se incluye archivo `.nvmrc`)
- **Docker Desktop** (para MongoDB)
- **npm**

### 1. Clonar el repositorio

```bash
git clone <https://github.com/Aratea10/bookshop-practice.git>
cd bookshop-practice
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
ENVIRONMENT=local
API_PORT=3000
MONGO_USER=admin
MONGO_PASSWORD=admin123
MONGO_HOST=[localhost:27017](http://localhost:27017)
JWT_SECRET=tu_secreto_super_seguro
SENTRY_DSN=https://tu-dsn@sentry.io/123
MAILTRAP_TOKEN=tu_token_de_mailtrap
```

### 4. Levantar MongoDB con Docker

Asegúrate de tener Docker Desktop abierto:

```bash
docker-compose up -d
```

Esto iniciará un contenedor MongoDB en segundo plano.

### 5. Arrancar el servidor

```bash
npm start
```

La API estará disponible en `http://localhost:3000`

### 6. Ejecutar los tests

```bash
npm run test:e2e
```

Los tests utilizan `mongodb-memory-server`, por lo que **no necesitan Docker** ni afectan a la base de datos real.

## 📡 Endpoints

### Autenticación (públicos)

| Método | Ruta                     | Descripción                   |
| ------ | ------------------------ | ----------------------------- |
| `POST` | `/authentication/signup` | Registrar un nuevo usuario    |
| `POST` | `/authentication/signin` | Iniciar sesión (devuelve JWT) |

### Libros (públicos)

| Método | Ruta     | Descripción                                                    |
| ------ | -------- | -------------------------------------------------------------- |
| `GET`  | `/books` | Listar libros publicados (paginado, búsqueda por título/autor) |

### Libros (requieren autenticación)

| Método | Ruta                 | Descripción                       |
| ------ | -------------------- | -------------------------------   |
| `POST` | `/books`             | Crear un nuevo libro              |
| `PUT`  | `/books/:bookId`     | Editar un libro (solo el dueño)   |
| `DELETE` | `/books/:bookId`   | Eliminar un libro (solo el dueño) |
| `POST` | `/books/:bookId/buy` | Comprar un libro                  |
| `GET`  | `/me/books`          | Ver mis libros                    |

> Para los endpoints privados, envía el token en la cabecera: `Authorization: Bearer <token>`

## 🛠️ Scripts Disponibles

| Script                  | Descripción                                           |
| ----------------------- | ----------------------------------------------------- |
| `npm start`             | Arranca el servidor en modo desarrollo con hot-reload |
| `npm run start:staging` | Arranca en modo staging                               |
| `npm run start:prod`    | Arranca en modo producción                            |
| `npm run test:e2e`      | Ejecuta los tests e2e con Jest                        |
| `npm run lint`          | Ejecuta ESLint para verificar la calidad del código   |
| `npm run prettier`      | Formatea el código con Prettier                       |
| `npm run build`         | Compila el proyecto TypeScript                        |

## 🔧 Tecnologías Utilizadas

- **Node.js 22**: Entorno de ejecución JavaScript del lado del servidor.
- **TypeScript**: Superset de JavaScript con tipado estático.
- **Express**: Framework web minimalista para Node.js.
- **MongoDB**: Base de datos NoSQL orientada a documentos.
- **Mongoose**: ODM para modelar datos en MongoDB.
- **JSON Web Tokens (JWT)**: Autenticación basada en tokens.
- **bcryptjs**: Hashing de contraseñas.
- **Zod**: Validación de esquemas y datos de entrada.
- **Mailtrap**: Servicio de envío de emails.
- **node-cron**: Programación de tareas periódicas.
- **Sentry**: Monitorización y captura de errores.
- **Jest + Supertest**: Framework de testing e2e.
- **mongodb-memory-server**: Base de datos MongoDB en memoria para tests.
- **Docker**: Contenedorización de MongoDB y Mongo Express.
- **ESLint + Prettier**: Linting y formateo de código.

## 🤝 Contribución

Si quieres mejorar el proyecto:

1. Haz fork del repositorio.
2. Crea una rama: `git checkout -b feature/mi-mejora`.
3. Haz commits claros siguiendo Conventional Commits.
4. Haz push y abre un Pull Request describiendo los cambios.

---

## 📄 Licencia

Este proyecto se entrega con **Licencia MIT**.

---

## 👩‍💻 Autora

**Sara Gallego Méndez** — Estudiante Bootcamp Desarrollo Web FullStack
