"use client";

import { logoutUserAction } from "@/actions/auth";

import { LiControlHeader } from "@/components/ui/nav-items";
import { Li, Ul } from "@/components/ui/list";

import { useState } from "react";
import ChangePass from "@/components/ui/change-pass";
import { useCurrentUser } from "@/hooks/useUser";
import { useTabsControl } from "@/contexts/control-context";
import { useClickOutside } from "@/hooks/useClickOutside";
import { buildControlsList } from "@/components/ui/arrays";

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
  const { openTab, activeControls, setActiveControls, setActiveSubControls } =
    useTabsControl();
  const [isOpen, setIsOpen] = useState(false);
  const { nameAndLastname, initials } = useCurrentUser();

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

  const controlsList = buildControlsList({
  activeControls,
  initials,
  nameAndLastname,
  openTab,
  setActiveSubControls,
  setActiveControls,
  setIsOpen,
  handleLogout,
});

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
        {controlsList.map((control) => (
          <Ul key={control.id} className={styles.ul}>
            <LiControlHeader
              id={control.id}
              text={control.text}
              activeControls={activeControls === control.id}
              icon={control.icon}
              caret={control.caret}
              onClick={handleDropdownClick}
            >
              {control.children?.map((child) => (
                <Li
                  key={child.id}
                  id={child.id}
                  label={child.text}
                  onClick={child.onClick}
                >
                  {child.icon}
                </Li>
              ))}
            </LiControlHeader>
          </Ul>
        ))}
      </nav>
      <ChangePass isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
