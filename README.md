# RutaLink MVP

Plataforma para guías turísticos que permite crear perfiles públicos, gestionar servicios y recibir reservas vía WhatsApp.

## 🚀 Stack Tecnológico

- **Frontend/Backend**: Next.js 16 (App Router)
- **Base de datos**: Supabase (PostgreSQL + Auth + Storage)
- **Rate Limiting**: Upstash (Redis/KV)
- **UI**: shadcn/ui + TailwindCSS
- **Validación**: Zod
- **Testing**: Vitest
- **Lenguaje**: TypeScript
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase (gratuita)
- Cuenta de Upstash (para Rate Limiting)
- npm o pnpm

## 🛠️ Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta los scripts de migración en orden:
   - `supabase/migrations/20251208150000_secure_rls.sql` (RLS Policies)
   - `supabase/migrations/20251208151500_bookings_and_soft_delete.sql` (Bookings & Soft Deletes)

### 3. Configurar Upstash (Opcional en Dev, Requerido en Prod)

1. Crea una base de datos Redis en [upstash.com](https://upstash.com)
2. Obtén `KV_REST_API_URL` y `KV_REST_API_TOKEN`.

### 4. Variables de Entorno

Crea `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Rate Limiting (Upstash / Vercel KV)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

**Nota**: Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente ni en este archivo si no es estrictamente necesario para scripts de servidor.

### 5. Authentication

1. En Supabase **Authentication** > **Providers**, habilita **Email**.
2. Configura Redirect URLs: `http://localhost:3000/auth/callback`

### 6. Storage

1. Crea un bucket público llamado `guide-photos`.
2. Las políticas de storage ya están incluidas en los scripts SQL, pero verifica que la carpeta exista.

## 🏃 Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## ✅ Estado Actual

### ✓ Completado
- [x] **Autenticación**: Magic Link + Rate Limiting (5 req/min).
- [x] **Seguridad**: RLS Policies robustas, Input Validation (Zod + Anti-XSS).
- [x] **Gestión de Servicios**: CRUD con Soft Deletes.
- [x] **Reservas**: Sistema de "Solicitud de Reserva" antes de WhatsApp (Previene double-booking).
- [x] **Páginas Públicas**: Perfil de Guía y Detalle de Servicio optimizados (SEO + LCP).
- [x] **Testing**: Suite básica con Vitest.

### 🚧 En Progreso
- [ ] Notificaciones automáticas
- [ ] Panel de Analytics avanzado
- [ ] Sistema de Disponibilidad complejo (rangos de fechas)

## 🧪 Testing

Ejecutar tests unitarios (validaciones):

```bash
npm run test
# o
npx vitest run
```

## 📁 Estructura Clave

```
rutalink-app/
├── app/
│   ├── actions/           # Server Actions (Auth, Booking, Services)
│   ├── api/               # API Routes (Cron, Webhooks)
│   ├── [locale]/          # Rutas internacionalizadas
│   │   ├── auth/          # Login
│   │   ├── dashboard/     # Panel de control
│   │   ├── g/[slug]/      # Perfil público
│   │   └── s/[serviceId]/ # Servicio público
├── components/            # UI Components
├── lib/
│   ├── utils/validators.ts # Schemas Zod
│   ├── ratelimit.ts       # Configuración Rate Limit
│   └── supabase/          # Clientes DB
├── supabase/
│   └── migrations/        # Scripts SQL
└── docs/                  # Documentación adicional (e.g. error-handling.md)
```

## 📄 Licencia

MIT
