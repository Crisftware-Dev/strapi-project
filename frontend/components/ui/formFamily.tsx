import { useState } from "react";
import { Button } from "./button";

interface Familiar {
  cedulaRuc: string;
  nombre: string;
  parentesco: string;
  telefono: string;
}

const parentescos = [
  "HIJO/A",
  "PADRE/MADRE",
  "ESPOSO/A",
  "HERMANO/A",
  "ABUELO/A",
  "OTRO",
] as const;

const styles = {
  container: "w-full overflow-x-auto",
  table: "min-w-full border border-gray-300 text-sm",
  thead: "h-auto bg-indigo-100/30 dark:bg-indigo-900/30",
  th: "border border-gray-300 px-2 py-0.5 text-left font-semibold text-xs",
  td: "border border-gray-300 px-1 py-0.5 text-[10px]",
  input:
    "w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500",
  select:
    "w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white",
  button: "text-red-600 hover:text-red-800 font-medium",
};

export default function FormFamily() {
  const [familiares, setFamiliares] = useState<Familiar[]>([
    {
      cedulaRuc: "",
      nombre: "CRISTHIAN JAIR ZAMBRANO NUÑEZ",
      parentesco: "HIJO/A",
      telefono: "0999999999",
    },
    {
      cedulaRuc: "",
      nombre: "CRISTHIAN JAIR ZAMBRANO NUÑEZ",
      parentesco: "HIJO/A",
      telefono: "0999999999",
    },
  ]);

  const agregarFila = () => {
    setFamiliares((prev) => [
      ...prev,
      { cedulaRuc: "", nombre: "", parentesco: "", telefono: "" },
    ]);
  };

  const actualizarFamiliar = (
    index: number,
    campo: keyof Familiar,
    valor: string,
  ) => {
    setFamiliares((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)),
    );
  };

  const eliminarFila = (index: number) => {
    if (familiares.length <= 1) return; // mínimo 1 fila (opcional)
    setFamiliares((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} w-[18%]`}>Cédula/RUC</th>
            <th className={`${styles.th} w-[42%]`}>Persona</th>
            <th className={`${styles.th} w-[22%]`}>Parentesco</th>
            <th className={`${styles.th} w-[16%]`}>Teléfono</th>
            <th className={`${styles.th} w-[1%] text-center`}>
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="bg-indigo-100/20">
          {familiares.map((familiar, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className={styles.td}>
                <input
                  type="text"
                  value={familiar.cedulaRuc}
                  onChange={(e) =>
                    actualizarFamiliar(index, "cedulaRuc", e.target.value)
                  }
                  className={styles.input}
                  placeholder="cédula/RUC"
                />
              </td>
              <td className={styles.td}>
                <input
                  type="text"
                  value={familiar.nombre}
                  onChange={(e) =>
                    actualizarFamiliar(
                      index,
                      "nombre",
                      e.target.value.toUpperCase(),
                    )
                  }
                  className={styles.input}
                  placeholder="Nombre completo"
                />
              </td>
              <td className={styles.td}>
                <select
                  value={familiar.parentesco}
                  onChange={(e) =>
                    actualizarFamiliar(index, "parentesco", e.target.value)
                  }
                  className={styles.select}
                >
                  <option value="">Seleccione...</option>
                  {parentescos.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </td>
              <td className={styles.td}>
                <input
                  type="tel"
                  value={familiar.telefono}
                  onChange={(e) =>
                    actualizarFamiliar(index, "telefono", e.target.value)
                  }
                  className={styles.input}
                  placeholder="Ej: 0991234567"
                />
              </td>
              <td className={`${styles.td} text-center`}>
                <Button
                  type="button"
                  onClick={() => eliminarFila(index)}
                  className="bg-indigo-600 hover:bg-indigo-700 h-7 p-2 rounded-full"
                  title="Eliminar fila"
                >
                  ×
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-start">
        <button type="button" onClick={agregarFila} className={styles.button}>
          + Agregar familiar
        </button>
      </div>
    </div>
  );
}
