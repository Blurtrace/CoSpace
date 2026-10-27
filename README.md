# CoSpace — Plataforma de Reserva de Espacios de Coworking

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://typeorm.io/"><img src="https://img.shields.io/badge/TypeORM-0.3.17-FE0979?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://jestjs.io/"><img src="https://img.shields.io/badge/Jest-29.7-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
</p>

CoSpace es una plataforma web moderna de reserva de espacios de trabajo colaborativo (hot desks, salas de juntas y oficinas privadas) construida con **Next.js 16 (App Router)**, **TypeScript**, **PostgreSQL en Supabase** y **TypeORM**.

Diseñada bajo arquitectura limpia, reglas estrictas de concurrencia pesimista en base de datos, autenticación segura con cookies `httpOnly`, soporte bilingüe (español / inglés) y un sistema visual refinado y minimalista.

---

## 1. Descripción y Funcionalidades

- **Catálogo de Espacios en Tiempo Real**: Exploración de puestos de trabajo y oficinas activas filtrables por categoría (`desk`, `meeting_room`, `private_office`), con precios por hora, aforo e imágenes.
- **Detalle de Espacio y Reserva Interactiva**: Cálculo dinámico del importe según la duración elegida y validación en vivo de franjas horarias válidas.
- **Autenticación Robusta y Segura**:
  - Registro de usuarios con contraseñas hasheadas mediante `bcryptjs`.
  - Sesiones basadas en pares de tokens (Access Token de 15 min y Refresh Token de 7 días) almacenados exclusivamente en cookies seguras `httpOnly` y `SameSite: Lax`.
  - Rotación automática e invalidación lógica de refresh tokens al cerrar sesión.
- **Gestión de Reservas del Usuario**:
  - Visualización del historial de reservas confirmadas y canceladas.
  - Cancelación directa con confirmación modal y verificación del límite de 2 horas de anticipación.
- **Panel de Administración (`/admin/espacios`)**:
  - Control de catálogo para usuarios con rol `admin`: creación, edición y activación/desactivación de espacios.
  - Acceso denegado con respuesta `403 Forbidden` para usuarios no administradores.
