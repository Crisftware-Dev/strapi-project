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

interface BalanceProps {
  balances?: Balance[];
}

export default function Payments({ balances }: BalanceProps) {
  const [active, setActive] = useState("");

  return (
    <PaymentRow
      cells={[
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        <LiControlHeader
          id="opciones"
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
          <Li>
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
          <Li>
            <DeleteI className={styles.icon} />
            <span>Eliminar</span>
          </Li>
        </LiControlHeader>,
      ]}
    />
  );
}
