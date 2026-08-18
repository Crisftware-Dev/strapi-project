# 📋 Plan de Mejoras del Proyecto — TAREAS.md

Este documento consolida las tareas clave de optimización, SEO, rendimiento, gestión de archivos y seguimiento de funcionalidades para el desarrollo del proyecto (Next.js 16 + Strapi v5).

---

## 🔍 1. Optimización de SEO (Search Engine Optimization)

- [ ] **1.1 Meta Data y Open Graph por Ruta**
  - [ ✔️ ] Configurar `generateMetadata` dinámico en rutas de cliente y autenticación (`(auth)`, `dashboard`).
  - [ ✔️ ] Definir imágenes OpenGraph estáticas y dinámicas (`og:image`, 1200x630px) para previsualizaciones en redes sociales.
  - [ ✔️ ] Actualizar JSON-LD en [app/layout.tsx](file:///c:/Users/cris1/OneDrive/Documentos/CONTRIBUCIONES/strapi-project/frontend/app/layout.tsx) reemplazando enlaces estáticos de ejemplo por variables de entorno reales.

- [ ✔️ ] **1.2 Estructura Semántica y Accesibilidad (a11y)**
  - [ ✔️ ] Asegurar una jerarquía lógica de encabezados (`<h1>` único por página, seguido de `<h2>`, `<h3>`).
  - [ ✔️ ] Añadir texto alternativo (`alt`) descriptivo a todas las imágenes e íconos en el frontend.
  - [ ✔️ ] Incluir atributos ARIA (`aria-label`, `aria-expanded`, `role`) en diálogos, modales y navegación del dashboard.

- [ ✔️ ] **1.3 Robots y Sitemap Dinámico**
  - [ ✔️ ] Verificar directivas en [app/robots.ts](file:///c:/Users/cris1/OneDrive/Documentos/CONTRIBUCIONES/strapi-project/frontend/app/robots.ts) (proteger rutas de `/dashboard/` y `/api/`).

---

## ⚡ 2. Mejoras de Rendimiento (Performance)

- [ ✔️ ] **2.1 Frontend (Next.js 16 App Router)**
  - [ ✔️ ] **Carga de Fuentes**: Activar `preload: true` e `display: "swap"` en Google Fonts (`Inter`) dentro de [app/layout.tsx](file:///c:/Users/cris1/OneDrive/Documentos/CONTRIBUCIONES/strapi-project/frontend/app/layout.tsx) para prevenir Layout Shift.
  - [ ✔️ ] **Code-Splitting & Dynamic Imports**: Cargar dinámicamente (`next/dynamic`) librerías pesadas como Leaflet/React-Leaflet en componentes de mapa.
  - [ ✔️ ] **Optimización de Imágenes**: Reemplazar etiquetas `<img>` tradicionales por `<Image />` de Next.js y agregar dominios autorizados en `next.config.ts` (`remotePatterns` para Strapi Media).
  - [ ✔️ ] **Gestión de Estado y Caché**: Ajustar `staleTime` y `gcTime` en `@tanstack/react-query` para reducir peticiones duplicadas a Strapi.

- [ ] **2.2 Backend y Base de Datos (Strapi v5)**
  - [ ] **Consultas Seleccionadas**: Configurar `fields` y `populate` específicos en [lib/api.ts](file:///c:/Users/cris1/OneDrive/Documentos/CONTRIBUCIONES/strapi-project/frontend/lib/api.ts) y Server Actions para no traer esquemas completos de Strapi.
  - [ ] **Indexación de DB**: Crear índices en base de datos para búsquedas frecuentes (campos `cedula`, `numero_contrato`, `email` en la entidad `Cliente`).
  - [ ] **Middlewares**: Habilitar compresión HTTP (gzip/brotli) y encabezados de caché para respuestas API estáticas.

---

## 📂 3. Gestión de Archivos y Adjuntos (File Management)

- [ ] **3.1 Componentes y Validación en Frontend**
  - [ ] Crear un componente reutilizable de carga de archivos (`FileUploadZone`) con soporte Drag & Drop.
  - [ ] Validar tipos de archivo permitidos (PDF, PNG, JPG) y tamaño máximo de archivo (ej. 5 MB) en el cliente antes de la subida.
  - [ ] Implementar barras de progreso, indicadores de carga (spinners) y previsualización de documentos seleccionados.

- [ ] **3.2 Procesamiento y Almacenamiento en Backend (Strapi Upload)**
  - [ ] Configurar el plugin de procesamiento de imágenes con `sharp` para auto-comprimir y generar formatos WebP.
  - [ ] Integrar un proveedor de almacenamiento externo (Cloudinary, AWS S3 o Supabase Storage) para entornos de producción.
  - [ ] Organizar archivos por carpetas temáticas dentro de la biblioteca de medios de Strapi (`/clientes/contratos/`, `/usuarios/avatares/`).
  - [ ] Implementar limpieza de archivos huérfanos o desvinculados al eliminar entidades en Strapi.

---

## 📑 4. Funcionalidades del Negocio (Crear Nuevo Cliente)

- [ ] **4.1 Formulario Crear Nuevo Cliente**
  - [ ] Generación automática e incremental del número de contrato (único). *(REALIZADO)*
  - [ ] Validar disponibilidad de Cédula e historia de coincidencia de Nombre Completo. *(En progreso)*
  - [ ] Integrar el campo de subida obligatoria de archivo de contrato PDF/Imagen con el nuevo módulo de gestión de archivos.
  - [ ] Validar campos obligatorios y soporte para valores por defecto (Corte Automático, Factura Automática, etc.).



// ARREGLAR BUTTON AND BUTTON used by list.tsx in search plans,

Solve data plans in the  addPLans, not rendering the plans list to click in "Buscar"