- **Control Estricto de Concurrencia**: Bloqueo pesimista de escritura (`SELECT ... FOR UPDATE`) que previene reservas solapadas frente a peticiones simultáneas.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Insignia | Versión |
|---|---|---|---|
| **Framework** | Next.js (App Router, Turbopack) | ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) | `16.4.3` |
| **Lenguaje** | TypeScript (Modo Estricto) | ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript) | `5.5+` |
| **Estilos** | Tailwind CSS | ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-teal?logo=tailwind-css) | `3.4.1` |
| **Iconografía** | Lucide React | ![Lucide](https://img.shields.io/badge/Lucide-1.16-F56565?logo=feather) | `1.16.0` |
| **ORM** | TypeORM | ![TypeORM](https://img.shields.io/badge/TypeORM-0.3.17-red?logo=typeorm) | `0.3.17` |
| **Base de Datos** | PostgreSQL en Supabase | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-purple?logo=postgresql) ![Supabase](https://img.shields.io/badge/Supabase-1.0-orange?logo=supabase) | `16` |
| **Autenticación** | JWT + `bcryptjs` | ![JWT](https://img.shields.io/badge/JWT-Tokens-black?logo=jsonwebtokens) | `9.0.2` |
| **Validaciones** | Zod | ![Zod](https://img.shields.io/badge/Zod-3.24-3068b7?logo=zod) | `3.24.2` |
| **Pruebas** | Jest + React Testing Library | ![Jest](https://img.shields.io/badge/Jest-29.7-yellow?logo=jest) | `29.7.0` |
| **Contenedores**| Docker (Multi-stage) | ![Docker](https://img.shields.io/badge/Docker-24.0-blue?logo=docker) | `22-alpine` |
| **Despliegue** | Vercel Platform | ![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel) | Serverless |

---

## 3. Requisitos Previos

- **Node.js**: Versión `20.x` o superior (Recomendado `v22.x` / `v24.x`).
- **NPM**: Versión `10.x` o superior.
- **Cuenta de Supabase**: Para aprovisionar una base de datos PostgreSQL administrada.
- **Docker** (Opcional): Si se desea ejecutar la aplicación en contenedor.

---

## 4. Instalación de Dependencias

Clona el repositorio e instala las dependencias bloqueadas por `package-lock.json`:

```bash
git clone <https://github.com/Blurtrace/CoSpace)>
cd CoSpace
npm ci
```

---

## 5. Configuración de Variables de Entorno

Copia la plantilla `.env.example` a `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Configura las variables requeridas en `.env`:

```env
# Conexión a PostgreSQL en Supabase (Transaction Pooler o Session Pooler)
DATABASE_URL="postgresql://postgres.[tu-ref]:tu_password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Secretos JWT (Cadenas aleatorias de alta entropía)
# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET="clave_secreta_minimo_64_caracteres_para_access_tokens"
JWT_REFRESH_SECRET="clave_secreta_minimo_64_caracteres_para_refresh_tokens"

# Cookies
COOKIE_SECURE=false      # Usar false en local (HTTP), true en producción (HTTPS)
COOKIE_SAME_SITE=lax

# Credenciales para el Seed inicial de Administrador
SEED_ADMIN_EMAIL=admin@cospacex.local
SEED_ADMIN_PASSWORD=AdminPassword123!

# URL pública
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Aviso de Seguridad:** El archivo `.env` está expresamente excluido de Git mediante `.gitignore`. Nunca subas claves privadas al repositorio.

---

## 6. Creación y Conexión de la Base de Datos en Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com).
2. Dirígete a **Project Settings** → **Database** → **Connection String**.
3. Selecciona la pestaña **URI** y modo **Transaction** (puerto `5432` o `6543`).
4. Reemplaza `[YOUR-PASSWORD]` por la contraseña de tu base de datos y copia la cadena resultante a `DATABASE_URL` en tu archivo `.env`.

---

## 7. Ejecución de Migraciones

CoSpace utiliza migraciones de TypeORM para garantizar que el esquema de base de datos (`users`, `refresh_tokens`, `spaces`, `reservations`) se cree de manera reproducible y con índices optimizados:

```bash
npm run migration:run
```

Para revertir la última migración aplicada:
```bash
npm run migration:revert
```

---

## 8. Ejecución del Seed (Poblado de Datos)

El script de seed es **completamente idempotente**: puede ejecutarse múltiples veces de forma segura sin crear registros duplicados ni alterar contraseñas existentes.

```bash
npm run seed
```

### ¿Qué hace el seed?
1. **Crea el Administrador Inicial**: Registra al usuario con las credenciales de `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` asignándole el rol `admin`.
2. **Siembra el Catálogo de Espacios**: Inserta los espacios representativos del coworking (`Hot Desk Ágora`, `Dedicated Desk Focus`, `Sala de Innovación`, `Oficina Privada Nexus`, etc.) si no existen previamente.

---

## 9. Inicio del Entorno de Desarrollo

Inicia el servidor de desarrollo con Turbopack:

```bash
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 10. Comprobaciones de Calidad, Tipos y Pruebas

El proyecto cuenta con un conjunto de comandos de auditoría continua:

```bash
# 1. Comprobación estricta de tipos de TypeScript (0 errores)
npm run typecheck
# o alternativamente:
npm run lint

# 2. Ejecución de la suite completa de pruebas unitarias
npm test

# 3. Compilación de producción
npm run build
```

---

## 11. Uso con Docker

### Construir la imagen Docker:
```bash
docker build -t cospace:latest .
```

### Ejecutar el contenedor:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres.[ref]:password@host:5432/postgres" \
  -e JWT_ACCESS_SECRET="clave_secreta_access_token_minimo_64_caracteres" \
  -e JWT_REFRESH_SECRET="clave_secreta_refresh_token_minimo_64_caracteres" \
  -e COOKIE_SECURE=false \
  cospace:latest
```

---

## 12. Estructura del Proyecto

```text
CoSpace/
├── .agent/                    # Configuración de copiloto y skill anti-slop
├── public/                    # Recursos estáticos y logotipos
├── src/
│   ├── __tests__/             # Suites de pruebas Jest (reglas, auth, metadatos)
│   ├── app/                   # App Router de Next.js 16
│   │   ├── (admin)/           # Rutas protegidas para rol admin (/admin/espacios)
│   │   ├── (auth)/            # Vistas de autenticación (/login, /register)
│   │   ├── (private)/         # Vistas de usuario autenticado (/dashboard/reservas)
│   │   ├── (public)/          # Vistas públicas (/, /spaces, /spaces/[id])
│   │   ├── api/               # Route Handlers de API REST (/api/auth, /api/spaces, /api/reservations)
│   │   ├── not-found.tsx      # Página de error 404 personalizada
│   │   ├── layout.tsx         # Root Layout
│   │   └── globals.css        # Estilos globales y tokens
│   ├── components/            # Componentes reutilizables de UI y formularios
│   │   ├── cards/             # SpaceCard, ReservationCard
│   │   ├── forms/             # LoginForm, RegisterForm, ReservationForm, SpaceForm
│   │   ├── shared/            # Navbar, Footer, AuthContext, LanguageContext
│   │   └── ui/                # Button, Input, Badge, Modal
│   ├── database/              # Conexión TypeORM, Entidades, Migraciones y Seeds
│   │   ├── data-source.ts     # Configuración del DataSource singleton
│   │   ├── entities/          # User, RefreshToken, Space, Reservation
│   │   ├── migrations/        # Migración inicial DDL con índices
│   │   └── seeds/             # Seed de admin y catálogo
│   ├── lib/                   # Utilidades de autenticación, cookies, errores y validaciones Zod
│   ├── services/              # Lógica de negocio (AuthService, SpaceService, ReservationService)
│   └── types/                 # Definiciones de TypeScript (Auth, Space, Reservation)
├── Dockerfile                 # Imagen Docker optimizada multi-etapa
├── .dockerignore              # Exclusiones seguras para Docker
├── .env.example               # Plantilla documental de variables de entorno
├── next.config.ts             # Configuración de Next.js 16 (serverExternalPackages: typeorm, pg)
└── package.json               # Dependencias y scripts de ejecución
```

---

## 13. Rutas Principales de la Aplicación

### Páginas Web
- `/` — Página de bienvenida con buscador, catálogo destacado y testimonios.
- `/spaces` — Catálogo completo de espacios con filtros por categoría.
- `/spaces/[id]` — Detalle del espacio y formulario de reserva interactivo.
- `/login` y `/register` — Formularios de autenticación de usuario.
- `/dashboard/reservas` — Panel privado donde el usuario consulta y cancela sus reservas.
- `/admin/espacios` — Panel exclusivo para administradores para gestionar el catálogo.

### Endpoints de API REST
- `POST /api/auth/register` — Registro de usuarios (siempre rol `user`).
- `POST /api/auth/login` — Autenticación con cookies `httpOnly`.
- `POST /api/auth/refresh` — Renovación de access token mediante refresh token rotation.
- `POST /api/auth/logout` — Revocación del refresh token e invalidación de cookies.
- `GET /api/auth/me` — Perfil del usuario en sesión actual.
- `GET /api/spaces` — Lista de espacios activos.
- `GET /api/spaces/[id]` — Detalle de un espacio.
- `POST /api/spaces` — Crear espacio (requiere `admin`).
- `PATCH /api/spaces/[id]` — Editar espacio o activar/desactivar (requiere `admin`).
- `GET /api/reservations` — Reservas del usuario autenticado (o todas si es admin).
- `POST /api/reservations` — Crear nueva reserva con validaciones de negocio y concurrencia.
- `POST /api/reservations/[id]/cancel` — Cancelar reserva propia con >= 2 horas de anticipación.

---

## 14. Autenticación y Control de Roles

1. **Tokens en Cookies `httpOnly`**:
   - `cospace_access_token`: JWT con duración de 15 minutos que transporta `userId`, `email` y `role`.
   - `cospace_refresh_token`: Token opaco firmado de 7 días.
   - Ningún token se almacena en `localStorage` ni en el cuerpo de la respuesta JSON.
2. **Rotación de Refresh Tokens**:
   - Cada refresh token se almacena con hash criptográfico en la tabla `refresh_tokens`.
   - Al renovar, el token anterior se revoca inmediatamente (`isRevoked = true`) y se expide un nuevo par.
3. **Roles de Usuario**:
   - `user`: Usuario regular. Solo puede ver y cancelar sus propias reservas. No puede acceder a `/admin/*` (`403 Forbidden`).
   - `admin`: Administrador de la plataforma. Puede crear y editar espacios, y visualizar todas las reservas del sistema.

---

## 15. Reglas de Negocio de Reservas

1. **Duración en Bloques Completos**: Las reservas deben tener una duración de **1 a 4 horas completas** (sin minutos fraccionados).
2. **Horario de Atención**: Exclusivamente de **07:00 a 21:00 hrs**.
3. **Límite Temporal**: No se permiten reservas en fechas u horas pasadas, ni con más de **30 días de anticipación**.
4. **Cupo Máximo de Reservas**: Máximo **3 reservas activas simultáneas** por usuario.
5. **No Solapamiento de Espacio**: Un espacio no puede ser reservado por dos usuarios en el mismo horario. Las reservas consecutivas exactas (ej. 10:00-12:00 y 12:00-14:00) sí están permitidas.
6. **No Solapamiento de Usuario**: Un usuario no puede tener reservas simultáneas en espacios distintos.
7. **Espacios Activos**: Solo se pueden reservar espacios marcados como `isActive = true`.
8. **Cálculo de Precios en Servidor**: El importe total es calculado de forma inmutable por el backend: `duración_horas * precio_por_hora`.
9. **Cancelación**: Permitida únicamente al dueño o administrador con al menos **2 horas de anticipación** al inicio de la reserva.

---

## 16. Despliegue en Vercel (Paso a Paso)

1. Sube el código a tu repositorio de GitHub.
2. En [Vercel](https://vercel.com), haz clic en **Add New...** → **Project**.
3. Importa el repositorio de **CoSpace**.
4. En **Framework Preset**, selecciona **Next.js**.
5. En **Environment Variables**, añade las variables críticas:
   - `DATABASE_URL`: URL con Transaction Pooler de Supabase (`sslmode=require`).
   - `JWT_ACCESS_SECRET`: Clave aleatoria de 64 caracteres.
   - `JWT_REFRESH_SECRET`: Clave aleatoria de 64 caracteres.
   - `COOKIE_SECURE`: `true`
   - `COOKIE_SAME_SITE`: `lax`
   - `NEXT_PUBLIC_APP_URL`: La URL asignada por Vercel (ej. `https://cospace-tu-proyecto.vercel.app`).
6. Haz clic en **Deploy**.
7. Una vez finalizado el build, la base de datos de producción ya estará sincronizada gracias a las migraciones ejecutadas contra Supabase.

---

## 17. Solución de Errores Comunes

- **`EntityMetadataNotFoundError: No metadata for "Space" / "User"`**:
  - *Causa:* Turbopack y Next.js empaquetan las funciones serverless de forma modular, perdiendo referencias de clases TypeORM en tiempo de ejecución.
  - *Solución implementada:* Se añadió `serverExternalPackages: ["typeorm", "pg"]` en `next.config.ts`, `import "reflect-metadata"` al inicio de todas las entidades, y métodos seguros `getUserRepository`, `getSpaceRepository` y `getReservationRepo` con fallback por nombre de tabla en los servicios.
- **`Error 400: No se pueden realizar reservas en fechas u horas pasadas`**:
  - *Causa:* Desfase horario entre la hora nominal seleccionada por el usuario (GMT-5) y la hora UTC enviada por el navegador.
  - *Solución implementada:* Se añadió `parseDeclaredDateTime` en `ReservationService` para interpretar localmente el día y la hora declarados, y el formulario en el frontend excluye dinámicamente las horas que ya transcurrieron hoy.

---

## 18. Limitaciones Conocidas

- Las reservas son en bloques de horas en punto (no se admiten reservas que inicien a las 10:30 o 11:15).
- En entornos serverless con alta concurrencia masiva sin conexión pooler, el límite de conexiones directas de PostgreSQL puede verse saturado si no se utiliza el Supabase Transaction Pooler (puerto `5432` o `6543`).
