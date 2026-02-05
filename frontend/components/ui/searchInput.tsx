import { FaSearch } from "react-icons/fa";
import { Input } from "./input";

interface SearchInputProps {
  type: string;
  id: string;
  placeholder: string;
  ariaLabel: string;
}

const styles = {
  searchField: "relative flex w-full sm:w-64 lg:w-72 min-w-70",
  input:
    "flex-1 h-6 px-3 text-xs placeholder:text-xs text-center bg-gray-50/70 dark:bg-gray-900/70 shadow-none focus-visible:ring-1 focus-visible:ring-offset-0 border-none outline-none rounded-l-none",
  searchButton:
    "h-6 px-3 text-black-400/80 text-xs border-r border-gray-300 dark:border-gray-700 cursor-pointer flex items-center justify-center bg-gray-50/70 dark:bg-gray-900/70 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors rounded-l",
  icon: "text-indigo-500 dark:text-indigo-400"
};

export default function SearchInput({
  type,
  id,
  placeholder,
  ariaLabel
}: SearchInputProps) {
  return (
    <div
      className={`${styles.searchField}`}
    >
      <button aria-label={ariaLabel} className={styles.searchButton} type="button">
        <FaSearch className={styles.icon} />
      </button>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className={styles.input}
        autoComplete="off"
      />
    </div>
  );
}
