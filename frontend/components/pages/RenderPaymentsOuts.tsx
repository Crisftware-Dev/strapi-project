import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";

export default function RenderPaymentsOuts() {
  const { selectedClientId, setActiveTab } = useClientContext();
  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

  if (!selectedClientId) {
    setActiveTab("cliente");
  }

  if (isLoading)
    return <div className="p-8 text-center text-xs">Cargando datos...</div>;
  if (error || !client)
    return (
      <div className="p-8 text-center text-xs text-red-500">
        Error al cargar datos
      </div>
    );

  return (
    <article className={styles.container} key={selectedClientId}>
      <main className={styles.mainGrid}>
        REALIZAR LA SECCIÓN DE PAGOS, DEBE CONTENER UN FORMULARIO PARA REGISTRAR PAGOS, UN BOTÓN PARA AGREGAR UN PAGO Y UNA TABLA PARA MOSTRAR LOS PAGOS PENDIENTES.
      </main>
    </article>
  );
}
