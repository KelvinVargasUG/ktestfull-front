# Aplicación de Gestión de Proyectos - Frontend

Una aplicación web moderna para gestionar proyectos y tareas, construida con Next.js 15, React 18 y TypeScript.

## 🚀 Características

### Autenticación
- ✅ Login con JWT
- ✅ Almacenamiento seguro de tokens
- ✅ Redirección automática según estado de sesión
- ✅ Middleware de protección de rutas

### Gestión de Proyectos
- ✅ Dashboard con lista de proyectos
- ✅ Crear, editar y eliminar proyectos
- ✅ Vista detallada de cada proyecto
- ✅ Estadísticas de tareas por proyecto

### Gestión de Tareas
- ✅ CRUD completo de tareas
- ✅ Estados: PENDING, IN_PROGRESS, DONE
- ✅ Asignación de tareas a usuarios
- ✅ Fechas de vencimiento
- ✅ Filtros por estado
- ✅ Ordenamiento por fecha

### UI/UX
- ✅ Diseño responsive
- ✅ Skeleton loaders
- ✅ Estados vacíos informativos
- ✅ Validación de formularios
- ✅ Notificaciones de error
- ✅ Componentes reutilizables

## 🛠️ Tecnologías

- **Framework**: Next.js 15 (App Router)
- **UI**: React 18 + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **HTTP**: Fetch API nativo
- **Iconos**: Lucide React

## 📦 Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd project-management-frontend
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Editar `.env.local`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
\`\`\`

4. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

\`\`\`
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Página principal
│   ├── projects/[id]/     # Detalle de proyecto
│   ├── login/            # Página de login
│   └── layout.tsx        # Layout principal
├── components/           # Componentes reutilizables
│   ├── auth/            # Componentes de autenticación
│   ├── layout/          # Componentes de layout
│   ├── projects/        # Componentes de proyectos
│   ├── tasks/           # Componentes de tareas
│   └── ui/              # Componentes base (shadcn/ui)
├── store/               # Estado global (Zustand)
│   ├── auth-store.ts    # Estado de autenticación
│   ├── project-store.ts # Estado de proyectos
│   └── task-store.ts    # Estado de tareas
├── lib/                 # Utilidades
│   └── api.ts          # Cliente API
├── types/              # Definiciones TypeScript
│   └── index.ts        # Tipos principales
└── middleware.ts       # Middleware de Next.js
\`\`\`

## 🔐 Autenticación

La aplicación utiliza JWT para autenticación:

1. **Login**: Envía credenciales al backend
2. **Token**: Se almacena en localStorage y Zustand
3. **Middleware**: Protege rutas automáticamente
4. **Headers**: Se incluye en todas las peticiones API

## 📱 Páginas y Funcionalidades

### Login (`/login`)
- Formulario de autenticación
- Validación con Zod
- Redirección automática si ya está autenticado

### Dashboard (`/dashboard`)
- Lista de todos los proyectos del usuario
- Crear nuevo proyecto
- Estadísticas básicas de cada proyecto
- Navegación a detalle de proyecto

### Detalle de Proyecto (`/projects/[id]`)
- Información completa del proyecto
- Estadísticas de tareas (total, pendientes, en progreso, completadas)
- Lista de tareas con filtros
- CRUD completo de tareas
- Asignación de tareas a usuarios

## 🎨 Componentes Principales

### Proyectos
- `ProjectCard`: Tarjeta de proyecto con acciones
- `ProjectDialog`: Modal para crear/editar proyectos
- `ProjectSkeleton`: Loading state para proyectos

### Tareas
- `TaskCard`: Tarjeta de tarea con estados y acciones
- `TaskDialog`: Modal para crear/editar tareas
- `TaskFilters`: Filtros y ordenamiento de tareas
- `TaskSkeleton`: Loading state para tareas

### UI
- `EmptyState`: Estado vacío reutilizable
- `Navbar`: Barra de navegación con usuario
- Componentes de shadcn/ui

## 🔄 Gestión de Estado

### Auth Store
\`\`\`typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}
\`\`\`

### Project Store
\`\`\`typescript
interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  // CRUD operations...
}
\`\`\`

### Task Store
\`\`\`typescript
interface TaskState {
  tasks: Task[]
  loading: boolean
  filters: FilterState
  // CRUD operations...
}
\`\`\`

## 🌐 API Integration

El cliente API (`lib/api.ts`) maneja:
- Autenticación automática con JWT
- Manejo de errores
- Endpoints para proyectos, tareas y usuarios
- Tipado completo con TypeScript

## 📋 Scripts Disponibles

\`\`\`bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
\`\`\`

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Otros proveedores
\`\`\`bash
npm run build
npm run start
\`\`\`

## 🔧 Configuración Adicional

### ESLint + Prettier
\`\`\`bash
npm install --save-dev eslint-config-prettier prettier
\`\`\`

### Testing (Opcional)
\`\`\`bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
\`\`\`

## 📝 Notas de Desarrollo

- **Responsive**: Diseño mobile-first
- **Accesibilidad**: Componentes accesibles con shadcn/ui
- **Performance**: Lazy loading y optimizaciones de Next.js
- **SEO**: Meta tags y estructura semántica
- **Error Handling**: Manejo robusto de errores
- **Loading States**: UX mejorada con skeletons

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
