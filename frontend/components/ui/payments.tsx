import { useState } from "react";
import {
  ArrowRigthI,
  CircleI,
  DetailsI,
  HandsI,
  MoneyI,
  PercentI,
} from "../icons/Icons";
import { PaymentRow } from "./compact-table";
import { Li } from "./list";
import { LiControlHeader } from "./nav-items";
import { styles } from "@/app/styles/styles";

import { ClientDataRow } from "./client-data-row";
import ModalGeneral from "./ModalGeneral";
import { useInvoiceContext } from "@/contexts/invoice-context";
import { Invoice } from "@/types/invoice";

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

export default function Invoices() {
  const { invoices } = useInvoiceContext();

  if (!invoices) return null;

  if (!invoices.length) {
    return (
      <div className="col-span-full p-4 text-center text-xs text-gray-500 dark:text-gray-400">
        No hay pagos realizados
      </div>
    );
  }

  return (
    <>
      {invoices.map((invoice, index) => (
        <InvoiceRow
          key={invoice.documentId ?? invoice.invoice_nro}
          invoice={invoice}
          index={index}
        />
      ))}
    </>
  );
}

function InvoiceRow({
  invoice,
  index,
}: {
  invoice: Invoice;
  index: number;
}) {
  const [active, setActive] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PaymentRow
        cells={[
          <span key="no">{index + 1}</span>,
          <span key="total">{currency.format(invoice.total)}</span>,
          <span key="pagado">{currency.format(invoice.paid ?? 0)}</span>,
          <span key="saldo">{currency.format(invoice.total - (invoice.paid ?? 0))}</span>,
          <span key="factura">{invoice.invoice_nro}</span>,
          <span key="emitida">{formatDate(invoice.issue_date)}</span>,
          <span key="dsctos">{currency.format(invoice.discounts ?? 0)}</span>,
          <LiControlHeader
            key="opciones"
            id={`opciones-${invoice.documentId ?? index}`}
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
            <Li onClick={() => setIsModalOpen(true)}>
              <DetailsI className={styles.icon} />
              <span>Ver Factura</span>
            </Li>
            <Li>
              <MoneyI className={styles.icon} />
              <span>Descargar RIDE</span>
            </Li>
            <Li>
              <HandsI className={styles.icon} />
              <span>Descargar XML</span>
            </Li>
            <Li>
              <PercentI className={styles.icon} />
              <span>Descuentos</span>
            </Li>
          </LiControlHeader>,
        ]}
      />
      <ModalGeneral
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalles de la factura"
      >
        <DetailPanel invoice={invoice} />
      </ModalGeneral>
    </>
  );
}

function DetailPanel({ invoice }: { invoice: Invoice }) {
  const detail = invoice.detail?.trim();

  return (
    <div className="col-span-full bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30 px-3 py-4">
      <div className="flex flex-col rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-card overflow-hidden">
        <ClientDataRow label="N° Factura">
          <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300">
            {invoice.invoice_nro}
          </span>
        </ClientDataRow>

        <ClientDataRow label="Total">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {currency.format(invoice.total)}
          </span>
        </ClientDataRow>

        <ClientDataRow label="Pagado">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {currency.format(invoice.paid ?? 0)}
          </span>
        </ClientDataRow>

        <ClientDataRow label="Fecha emisión">
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {formatDate(invoice.issue_date)}
          </span>
        </ClientDataRow>

        <ClientDataRow label="Detalle" className="border-b-0">
          {detail ? (
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {detail}
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
              Sin detalle
            </span>
          )}
        </ClientDataRow>
      </div>
    </div>
  );
}
