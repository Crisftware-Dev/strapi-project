import { RefObject } from "react";
import { FaCaretRight, FaGenderless, FaMagnifyingGlass, FaPenToSquare, FaSliders, FaUser } from "react-icons/fa6";

interface LiControlHeaderProps {
  active: boolean;
  text?: string;
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

const styles = {
  ul: "absolute left-40 top-9 z-2000 w-auto min-w-45 bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 text-xs text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out",
  li: "flex items-center gap-1 px-2 py-1.5 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer whitespace-nowrap",
  icon: "text-indigo-400 text-xs",
};

export default function LiControlHeader({
  active,
  onClick,
  text,
  ref,
}: LiControlHeaderProps & { ref: RefObject<HTMLLIElement | null> }) {
  return (
    <li ref={ref} onClick={onClick} className={styles.li}>
      <FaGenderless className="text-indigo-400 text-xs" />
      <span>{text}</span>
      <FaCaretRight
        className={`text-indigo-400 text-xs transition-all duration-300 ${active ? "rotate-90" : "rotate-0"}`}
      />
      <ul
        className={
          styles.ul +
          (active
            ? " opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : " opacity-0 scale-95 -translate-y-2 pointer-events-none")
        }
      >
        <Li>
          <FaMagnifyingGlass className={styles.icon} />
          <span>Busqueda de contratos</span>
        </Li>
        <Li>
          <FaUser className={styles.icon} />
          <span>Contratos</span>
        </Li>
        <Li>
          <FaPenToSquare className={styles.icon} />
          <span>Modificar contratos</span>
        </Li>
        <Li>
          <FaSliders className={styles.icon} />
          <span>Soporte</span>
        </Li>
      </ul>
    </li>
  );
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li className={styles.li + " hover:bg-gray-300"}>{children}</li>;
}
