# KTestFull Frontend

Aplicación frontend desarrollada con Next.js para la gestión de proyectos y tareas.

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o pnpm

### 1. Instalación de dependencias

```bash
npm install
# o
pnpm install
```

### 2. Configuración de variables de entorno

Cree un archivo `.env.local` en la raíz del proyecto con la siguiente variable:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/ktestfull
```

Esta variable define la URL base del API backend que debe estar ejecutándose en el puerto 8080.

### 3. Ejecución en modo desarrollo

Para levantar el servidor de desarrollo en el puerto 3001:

```bash
npm run dev -- -p 3001
# o
pnpm dev -- -p 3001
```

La aplicación estará disponible en: `http://localhost:3001`

## 📂 Estructura del Proyecto

```
├── app/                    # Páginas y rutas (App Router)
│   ├── admin/             # Páginas de administración
│   ├── dashboard/         # Dashboard principal
│   ├── login/            # Página de login
│   └── projects/         # Gestión de proyectos
├── components/           # Componentes reutilizables
│   ├── admin/           # Componentes de admin
│   ├── auth/            # Componentes de autenticación
│   ├── layout/          # Componentes de layout
│   ├── projects/        # Componentes de proyectos
│   ├── tasks/           # Componentes de tareas
│   └── ui/              # Componentes de UI base
├── hooks/               # Custom hooks
├── lib/                 # Librerías y utilidades
├── store/               # Estado global (Zustand)
├── types/               # Definiciones de TypeScript
└── styles/              # Estilos globales
```

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Zustand** - Gestión de estado
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas
- **Lucide React** - Iconos

## 📋 Funcionalidades

### Gestión de Proyectos
- ✅ Crear, editar y eliminar proyectos
- ✅ Visualizar lista de proyectos
- ✅ Asignar fechas de vencimiento a proyectos

### Gestión de Tareas
- ✅ Crear, editar y eliminar tareas
- ✅ Asignar usuarios a tareas
- ✅ Cambiar estados de tareas (Pendiente, En Progreso, Completada)
- ✅ Asignar fechas de vencimiento a tareas
- ✅ Filtrar tareas por estado

### Administración de Usuarios
- ✅ Visualizar lista de usuarios
- ✅ Scroll infinito para paginación
- ✅ Buscar usuarios

### Autenticación
- ✅ Login de usuarios
- ✅ Gestión de sesiones

## 🔧 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Construcción para producción
npm run start      # Servidor de producción
npm run lint       # Linter de código
```

## 🌐 API Backend

El frontend se conecta al backend que debe estar ejecutándose en:
`http://localhost:8080/ktestfull`

Asegúrese de que el backend esté funcionando antes de iniciar el frontend.

## 📝 Notas de Desarrollo

- El proyecto utiliza App Router de Next.js 14
- Los estados se manejan con Zustand para una mejor gestión
- Los formularios usan React Hook Form con validación Zod
- Los estilos se implementan con Tailwind CSS
- La aplicación es completamente responsive

## 🚀 Deploy

Para ejecutar la aplicación usando Docker:

1. **Construir la imagen Docker:**
```bash
docker build -t app-ktestfull .
```

2. **Ejecutar el contenedor:**
```bash
docker run -p 3001:3000 app-ktestfull
```

La aplicación estará disponible en: `http://localhost:3001`

> **Nota:** El contenedor internamente usa el puerto 3000, pero se mapea al puerto 3001 del host.