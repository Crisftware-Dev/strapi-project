"use client";

import { logoutUserAction } from "@/actions/auth";

import LiControlHeader from "@/components/ui/li-control-header";
import { Li } from "@/components/ui/li";

import { useState } from "react";

import {
  FaUser,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaSliders,
  FaCaretRight,
  FaGenderless,
  FaKey,
  FaPowerOff,
} from "react-icons/fa6";

interface HeaderControlProps {
  initialUser: { username: string } | null;
}

const styles = {
  header:
    "flex w-full bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 gap-5 px-3 py-0.5 sticky top-0 z-20 shadow-sm",
  section: "max-w-auto flex items-center justify-start h-8 gap-4",
  a: "flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded",
  logo: "w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0",
  ul: "flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300",
  icon: "text-indigo-400 text-xs",
  caret: "text-indigo-400 text-xs transition-all duration-300 rotate-0",
};

export default function HeaderControl({ initialUser }: HeaderControlProps) {
  const [active, setActive] = useState("");

  const data = initialUser?.username.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logoutUserAction();
  };

  return (
    <header className={styles.header}>
      <a href="#" className={styles.a} aria-label="Ir a Empresa Génerica">
        <div className={styles.logo}>L</div>

        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Nombre Empresa
          </span>
          <span className="text-[10px] text-gray-600 dark:text-gray-300">
            Santo Domingo, Ecuador
          </span>
        </div>
      </a>
      <nav
        aria-label="Navegación principal"
        className="flex flex-1 justify-between items-center"
      >
        <ul className={styles.ul}>
          <LiControlHeader
            setActive={setActive}
            icon={<FaGenderless className={styles.icon} />}
            caret={
              <FaCaretRight
                className={` ${styles.caret} ${active === "control" ? "rotate-90" : "rotate-0"}`}
              />
            }
            id="control"
            text="Control"
            isActive={active === "control"}
            onClick={(e) => {
              e.stopPropagation();
              setActive((prev) => (prev === "control" ? "" : "control"));
            }}
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
          </LiControlHeader>
        </ul>
        <ul className={styles.ul}>
          <LiControlHeader
            setActive={setActive}
            id="usuario"
            text={data}
            icon={<FaUser className="text-indigo-400 text-xs" />}
            caret={
              <FaCaretRight
                className={`${styles.caret} ${active === "usuario" ? "rotate-90" : "rotate-0"}`}
              />
            }
            isActive={active === "usuario"}
            onClick={(e) => {
              e.stopPropagation();
              setActive((prev) => (prev === "usuario" ? "" : "usuario"));
            }}
          >
            <Li>
              <FaUser className={styles.icon} />
              <span>{initialUser?.username}</span>
            </Li>
            <Li>
              <FaKey className={styles.icon} />
              <span>Cambiar Clave</span>
            </Li>
            <button className="w-full" onClick={handleLogout}>
              <Li>
                <FaPowerOff className={styles.icon} />
                <span>Cerrar Sesión</span>
              </Li>
            </button>
          </LiControlHeader>
        </ul>
      </nav>
    </header>
  );
}
