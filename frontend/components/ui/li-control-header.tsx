import { useClickOutside } from "@/hooks/useClickOutside";
import { JSX } from "react";

interface LiControlHeaderProps {
  text?: string;
  id: string;
  icon: JSX.Element;
  isActive?: boolean;
  setActive: (id: string) => void;
  caret?: JSX.Element;
  children?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

const styles = {
  ul: "absolute left-auto right-0 top-8 z-2000 w-auto min-w-45 bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 text-xs text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out",
  li: "relative flex items-center gap-1 px-2 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer whitespace-nowrap",
};

export default function LiControlHeader({
  onClick,
  text,
  id,
  icon,
  caret,
  isActive,
  setActive,
  children,
}: LiControlHeaderProps) {
  const menuRef = useClickOutside<HTMLLIElement>(() => {
    if (isActive) setActive("");
  });

  return (
    <button
      aria-controls={id + "-dropdown"}
      className="w-full focus:outline-none"
    >
      <li key={id} ref={menuRef} onClick={onClick} className={styles.li}>
        {icon}
        <span>{text}</span>
        {caret}
        {isActive && children && (
          <ul
            className={
              styles.ul +
              (isActive
                ? " opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : " opacity-0 scale-95 -translate-y-2 pointer-events-none")
            }
          >
            {children}
          </ul>
        )}
      </li>
    </button>
  );
}
