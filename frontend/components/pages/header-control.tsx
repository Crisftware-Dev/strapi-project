"use client";

import { logoutUserAction } from "@/actions/auth";

import {
  ArrowRigthI,
  CircleI,
  KeyI,
  PencilModifYI,
  PowerOffI,
  SearchI,
  SupportI,
  UserI,
} from "@/components/icons/Icons";
import LiControlHeader from "@/components/ui/li-control-header";
import { Li } from "@/components/ui/li";
import { Ul } from "@/components/ui/ul";

import { useState } from "react";
import ChangePass from "@/components/ui/change-pass";
import { useUser } from "@/hooks/useUser";
import { useTabsControl } from "@/contexts/control-context";
import { useClickOutside } from "@/hooks/useClickOutside";

const styles = {
  header:
    "flex w-full bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 gap-5 px-3 py-0.5 sticky top-0 z-3000 shadow-sm",
  section: "max-w-auto flex items-center justify-start h-8 gap-4",
  a: "flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded",
  logo: "w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0",
  ul: "flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 ",
  icon: "text-indigo-400 text-xs w-[14px] h-[14px]",
  caret: "text-indigo-400 text-xs transition-all duration-300 w-3 h-4",
};

export default function HeaderControl() {
  const { openTab, activeControls, setActiveControls, setActiveSubControls } = useTabsControl();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user } = useUser();

  const nameAndLastname =
    user?.fullname
      ?.split(" ")[0]
      .concat(" ", user?.lastname?.split(" ")[0])
      ?.toUpperCase() || "";

  const data = nameAndLastname
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logoutUserAction();
  };

  const navRef = useClickOutside<HTMLElement>(() => {
    if (activeControls) setActiveControls("");
  });

  const handleDropdownClick = (e: React.MouseEvent, id?: string) => {
    if (!id) return;
    e.stopPropagation();
    setActiveControls(activeControls === id ? "" : id);
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
        ref={navRef}
        aria-label="Navegación principal"
        className="flex flex-1 justify-between items-center"
      >
        <Ul className={styles.ul}>
          <LiControlHeader
            id="control"
            text="Control"
            activeControls={activeControls === "control"}
            icon={<CircleI className={styles.icon} />}
            caret={
              <ArrowRigthI
                className={` ${styles.caret} ${activeControls === "control" ? "rotate-90" : "rotate-0"}`}
              />
            }
            onClick={handleDropdownClick}
          >
            <Li
              id="busqueda"
              label="Busqueda de contratos"
              onClick={(e) => {
                e.stopPropagation();
                openTab("busqueda", "Busqueda de contratos");
                setActiveSubControls("busqueda");
                setActiveControls("");
              }}
            >
              <SearchI className={styles.icon} />
            </Li>
            <Li
              label="Contratos"
              id="contratos"
              onClick={(e) => {
                e.stopPropagation();
                openTab("contratos", "Contratos");
                setActiveSubControls("contratos");
                setActiveControls("");
              }}
            >
              <UserI className={styles.icon} />
            </Li>
            <Li
              id="add-plans"
              label="Añadir Planes"
              onClick={(e) => {
                e.stopPropagation();
                openTab("add-plans", "Añadir Planes");
                setActiveSubControls("add-plans");
                setActiveControls("");
              }}
            >
              <PencilModifYI className={styles.icon} />
            </Li>
            <Li
              label="Soporte"
              id="soporte"
              onClick={(e) => {
                e.stopPropagation();
                openTab("soporte", "Soporte");
                setActiveSubControls("soporte");
                setActiveControls("");
              }}
            >
              <SupportI className={styles.icon} />
            </Li>
          </LiControlHeader>
        </Ul>
        <Ul className={styles.ul}>
          <LiControlHeader
            id="usuario"
            text={data}
            activeControls={activeControls === "usuario"}
            icon={<UserI className={styles.icon} />}
            caret={
              <ArrowRigthI
                className={`${styles.caret} ${activeControls === "usuario" ? "rotate-90" : "rotate-0"}`}
              />
            }
            onClick={handleDropdownClick}
          >
            <Li label={nameAndLastname}>
              <UserI className={styles.icon} />
            </Li>
            <div className="w-full" onClick={() => { setIsOpen(true); setActiveControls(""); }}>
              <Li label="Cambiar Clave">
                <KeyI className={styles.icon} />
              </Li>
            </div>
            <div className="w-full" onClick={() => { handleLogout(); setActiveControls(""); }}>
              <Li label="Cerrar Sesión">
                <PowerOffI className={styles.icon} />
              </Li>
            </div>
          </LiControlHeader>
        </Ul>
      </nav>
      <ChangePass isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
