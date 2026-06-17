import { ReactNode } from "react";

interface TabPanelProps {
  children: ReactNode;
}

export default function TabPanel({ children }: TabPanelProps) {
  return (
    <section
      role="tabpanel"
      className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 animate-fade-in"
    >
      {children}
    </section>
  );
}
