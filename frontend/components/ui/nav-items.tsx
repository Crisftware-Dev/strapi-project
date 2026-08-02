import { JSX } from "react";

// ─── LiControlHeader — item de menú desplegable ───────────────────────────────

interface LiControlHeaderProps {
  text?: string;
  id: string;
  icon: JSX.Element;
  isActive?: boolean;
  activeControls?: boolean;
  menuRef?: React.RefObject<HTMLLIElement>;
  caret?: JSX.Element;
  children?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>, id?: string) => void;
}

const LI_STYLE =
  "relative flex items-center gap-1 px-2 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer whitespace-nowrap";

const UL_DROPDOWN =
  "absolute left-auto right-0 top-8 z-2000 w-auto min-w-28 bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 text-xs text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out";

export function LiControlHeader({
  onClick,
  text,
  id,
  icon,
  caret,
  isActive,
  activeControls,
  children,
  menuRef,
}: LiControlHeaderProps) {
  const isMenuOpen = isActive ?? activeControls;

  return (
    <li ref={menuRef} key={id} className={`relative ${LI_STYLE}`}>
      <button
        type="button"
        aria-controls={id + "-dropdown"}
        aria-expanded={Boolean(isMenuOpen)}
        onClick={(e) => onClick(e, id)}
        className="flex items-center gap-1 w-full focus:outline-none cursor-pointer"
      >

        {icon}
        {text && <span>{text}</span>}
        {caret}
      </button>
      <ul
        id={id + "-dropdown"}
        className={
          UL_DROPDOWN +
          (isMenuOpen && children
            ? " opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : " opacity-0 scale-95 -translate-y-2 pointer-events-none")
        }
      >
        {children}
      </ul>
    </li>
  );
}


// ─── LiOptionClient — tab de cliente activo ───────────────────────────────────

interface LiOptionClientProps {
  id: string;
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick?: (id: string) => void;
}

export function LiOptionClient({
  id,
  label,
  icon,
  isActive,
  onClick,
}: LiOptionClientProps) {
  return (
    <li
      key={id}
      onClick={() => onClick?.(id)}
      className={`
              flex items-center gap-2 px-5 py-0.5
              cursor-pointer select-none
              transition-colors duration-150
              border-t-2 border-transparent
              bg-gray-100 hover:bg-gray-50
              dark:bg-transparent dark:hover:bg-gray-800/60
              ${
                isActive
                  ? "bg-white text-gray-900 dark:bg-gray-800 dark:text-white border-t-black dark:border-t-white font-semibold"
                  : ""
              }
            `}
    >
      {icon}
      {label}
    </li>
  );
}
