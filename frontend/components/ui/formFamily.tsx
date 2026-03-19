import { Reference } from "@/types/typeClients";

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

export default function FormFamily({
  references,
  isEditing,
  updateReference,
}: {
  references: Reference[];
  isEditing: boolean;
  updateReference: (
    index: number,
    field: keyof Reference,
    value: string,
  ) => void;
}) {

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} w-[18%]`}>Cédula/RUC</th>
            <th className={`${styles.th} w-[42%]`}>Persona</th>
            <th className={`${styles.th} w-[22%]`}>Parentesco</th>
            <th className={`${styles.th} w-[16%]`}>Teléfono</th>
            <th className={`${styles.th} w-[1%] text-center`}>Acción</th>
          </tr>
        </thead>
        <tbody className="bg-indigo-100/20">
          {[0, 1, 2].map((index) => {
            const reference = references?.[index] || {
              identificacion: "",
              fullnames: "",
              relationship: "",
              phone: 0,
            };

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className={styles.td}>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={reference.identificacion || ""}
                    onChange={(e) =>
                      updateReference(index, "identificacion", e.target.value)
                    }
                    className={styles.input}
                    placeholder="cédula/RUC"
                  />
                </td>
                <td className={styles.td}>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={reference.fullnames || ""}
                    onChange={(e) =>
                      updateReference(
                        index,
                        "fullnames",
                        e.target.value.toUpperCase(),
                      )
                    }
                    className={styles.input}
                    placeholder="Nombre completo"
                  />
                </td>
                <td className={styles.td}>
                  <select
                    value={reference.relationship || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateReference(index, "relationship", e.target.value)
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
                    readOnly={!isEditing}
                    value={reference.phone || ""}
                    onChange={(e) =>
                      updateReference(index, "phone", e.target.value)
                    }
                    className={styles.input}
                    placeholder="Ej: 0991234567"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
