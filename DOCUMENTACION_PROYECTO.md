# 📚 Documentación Completa del Proyecto - Sistema de Gestión de Clientes

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Frontend - Next.js](#frontend---nextjs)
5. [Backend - Strapi](#backend---strapi)
6. [API REST - Endpoints](#api-rest---endpoints)
7. [Autenticación](#autenticación)
8. [Tipos de Datos](#tipos-de-datos)
9. [Componentes Frontend](#componentes-frontend)
10. [Hooks Personalizados](#hooks-personalizados)
11. [Funcionalidades Implementadas](#funcionalidades-implementadas)
12. [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)

---

## 📌 Descripción General

Este es un **Sistema Full-Stack de Gestión de Clientes** que utiliza una arquitectura moderna con:

- **Frontend**: Next.js 16 con TypeScript
- **Backend**: Strapi v5.35 (CMS Headless)
- **Base de Datos**: SQLite (mejor-sqlite3)
- **Autenticación**: JWT (JSON Web Tokens) con React Query para manejo de estado
- **Estilos**: Tailwind CSS + Radix UI

### Objetivo Principal

Proporcionar una plataforma para gestionar clientes de manera eficiente, permitiendo:

- Registro e inicio de sesión de usuarios
- Visualización de lista de clientes
- Cambio de contraseña
- Manejo de datos de contratos y estados de servicios

---

## 🏗️ Arquitectura del Proyecto

### Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│  - Interfaz de usuario                                       │
│  - Autenticación de usuarios                                 │
│  - Gestión de estado con React Query                         │
│  - Comunicación con API Strapi                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ↓ HTTP/HTTPS ↓
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    API REST (Strapi)                         │
│  - Endpoints de autenticación (/api/auth/*)                 │
│  - Endpoints de clientes (/api/clientes)                    │
│  - Endpoints de home-page (/api/home-page)                  │
│  - Endpoints de usuarios (/api/users)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ↓ Lógica Negocio ↓
                           │
┌──────────────────────────┴──────────────────────────────────┐
│              BACKEND (Strapi + Middleware)                   │
│  - Controladores (Controllers)                              │
│  - Servicios (Services)                                     │
│  - Esquemas de contenido (Content-Types)                    │
│  - Autenticación y autorización                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ↓ Consultas SQL ↓
                           │
┌──────────────────────────┴──────────────────────────────────┐
│              BASE DE DATOS (SQLite)                          │
│  - Tabla: clientes                                           │
│  - Tabla: strapi_users_permissions_user                      │
│  - Tabla: home_page                                          │
│  - Tablas de sistema Strapi                                 │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

### Backend

```
backend/
├── config/                          # Configuración de Strapi
│   ├── admin.ts                     # Config del panel admin
│   ├── api.ts                       # Config de API
│   ├── database.ts                  # Config de base de datos
│   ├── middlewares.ts               # Middlewares globales
│   ├── plugins.ts                   # Plugins de Strapi
│   └── server.ts                    # Config del servidor (puerto, host)
│
├── src/
│   ├── api/                         # Definición de APIs/Modelos
│   │   ├── cliente/                 # API de clientes
│   │   │   ├── content-types/       # Esquemas de contenido
│   │   │   │   └── cliente/schema.json
│   │   │   ├── controllers/         # Lógica de controladores
│   │   │   │   └── cliente.ts
│   │   │   ├── routes/              # Definición de rutas
│   │   │   │   └── cliente.ts
│   │   │   └── services/            # Servicios de negocio
│   │   │       └── cliente.ts
│   │   │
│   │   └── home-page/               # API de página principal
│   │       ├── content-types/
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── services/
│   │
│   ├── components/                  # Componentes reutilizables
│   │   ├── component/
│   │   │   └── link.json            # Componente link
│   │   └── layout/
│   │       └── hero-section.json    # Componente hero-section
│   │
│   ├── extensions/                  # Extensiones de Strapi
│   │   └── users-permissions/       # Plugin de usuarios
│   │       └── content-types/
│   │           └── user/schema.json
│   │
│   └── index.ts                     # Punto de entrada
│
├── database/
│   └── migrations/                  # Migraciones de BD
│
├── public/
│   ├── robots.txt
│   └── uploads/                     # Archivos subidos
│
├── package.json                     # Dependencias
├── tsconfig.json                    # Config TypeScript
└── pnpm-workspace.yaml             # Config workspace
```

### Frontend

```
frontend/
├── app/                             # Rutas y layouts (App Router)
│   ├── layout.tsx                   # Layout raíz
│   ├── page.tsx                     # Página de inicio
│   ├── globals.css                  # Estilos globales
│   │
│   ├── (auth)/                      # Grupo de rutas de autenticación
│   │   ├── layout.tsx
│   │   ├── signin/page.tsx          # Página de inicio de sesión
│   │   └── signup/page.tsx          # Página de registro
│   │
│   └── dashboard/                   # Área privada
│       ├── layout.tsx
│       └── page.tsx
│
├── components/                      # Componentes React
│   ├── icons/
│   │   └── Icons.tsx                # Iconos de la app
│   ├── pages/                       # Componentes por página
│   │   ├── auth/
│   │   │   ├── sing-in-form.tsx    # Formulario de login
│   │   │   └── sing-up-form.tsx    # Formulario de registro
│   │   └── dashboard/
│   │       ├── header-control.tsx   # Header del dashboard
│   │       └── header-search.tsx    # Búsqueda en header
│   └── ui/                          # Componentes UI reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       ├── change-pass.tsx          # Componente cambio de contraseña
│       ├── clients.tsx              # Listado de clientes
│       ├── form-error.tsx           # Mensajes de error
│       ├── hero-section.tsx         # Sección hero
│       ├── input.tsx
│       ├── label.tsx
│       ├── li-control-header.tsx
│       ├── li-option-client.tsx
│       ├── li.tsx
│       ├── searchInput.tsx          # Input de búsqueda
│       └── ul.tsx
│
├── hooks/                           # Hooks personalizados
│   ├── useClickOutside.ts           # Detectar click fuera
│   ├── useClients.ts                # Hook para obtener clientes
│   ├── usePasswordToggle.ts         # Toggle mostrar contraseña
│   └── useUser.ts                   # Hook para obtener datos del usuario
│
├── lib/                             # Funciones/librerías utilitarias
│   ├── api.ts                       # Cliente fetch con autenticación
│   ├── endpoint-api.ts              # Funciones específicas de endpoints
│   ├── login-register.ts            # Servicios de autenticación
│   └── utils.ts                     # Funciones auxiliares
│
├── actions/                         # Server Actions (Next.js)
│   ├── auth.ts                      # Acciones de autenticación
│   └── index.ts
│
├── types/                           # Tipos TypeScript
│   └── typeClients.ts               # Tipos de datos de clientes y usuarios
│
├── validations/                     # Validaciones de formularios
│   └── auth.ts                      # Esquemas Zod para autenticación
│
├── public/                          # Archivos estáticos
├── package.json                     # Dependencias
├── tsconfig.json                    # Config TypeScript
├── next.config.ts                   # Config Next.js
├── tailwind.config.mjs              # Config Tailwind CSS
└── postcss.config.mjs               # Config PostCSS
```

---

## 🎨 Frontend - Next.js

### Características Principales

#### 1. **Arquitectura de Rutas**

- **Rutas públicas**: `/signin`, `/signup`, `/` (inicio)
- **Rutas protegidas**: `/dashboard`
- **Layout grouping** para organizar rutas relacionadas

#### 2. **Autenticación**

- JWT almacenado en cookies HTTP-only
- Refresh token automático cuando expira
- Protección de rutas con middleware

#### 3. **Gestión de Estado**

- **React Query**: Para gestionar estado de datos y caché
- **Hooks personalizados**: Para lógica compartida
- **Server Actions**: Para operaciones del lado del servidor

#### 4. **Estilización**

- **Tailwind CSS v4**: Utilidades CSS
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconos SVG
- **React Icons**: Más iconos

### Flujos Principales

#### **Flujo de Registro**

```
Usuario clic en "Signup"
    ↓
Completa formulario (fullname, lastname, username, email, password)
    ↓
Validación con Zod (SignupFormSchema)
    ↓
Server Action: registerUserAction()
    ↓
Llamada API: POST /api/auth/local/register
    ↓
Strapi retorna JWT + User data
    ↓
JWT se guarda en cookie
    ↓
Redireccionar a /dashboard
```

#### **Flujo de Login**

```
Usuario clic en "Signin"
    ↓
Completa formulario (username/email, password)
    ↓
Validación con Zod (SigninFormSchema)
    ↓
Server Action: signInUserAction()
    ↓
Llamada API: POST /api/auth/local
    ↓
Strapi retorna JWT + User data
    ↓
JWT se guarda en cookie
    ↓
Redireccionar a /dashboard
```

#### **Flujo de Obtener Clientes**

```
Dashboard cargado
    ↓
Hook useClients() iniciado
    ↓
fetchClients() ejecutado
    ↓
fetch GET /api/clientes con JWT
    ↓
Strapi retorna array de clientes
    ↓
React Query cachea los datos (5 minutos)
    ↓
Componente <Clients /> renderiza la lista
```

---

## 🚀 Backend - Strapi

### Versión y Configuración

- **Versión**: 5.35.0
- **Base de Datos**: SQLite (mejor-sqlite3)
- **Node.js requerido**: >=20.0.0 <=24.x.x
- **Puerto por defecto**: 1337
- **Host**: 0.0.0.0

### Content-Types (Modelos de Datos)

#### 1. **Cliente** (Collection Type)

- **Nombre en BD**: `clientes`
- **Publicación**: Draft and Publish habilitado
- **Campos**:
  - `nombres` (string): Nombre del cliente
  - `apellidos` (string): Apellido del cliente
  - `identificacion` (string): Cédula/DNI (8-13 caracteres)
  - `contrato` (biginteger): Número de contrato
  - `ciudad` (string): Ciudad de residencia
  - `email` (email): Correo electrónico
  - `telefono` (biginteger): Teléfono
  - `estado` (enum): ACTIVO | CORTADO | SUSPENDIDO | TERMINADO
  - `valores` (decimal): Valor del contrato o deuda

#### 2. **Home Page** (Single Type)

- **Nombre en BD**: `home_page`
- **Propósito**: Contenido editable de la página principal
- **Población de datos**:
  ```
  - title: Título de la página
  - description: Descripción para SEO
  - sections: Array de secciones (Hero, Testimonios, etc.)
    - layout.hero-section:
      - image: Imagen de fondo
      - link: Botón CTA
      - text: Contenido de texto
  ```

#### 3. **User** (Extendido de Users & Permissions)

- **Campos adicionales**:
  - `fullname` (string): Nombre completo del usuario
  - `lastname` (string): Apellido del usuario
  - (Heredados: username, email, password, role)

### Componentes Reutilizables

#### **Hero Section** (`layout/hero-section.json`)

```json
{
  "displayName": "Hero Section",
  "attributes": {
    "image": { "type": "media" },
    "link": { "type": "component", "repeatable": false },
    "text": { "type": "richtext" }
  }
}
```

#### **Link** (`component/link.json`)

```json
{
  "displayName": "Link",
  "attributes": {
    "label": { "type": "string" },
    "url": { "type": "string" },
    "isExternal": { "type": "boolean" }
  }
}
```

### Controladores y Servicios

#### **Cliente Controller**

```typescript
export default factories.createCoreController("api::cliente.cliente");
```

- Utiliza controladores por defecto de Strapi
- Soporta operaciones CRUD estándar

#### **Cliente Service**

```typescript
export default factories.createCoreService("api::cliente.cliente");
```

- Lógica de negocio para manipulación de datos
- Pueden extenderse para agregar validaciones personalizadas

#### **Cliente Routes**

```typescript
export default factories.createCoreRouter("api::cliente.cliente");
```

- Genera automáticamente rutas REST:
  - `GET /api/clientes` - Listar todos
  - `GET /api/clientes/:id` - Obtener uno
  - `POST /api/clientes` - Crear
  - `PUT /api/clientes/:id` - Actualizar
  - `DELETE /api/clientes/:id` - Eliminar

---

## 🔌 API REST - Endpoints

### Base URL

```
http://localhost:1337/api
```

### Autenticación

#### **Registro de Usuario**

```http
POST /auth/local/register
Content-Type: application/json

{
  "fullname": "Juan",
  "lastname": "Pérez",
  "username": "juanperez",
  "email": "juan@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "juanperez",
    "email": "juan@example.com",
    "fullname": "Juan",
    "lastname": "Pérez"
  }
}
```

#### **Inicio de Sesión**

```http
POST /auth/local
Content-Type: application/json

{
  "identifier": "juanperez",  // o email
  "password": "SecurePassword123!"
}

Response (200):
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "juanperez",
    "email": "juan@example.com"
  }
}
```

#### **Refrescar Token**

```http
POST /auth/refresh
Authorization: Bearer <jwt_actual>

Response (200):
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Clientes

#### **Listar todos los clientes**

```http
GET /clientes
Authorization: Bearer <jwt>

Response (200):
{
  "data": [
    {
      "documentId": "abc123def456",
      "nombres": "Carlos",
      "apellidos": "García",
      "identificacion": "12345678",
      "contrato": 1001,
      "ciudad": "Bogotá",
      "email": "carlos@example.com",
      "telefono": 3101234567,
      "estado": "ACTIVO",
      "valores": 150.50
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 5
    }
  }
}
```

#### **Obtener cliente por ID**

```http
GET /clientes/:documentId
Authorization: Bearer <jwt>

Response (200):
{
  "data": {
    "documentId": "abc123def456",
    "nombres": "Carlos",
    "apellidos": "García",
    "identificacion": "12345678",
    "contrato": 1001,
    "ciudad": "Bogotá",
    "email": "carlos@example.com",
    "telefono": 3101234567,
    "estado": "ACTIVO",
    "valores": 150.50
  }
}
```

#### **Crear nuevo cliente**

```http
POST /clientes
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "data": {
    "nombres": "María",
    "apellidos": "López",
    "identificacion": "98765432",
    "contrato": 1002,
    "ciudad": "Medellín",
    "email": "maria@example.com",
    "telefono": 3209876543,
    "estado": "ACTIVO",
    "valores": 200.00
  }
}

Response (201):
{
  "data": { ... }
}
```

#### **Actualizar cliente**

```http
PUT /clientes/:documentId
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "data": {
    "estado": "CORTADO",
    "valores": 250.00
  }
}

Response (200):
{
  "data": { ... }
}
```

#### **Eliminar cliente**

```http
DELETE /clientes/:documentId
Authorization: Bearer <jwt>

Response (204): No content
```

### Home Page

#### **Obtener home page**

```http
GET /home-page?populate[sections][on][layout.hero-section][populate]=image,link
Authorization: Bearer <jwt>

Response (200):
{
  "data": {
    "documentId": "home123",
    "title": "Inicio",
    "description": "Página principal",
    "sections": [
      {
        "__component": "layout.hero-section",
        "image": {
          "url": "/uploads/hero.jpg",
          "alternativeText": "Imagen hero"
        },
        "link": {
          "label": "Explorar",
          "url": "/dashboard",
          "isExternal": false
        }
      }
    ]
  }
}
```

### Usuarios

#### **Obtener datos del usuario actual**

```http
GET /users/me
Authorization: Bearer <jwt>

Response (200):
{
  "id": 1,
  "username": "juanperez",
  "email": "juan@example.com",
  "fullname": "Juan",
  "lastname": "Pérez"
}
```

#### **Cambiar contraseña**

```http
POST /auth/change-password
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "password": "NewPassword123!"
}

Response (200):
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## 🔐 Autenticación

### Flujo de Autenticación

#### **1. Registro**

```
1. Usuario completa formulario en /signup
2. Server Action validateFormData() valida con Zod
3. registerUserService() envía POST a /api/auth/local/register
4. Strapi crea usuario y retorna JWT
5. JWT se guarda en cookie HTTP-only
6. Usuario redirigido a /dashboard
```

#### **2. Login**

```
1. Usuario completa formulario en /signin
2. Server Action validateFormData() valida con Zod
3. loginUserService() envía POST a /api/auth/local
4. Strapi valida credenciales y retorna JWT
5. JWT se guarda en cookie HTTP-only
6. Usuario redirigido a /dashboard
```

#### **3. Refresh Token Automático**

```
1. Componente realiza fetch con JWT
2. Si respuesta es 401 (Unauthorized)
3. fetchStrapi() detecta el error y llama a /api/auth/refresh
4. Strapi retorna nuevo JWT
5. Nuevo JWT se guarda en cookie
6. Se reintenta la solicitud original con nuevo JWT
7. Si refresh falla, usuario es desconectado
```

### Configuración de Cookies

```typescript
const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: "/",
  httpOnly: true, // No accesible desde JavaScript
  secure: true, // Solo HTTPS en producción
  domain: "localhost", // Dominio de la cookie
};
```

### Manejo de Errores de Autenticación

- **401 Unauthorized**: JWT inválido o expirado → Intenta refresh
- **403 Forbidden**: Usuario no autorizado para este recurso
- **400 Bad Request**: Datos inválidos en la solicitud
- **429 Too Many Requests**: Rate limiting (muchas solicitudes)

---

## 📦 Tipos de Datos

### Client (Cliente)

```typescript
interface Client {
  documentId: string; // ID único del documento
  nombres: string; // Nombre del cliente
  apellidos: string; // Apellido del cliente
  identificacion: string; // Cédula/DNI (8-13 caracteres)
  contrato: number; // Número de contrato
  ciudad: string; // Ciudad
  email: string; // Correo electrónico
  telefono: number; // Número de teléfono
  estado: string; // Estado: ACTIVO | CORTADO | SUSPENDIDO | TERMINADO
  valores: number; // Valor del contrato
}
```

### User (Usuario)

```typescript
interface User {
  id?: number;
  username?: string;
  email?: string;
  fullname: string; // Nombre completo
  lastname: string; // Apellido
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
}
```

### FormState (Estado de Formulario)

```typescript
interface FormState {
  success: boolean;
  message: string;
  strapiErrors: any;
  zodErrors: Record<string, string[]> | null;
  data: Record<string, any>;
}
```

### LoginData & RegisterData

```typescript
interface LoginData {
  identifier: string; // username o email
  password: string;
}

interface RegisterData {
  fullname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}
```

---

## 🎯 Componentes Frontend

### Componentes de UI

#### **Button** (`button.tsx`)

- Botón reutilizable con múltiples variantes
- Propiedades: `variant`, `size`, `disabled`, `loading`

#### **Input** (`input.tsx`)

- Input de texto con validación
- Propiedades: `type`, `placeholder`, `error`, `value`

#### **Card** (`card.tsx`)

- Contenedor de tarjeta con estilos
- Subcomponentes: `CardHeader`, `CardBody`, `CardFooter`

#### **Clients** (`clients.tsx`)

- Listado de clientes con tabla
- Muestra estado con colores diferentes
- Acciones: Ver, Editar, Eliminar

#### **HeroSection** (`hero-section.tsx`)

- Componente hero con imagen y CTA
- Recibe datos de Strapi
- Renderizado con datos dinámicos

#### **ChangePass** (`change-pass.tsx`)

- Formulario para cambiar contraseña
- Validación de contraseña actual
- Nuevas contraseñas deben coincidir

#### **SingInForm** (`sing-in-form.tsx`)

- Formulario de login
- Campo: Username/Email y Password
- Server Action: signInUserAction()

#### **SingUpForm** (`sing-up-form.tsx`)

- Formulario de registro
- Campos: Nombre, Apellido, Username, Email, Contraseña
- Server Action: registerUserAction()

### Componentes de Navegación

#### **HeaderControl** (`header-control.tsx`)

- Barra de encabezado del dashboard
- Menú de usuario
- Botón de logout

#### **HeaderSearch** (`header-search.tsx`)

- Barra de búsqueda en el header
- Búsqueda en tiempo real de clientes

---

## 🪝 Hooks Personalizados

### useClients()

```typescript
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: false, // Manual trigger
  });
}
```

- Obtiene lista de clientes
- Cachea datos por 5 minutos
- Necesita ser activado manualmente

### useUser()

```typescript
// Obtiene datos del usuario actual (fullname, lastname)
// Utiliza fetchUser() de lib/endpoint-api.ts
```

### usePasswordToggle()

```typescript
// Hook para mostrar/ocultar contraseña en inputs
// Estado: passwordVisible (boolean)
// Retorna: métodos para toggle
```

### useClickOutside()

```typescript
// Hook para detectar clicks fuera de un elemento
// Útil para cerrar menús desplegables
// Retorna: ref y estado del click
```

---

## ✨ Funcionalidades Implementadas

### 1. **Sistema de Autenticación Completo**

- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ Cambio de contraseña
- ✅ Refresh token automático
- ✅ Protección de rutas

### 2. **Gestión de Clientes**

- ✅ Visualizar lista de clientes
- ✅ Ver detalles de cliente individual
- ✅ Buscar clientes por nombre/apellido
- ✅ Filtrar por estado
- ✅ CRUD completo (crear, leer, actualizar, eliminar)

### 3. **Página Principal**

- ✅ Contenido editable desde Strapi
- ✅ Hero section dinámico
- ✅ Imagen de fondo personalizable
- ✅ CTA (Call To Action) personalizable
- ✅ SEO optimizado (metadata dinámico)

### 4. **Interfaz de Usuario**

- ✅ Diseño responsivo con Tailwind CSS
- ✅ Componentes accesibles con Radix UI
- ✅ Iconos con Lucide React
- ✅ Formularios con validación en tiempo real
- ✅ Mensajes de error/éxito claros

### 5. **Gestión de Estado**

- ✅ React Query para caché de datos
- ✅ Server Actions para operaciones del servidor
- ✅ Cookies para persistencia de sesión
- ✅ Validación con Zod

### 6. **Seguridad**

- ✅ JWT en cookies HTTP-only
- ✅ CORS configurado
- ✅ Validación en backend
- ✅ Hash de contraseñas
- ✅ Protección de rutas privadas

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos

- Node.js >=20.0.0 <=24.x.x
- npm o pnpm
- Git

### 1. Clonar Repositorio

```bash
git clone <url-repositorio>
cd strapi-project
```

### 2. Instalar Dependencias

#### Backend

```bash
cd backend
pnpm install
# o npm install
```

#### Frontend

```bash
cd frontend
pnpm install
# o npm install
```

### 3. Configurar Variables de Entorno

#### Backend (.env)

```
NODE_ENV=development
HOST=0.0.0.0
PORT=1337
APP_KEYS=default_app_key_1,default_app_key_2
JWT_SECRET=your-jwt-secret
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_BASE_URL=http://localhost:1337
```

### 4. Ejecutar en Desarrollo

#### Abrir 2 terminales

**Terminal 1 - Backend:**

```bash
cd backend
pnpm dev
# El servidor estará en http://localhost:1337
# Admin panel en http://localhost:1337/admin
```

**Terminal 2 - Frontend:**

```bash
cd frontend
pnpm dev
# La app estará en http://localhost:3000
```

### 5. Acceder a la Aplicación

- Frontend: [http://localhost:3000](http://localhost:3000)
- Strapi Admin: [http://localhost:1337/admin](http://localhost:1337/admin)

### 6. Compilar para Producción

#### Backend

```bash
cd backend
pnpm build
pnpm start
```

#### Frontend

```bash
cd frontend
pnpm build
pnpm start
```

---

## 📊 Estructura de Base de Datos

### Tablas Principales

```sql
-- Tabla de clientes
CREATE TABLE clientes (
  documentId TEXT PRIMARY KEY,
  nombres VARCHAR(255),
  apellidos VARCHAR(255),
  identificacion VARCHAR(13),
  contrato BIGINT,
  ciudad VARCHAR(255),
  email VARCHAR(255),
  telefono BIGINT,
  estado VARCHAR(50),
  valores DECIMAL(10, 2),
  createdAt DATETIME,
  updatedAt DATETIME,
  publishedAt DATETIME
);

-- Tabla de usuarios (Users & Permissions)
CREATE TABLE strapi_users_permissions_user (
  id INTEGER PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  fullname VARCHAR(255),
  lastname VARCHAR(255),
  provider VARCHAR(255),
  confirmed BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Tabla de home page
CREATE TABLE home_pages (
  documentId TEXT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  sections JSON,
  createdAt DATETIME,
  updatedAt DATETIME,
  publishedAt DATETIME
);
```

---

## 🔧 Configuración Importante

### next.config.ts

- Proxy a Strapi (`/proxy.ts`)
- Compresión habilitada
- Imagen optimization

### tailwind.config.mjs

- Tema personalizado
- Colores de marca
- Extensiones de plugins

### tsconfig.json

- Alias de ruta: `@/*` → `./`
- Strict mode habilitado
- Target: ES2020

---

## 🐛 Troubleshooting

### Error: "Sesión expirada, Inicia sesión nuevamente"

- JWT expiró y no se pudo refrescar
- Solución: Ingresa de nuevo a la aplicación

### Error: CORS

- Verificar configuración de CORS en Strapi
- Revisar que el frontend use la URL correcta de Strapi

### Error: Base de datos llena

- Borrar `migrations/` y reiniciar Strapi
- Datos se perderán, pero se crearán nuevas tablas

### Frontend no conecta con Backend

- Verificar que Strapi esté corriendo en puerto 1337
- Verificar variable de entorno `STRAPI_BASE_URL`
- Revisar logs de navegador (F12)

---

## 📝 Notas Importantes

1. **Seguridad**: Cambiar `APP_KEYS` y `JWT_SECRET` en producción
2. **Base de datos**: SQLite es para desarrollo, usar PostgreSQL en producción
3. **Variables de entorno**: Nunca commitear archivos .env
4. **Despliegue**: Usar Strapi Cloud o tu servidor preferido
5. **Actualizaciones**: Ejecutar `pnpm strapi upgrade latest` regularmente

---

## 📚 Recursos Útiles

- [Documentación de Strapi](https://docs.strapi.io)
- [Documentación de Next.js](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👨‍💻 Desarrollador

Proyecto creado por: CristhianZ2022
Fecha de documentación: 13 de febrero de 2026

---

**Fin de la Documentación**
