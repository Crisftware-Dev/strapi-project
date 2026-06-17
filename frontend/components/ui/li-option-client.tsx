import { JSX } from "react";

interface LiOptionClientProps {
  id: string;
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick?: (id: string) => void;
}

export default function LiOptionClient({
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
              bg-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60
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
