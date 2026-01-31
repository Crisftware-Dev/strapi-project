import LiControlHeader, { Li } from "@/components/ui/li-control-header";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

export default function HeaderControl() {
  const [active, setActive] = useState("");

  const menuRef = useClickOutside<HTMLLIElement>(() => {
    if (active) setActive("");
  });

  return (
    <header className="flex justify-between w-full bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-3 py-0.5 sticky top-0 z-20 shadow-sm">
      <div className="max-w-auto flex items-center justify-start h-8 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            L
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
              Nombre Empresa
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              Santo Domingo, Ecuador
            </span>
          </div>
        </div>

        <nav className="flex items-center">
          <ul className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <LiControlHeader
              ref={menuRef}
              text="Control"
              active={active === "control"}
              onClick={(e) => {
                e.stopPropagation();
                setActive((prev) => (prev === "control" ? "" : "control"));
              }}
            />
          </ul>
        </nav>
      </div>
      <nav className="flex items-center justify-end">
        <ul className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
          <Li>
            <FaUser className="text-indigo-400 text-xs" />
            <span>Usuario</span>
            <FaCaretRight
              className={`text-indigo-400 text-xs transition-all duration-300 ${active ? "rotate-90" : "rotate-0"}`}
            />
          </Li>
        </ul>
      </nav>
    </header>
  );
}

// MAÑANA 30 DE ENERO A DARLE CAÑA CON LA UX Y LAS FUNCIONES DE ESTE COMPONENTE
