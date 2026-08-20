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
  - [ ✔️ ] **Consultas Seleccionadas**: Configurar `fields` y `populate` específicos en [lib/api.ts](file:///c:/Users/cris1/OneDrive/Documentos/CONTRIBUCIONES/strapi-project/frontend/lib/api.ts) y Server Actions para no traer esquemas completos de Strapi.
  - [ ] **Indexación de DB**: Crear índices en base de datos para búsquedas frecuentes (campos `cedula`, `numero_contrato`, `email` en la entidad `Cliente`).
  - [ ✔️ ] **Middlewares**: Habilitar compresión HTTP (gzip/brotli) y encabezados de caché para respuestas API estáticas.

---

## 📂 3. Gestión de Archivos y Adjuntos (File Management)

- [ ] **3.1 Componentes y Validación en Frontend**
  - [ ✔️ ] Crear un componente reutilizable de carga de archivos (`Files`) con soporte Drag & Drop.
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
  - [ ] **Bug — Selector de Plan**: `handleField("plans", e.target.value)` recibe un `string` pero `plans` espera `Plan[]`. Corregir la transformación del `documentId` al objeto `Plan` completo antes de guardar en `formData`.

---

## 🎫 5. Módulo de Soporte (Tab "Soporte")

> **Estado actual:** El componente `SoporteContratos.tsx` existe visualmente pero usa datos mock. No guarda nada en Strapi.

- [ ] **5.1 Backend — Content-Type `Ticket` en Strapi**
  - [ ] Crear la entidad `Ticket` con los campos: `asunto` (string), `descripcion` (text), `prioridad` (enum: Alta/Media/Baja), `estado` (enum: Abierto/En proceso/Cerrado), `fecha` (date).
  - [ ] Agregar una relación `Many-to-One` de `Ticket` hacia `Cliente` (un cliente puede tener muchos tickets).
  - [ ] Configurar permisos de la API en Strapi Admin (`find`, `findOne`, `create`, `update`) para el rol autenticado.

- [ ] **5.2 Frontend — Conectar con Strapi**
  - [ ] Crear el hook `useTickets(clienteDocumentId: string)` en `hooks/useTickets.ts` que llame a `GET /api/tickets?filters[cliente][documentId][$eq]=...`.
  - [ ] Crear la Server Action `createTicketAction(data)` en `actions/mutations.ts` que llame a `POST /api/tickets`.
  - [ ] En `SoporteContratos.tsx`, reemplazar `MOCK_TICKETS` por los datos del hook `useTickets`.
  - [ ] Conectar `handleSubmit` con `createTicketAction` para que el formulario realmente guarde el ticket en Strapi.
  - [ ] Calcular las métricas (Abiertos / En proceso / Cerrados) dinámicamente desde los datos reales del hook.
  - [ ] Asociar automáticamente el ticket al `selectedClientId` del contexto `ClientContext`.

---

## 💳 6. Módulo de Pagos

> **Estado actual:** Las tablas de Pagos Pendientes y Pagos Realizados existen con estructura pero todas las celdas están vacías. No hay entidad en Strapi.

- [ ] **6.1 Backend — Content-Type `Pago` en Strapi**
  - [ ] Crear la entidad `Pago` con campos: `obligacion` (string), `total` (decimal), `pagado` (decimal), `saldo` (decimal), `referencia` (string), `numeroFactura` (string), `fechaEmision` (date), `fechaPago` (date), `fechaDeposito` (date), `formaPago` (enum: Efectivo/Transferencia/Débito), `descuentos` (decimal), `documento` (string), `usuario` (string), `estado` (enum: Pendiente/Pagado/Diferido).
  - [ ] Agregar relación `Many-to-One` de `Pago` hacia `Cliente`.
  - [ ] Configurar permisos de la API en Strapi Admin.

- [ ] **6.2 Frontend — Pagos Pendientes (`RenderPaymentsOuts.tsx`)**
  - [ ] Crear el hook `usePagosPendientes(clienteDocumentId: string)` que llame a `GET /api/pagos?filters[cliente][documentId][$eq]=...&filters[estado][$eq]=Pendiente`.
  - [ ] Poblar la tabla con los datos reales (actualmente todas las celdas son `""`).
  - [ ] Implementar un modal/formulario para **registrar un nuevo pago** (botón "Cobrar").
  - [ ] Crear la Server Action `createPagoAction(data)` en `actions/mutations.ts`.
  - [ ] Implementar las acciones del menú desplegable: **Cobrar**, **Detalles**, **Diferir**, **Descuentos**, **Eliminar**.

- [ ] **6.3 Frontend — Pagos Realizados (`RenderPaymetsHistory.tsx`)**
  - [ ] Crear el hook `usePagosRealizados(clienteDocumentId: string)` que llame a `GET /api/pagos?filters[estado][$eq]=Pagado`.
  - [ ] Poblar la tabla con los datos reales.
  - [ ] Implementar las acciones del menú: **Eliminar**, **Detalles**, **Imprimir**, **Descargar RIDE**, **Descargar XML**.

---

## 🔘 7. Botones del Footer sin Funcionalidad

> **Archivo:** `FooterControl.tsx` — estos botones existen pero no tienen `onClick`.

- [ ] **7.1 Botón `+ Añadir`** — Definir qué acción realiza (¿abrir tab para añadir un segundo contrato al mismo cliente?) e implementar su `onClick`.
- [ ] **7.2 Botón `Liberar`** — Implementar la lógica para liberar/desbloquear un contrato o cliente. Definir si cambia el `estado` del cliente.
- [ ] **7.3 Botón `RE-ENVIAR PIN`** — Implementar la lógica para reenviar el PIN de instalación al cliente (vía SMS o email). Requiere Server Action o llamada a endpoint de Strapi/servicio externo.
- [ ] **7.4 Botón `Hist de Planes`** — Implementar navegación al tab o modal que muestre el historial de planes del cliente. Requiere content-type o campo de historial en Strapi.
- [ ] **7.5 Botón `Enviar Contrato`** — Implementar envío del PDF de contrato al cliente (email o WhatsApp). Requiere Server Action con integración de servicio de mensajería o email.

---

## 📝 8. Campos Incompletos en el Formulario de Cliente

> **Archivo:** `RenderClient.tsx` — campos que renderizan visualmente pero no guardan datos.

- [ ] **8.1 Campo "Razón Social"** — Actualmente es `<DataInput label="Razón Social" placeholder="Nombre de empresa" />` sin `value` ni `onChange`. Agregar el campo `razonSocial` al tipo `Client` en Strapi, al contexto `EditableClientData` y conectar con el formulario.
- [ ] **8.2 Campo "Rubro Instalación"** — El texto `"INSTALACION RESIDENCIAL F.O | 178.2522"` está hardcodeado. Crear campo `rubroInstalacion` en Strapi y conectarlo.
- [ ] **8.3 Campo "Promoción"** — `<ClientDataRow label="Promoción" />` renderiza vacío. Definir qué datos muestra y conectar con Strapi.
- [ ] **8.4 Campo "Motivo"** — `<ClientDataRow label="Motivo" />` renderiza vacío. Agregar campo `motivo` en Strapi y conectar con el formulario.
- [ ] **8.5 Campo "Referido por"** — El input de búsqueda existe pero sin `value`, `onChange` ni hook. Conectar con `useClientsSearch` para buscar el cliente referidor y guardar la relación en Strapi.

---

## 🚀 9. Mejoras de UX / Performance (del personal_tasks.md)

- [ ] **9.1 Títulos de Página Dinámicos** — Agregar `export const metadata` o `generateMetadata` en `app/dashboard/layout.tsx` y rutas internas para que la pestaña del navegador muestre el nombre correcto.
- [ ] **9.2 Skeletons de Carga** — Reemplazar los textos `"Cargando datos..."` en `RenderClient.tsx`, `RenderAddress.tsx`, `RenderPaymentsOuts.tsx` y `RenderPaymetsHistory.tsx` por componentes de skeleton animado.
- [ ] **9.3 Debounce en Buscador** — Implementar un hook `useDebounce` en `hooks/useDebounce.ts` y aplicarlo en `BusquedaContratos.tsx` y `header-search.tsx` para evitar peticiones por cada tecla.
- [ ] **9.4 Paginación de Clientes** — Agregar soporte de paginación (`page` + `pageSize`) en el hook `useClients` y mostrar botones "Anterior" / "Siguiente" en la vista de búsqueda.
- [ ] **9.5 Ordenamiento de Tablas** — Usar el hook `useSort.ts` (ya existe) para activar el ordenamiento por columna en la tabla de clientes (nombres, ciudad, estado, contrato).
- [ ] **9.6 Botón "Volver Arriba"** — Crear un componente `ScrollToTop` flotante (`position: fixed, bottom-4, right-4`) que aparezca al hacer scroll hacia abajo.
