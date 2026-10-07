import { useState } from "react";
import {
  ArrowRigthI,
  CircleI,
  DeleteI,
  DetailsI,
  HandsI,
  MoneyI,
  PercentI,
} from "../icons/Icons";
import { PaymentRow } from "./compact-table";
import { Li } from "./list";
import { LiControlHeader } from "./nav-items";
import { styles } from "@/app/styles/styles";
import { Balance } from "@/types/balance";
import { useBalanceContext } from "@/contexts/balance-context";
import { ClientDataRow } from "./client-data-row";
import ModalGeneral from "./ModalGeneral";

const currency = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatDate = (value?: string) => {
  if (!value) return "-";
  const [year, month, day] = value.split("T")[0].split("-");
  if (!year || !month || !day) return "-";
  return `${day}/${month}/${year}`;
};

export default function Payments() {
  const { balances, handleDeleteBalance, isDeletingBalance } =
    useBalanceContext();

  if (!balances) return null;

  if (!balances.length) {
    return (
      <div className="col-span-full p-4 text-center text-xs text-gray-500 dark:text-gray-400">
        No hay saldos pendientes
      </div>
    );
  }

  const deleteBalance = async (id: string) => {
    if (id) await handleDeleteBalance(id);
  };

  return (
    <>
      {balances.map((balance, index) => (
        <BalanceRow
          isDeletingBalance={isDeletingBalance}
          key={balance.documentId ?? balance.id_balance}
          balance={balance}
          index={index}
          deleteBalance={deleteBalance}
        />
      ))}
    </>
  );
}

function BalanceRow({
  balance,
  index,
  deleteBalance,
  isDeletingBalance,
}: {
  balance: Balance;
  index: number;
  deleteBalance: (id: string) => Promise<void>;
  isDeletingBalance: boolean;
}) {
  const [active, setActive] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <>
      <PaymentRow
        cells={[
          <span key="no">{index + 1}</span>,
          <span key="total">{currency.format(balance.total)}</span>,
          <span key="pagado">{currency.format(balance.paid ?? 0)}</span>,
          <span key="saldo">{currency.format(balance.balance)}</span>,
          <span key="factura">{balance.id_balance}</span>,
          <span key="emitida">{formatDate(balance.issued)}</span>,
          <span key="dsctos">{currency.format(balance.discounts ?? 0)}</span>,
          <LiControlHeader
            key="opciones"
            id={`opciones-${balance.documentId ?? index}`}
            text="Opciones"
            isActive={active === "opciones"}
            icon={<CircleI className={styles.icon} />}
            caret={
              <ArrowRigthI
                className={` ${styles.caret} ${active === "opciones" ? "rotate-90" : "rotate-0"}`}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              setActive((prev) => (prev === "opciones" ? "" : "opciones"));
            }}
          >
            <Li>
              <MoneyI className={styles.icon} />
              <span>Cobrar</span>
            </Li>
            <Li onClick={() => setIsModalOpen(true)}>
              <DetailsI className={styles.icon} />
              <span>Detalles</span>
            </Li>
            <Li>
              <HandsI className={styles.icon} />
              <span>Diferir</span>
            </Li>
            <Li>
              <PercentI className={styles.icon} />
              <span>Descuentos</span>
            </Li>
            <Li onClick={() => deleteBalance(balance.documentId!)}>
              <DeleteI className={styles.icon} />
              {isDeletingBalance ? "Eliminando..." : <span>Eliminar</span>}
            </Li>
          </LiControlHeader>,
        ]}
      />
      <ModalGeneral
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalles del saldo"
      >
        <DetailPanel balance={balance} />
      </ModalGeneral>
    </>
  );
}

function DetailPanel({ balance }: { balance: Balance }) {
  const description = balance.description?.trim();

  return (
    <div className="col-span-full bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30 px-3 py-4">
      <div className="flex flex-col rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-card overflow-hidden">
        <ClientDataRow label="ID del saldo">
          <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300">
            {balance.id_balance}
          </span>
        </ClientDataRow>

        <ClientDataRow label="Saldo">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {currency.format(balance.balance)}
          </span>
        </ClientDataRow>

        <ClientDataRow label="Descripción" className="border-b-0">
          {description ? (
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {description}
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
              Sin descripción
            </span>
          )}
        </ClientDataRow>
      </div>
    </div>
  );
}
