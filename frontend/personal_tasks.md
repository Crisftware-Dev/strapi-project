1. Crear los saldos pendientes de la siguiente manera:
 - Los saldos pendientes se van a asignar de forma automática  el 1 de cada mes, y van a salir de cada plan que tiene asignado su valor correspondiente reducido por algún descuento que mantenga. por ejemplo, si un cliente tiene un plan de 50 dólares y tiene un descuento del 10%, se le asignará un saldo pendiente de 45 dólares.
 - El saldo pendiente se mostrará cada saldo de asignado por fila con el valor y una descripción ejemplo: "Saldo $25 Plan Pro" y así sucesivamente.
 - Se podrá asignar saldos pendientes de forma manual, estos saldos se mostrarán como "Saldo Manual" y se les puede agregar la descripción de igual forma.
 - Se podrá eliminar saldos pendientes de forma manual.
 - Para poder asignar la factura automática se debe tomar en cuenta que el cliente esté activo, pero si el cliente se activa el 10 de ese mes, debe hacerce un calculo del valor de cada plan asignado, para los dias faltantes, es decir del 10 al 30 faltan 20 dias, de esta forma se calculara el saldo correspondiente a esos dias.
 - Una vez los valores hayan sido cancelados o correspondan a $0 ese saldo pendiente se eliminará

2. Crear las facturas de los saldos cancelados de la siguiente manera:
 - Crear las facturas después de que el cliente haya pagado un valor correspondiente a su saldo pendiente. 
 - La factura puede ser pagada como un abono y ese valor se debe hacer un resta automática al saldo pendiente mas antiguo que tenga, es decir: Si tiene dos saldos pendientes de "Pago Servicio Plan 1" y "Pago Servicio Plan 2" y "Pago Servicio Plan 3", se debe hacer un resta automática al saldo pendiente de "Pago Servicio Plan 1", y si sobra dinero se debe hacer un resta automática al saldo pendiente de "Pago Servicio Plan 2" y así sucesivamente. o En caso de que solo se pague un parte de un saldo pendiente, se debe hacer un resta automática al saldo pendiente mas antiguo que tenga, y el saldo pendiente restante se actualizará en el mismo saldo pendiente que había solo que menos valor a pagar.
 - Por cada valor pagado se debe crear una factura individual con todos los detalles correspondientes sobre todo el valor pagado y la descripción sacado del Saldo Pendiente.
 - Por cada factura debe crearse un PDF, y el PDF puede ser visualizado desde la ventana de Historial de Pagos y también descargar.
 