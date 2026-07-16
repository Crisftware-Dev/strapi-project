NUEVO COMPONENTE — CREAR NUEVO CLIENTE
Objetivo
Crear la funcionalidad completa para que un usuario autenticado pueda registrar un nuevo cliente en el sistema mediante un formulario claro y robusto.
Requisitos Funcionales


1. Lógica de Creación de Cliente

Implementar la lógica backend/frontend necesaria para crear un cliente asociado al usuario autenticado.
El número de contrato debe generarse automáticamente y no debe repetirse (único). -- REALIZADO

2. Componente de Formulario (CrearNuevoCliente)
Campos requeridos del formulario:

Nombre Completo: Un solo campo de texto. Debe contener nombre y apellido(s) separados por espacio.
Cédula / Identificación (obligatorio)
Email (obligatorio)
Teléfono (obligatorio)
Dirección (obligatorio)
Fecha de Nacimiento (obligatorio)
Tipo de Plan y Plan específico (obligatorio)
Archivo de Contrato (subida de archivo obligatorio para validación)
Fecha de Instalación: Debe ser la fecha actual por defecto y no editable.
Ubicación GPS (obligatorio)
Calificación Crediticia
Actividad Económica
Tipo de Vivienda
Referencia Familiar (al menos una: nombre, relación, teléfono)
Descuento:
Tercera Edad
Discapacidad
Ninguno (opción por defecto)


Valores por defecto:

Corte Automático: true
Factura Automática: true
Todos los demás booleanos: false (salvo que el usuario los active)


Validaciones Especiales (Cédula)
Al enviar el formulario:

Verificar si la cédula ya existe en la base de datos. -- En progreso
Si existe:
Comparar que el Nombre Completo coincida exactamente con el registrado.
Si no coincide: Mostrar error:"Los nombres completos no coinciden con la cédula registrada."Y mostrar mensaje adicional:"Si los nombres están bien escritos y está seguro de que es la misma persona, por favor envíe un correo al administrador."

Si no existe → Crear el cliente y mostrar mensaje de éxito:"Cliente creado correctamente."


Notas Adicionales

Todos los campos marcados como obligatorios deben ser validados antes de enviar.
El formulario debe tener buena UX: mensajes claros de error, loading state y feedback visual.
Mantener consistencia con el diseño y patrones de componentes UI existentes.