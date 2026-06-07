// "use client";

// import { TAB_CATALOG, Tab, TabId } from "@/contexts/control-context";
// import {
//   SearchI,
//   UserI,
//   PencilModifYI,
//   SupportI,
//   CloseI,
// } from "@/components/icons/Icons";
// import { JSX } from "react";

// // ─── Icono por tipo de pestaña ────────────────────────────────────────────────
// const TAB_ICONS: Record<TabId, JSX.Element> = {
//   busqueda: (
//     <SearchI className="w-3 h-3 shrink-0 text-indigo-500 dark:text-indigo-400" />
//   ),
//   contratos: (
//     <UserI className="w-3 h-3 shrink-0 text-indigo-500 dark:text-indigo-400" />
//   ),
//   modificar: (
//     <PencilModifYI className="w-3 h-3 shrink-0 text-indigo-500 dark:text-indigo-400" />
//   ),
//   soporte: (
//     <SupportI className="w-3 h-3 shrink-0 text-indigo-500 dark:text-indigo-400" />
//   ),
// };

// // ─── Botones para abrir pestañas cerradas ────────────────────────────────────
// const ADD_BUTTONS: { id: TabId; label: string }[] = [
//   { id: "contratos", label: "Contratos" },
//   { id: "modificar", label: "Modificar Contratos" },
//   { id: "soporte", label: "Soporte" },
// ];

// interface TabListProps {
//   tabs: Tab[];
//   activeTabId: TabId;
//   onSelectTab: (id: TabId) => void;
//   onCloseTab: (id: TabId) => void;
//   onOpenTab: (id: TabId) => void;
// }

// export default function TabList({
//   tabs,
//   activeTabId,
//   onSelectTab,
//   onCloseTab,
//   onOpenTab,
// }: TabListProps) {
//   // IDs de pestañas ya abiertas (para ocultar el botón de apertura)
//   const openIds = new Set(tabs.map((t) => t.id));

//   return (
//     <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-8 z-1000">
//       {/* ── Fila de pestañas abiertas ──────────────────────────────────────── */}
//       <div
//         role="tablist"
//         aria-label="Pestañas de contratos"
//         className="flex items-end gap-0 overflow-x-auto scrollbar-hide px-2 pt-1"
//       >
//         {tabs.map((tab) => {
//           const isActive = tab.id === activeTabId;
//           return (
//             <button
//               key={tab.id}
//               role="tab"
//               id={`tab-btn-${tab.id}`}
//               aria-selected={isActive}
//               aria-controls={`tabpanel-${tab.id}`}
//               onClick={() => onSelectTab(tab.id)}
//               className={`
//                 group relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
//                 whitespace-nowrap select-none outline-none
//                 border border-b-0 rounded-t-md transition-all duration-150
//                 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
//                 ${
//                   isActive
//                     ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 shadow-sm -mb-px z-10"
//                     : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//                 }
//               `}
//             >
//               {/* Barra de color activa arriba */}
//               {isActive && (
//                 <span className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500 rounded-t-md" />
//               )}

//               {TAB_ICONS[tab.id]}
//               <span>{tab.label}</span>

//               {/* Botón cerrar (solo si es closable) */}
//               {tab.closable && (
//                 <span
//                   role="button"
//                   aria-label={`Cerrar pestaña ${tab.label}`}
//                   tabIndex={0}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onCloseTab(tab.id);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       onCloseTab(tab.id);
//                     }
//                   }}
//                   className="
//                     ml-0.5 flex items-center justify-center w-4 h-4 rounded
//                     opacity-0 group-hover:opacity-100 transition-opacity duration-100
//                     hover:bg-gray-300 dark:hover:bg-gray-600
//                     focus-visible:opacity-100 focus-visible:outline-none
//                   "
//                 >
//                   <CloseI className="w-2.5 h-2.5" />
//                 </span>
//               )}
//             </button>
//           );
//         })}

//         {/* ── Botones "+" para pestañas no abiertas ────────────────────────── */}
//         {ADD_BUTTONS.filter((b) => !openIds.has(b.id)).map((btn) => (
//           <button
//             key={`add-${btn.id}`}
//             onClick={() => onOpenTab(btn.id)}
//             title={`Abrir ${TAB_CATALOG[btn.id].label}`}
//             aria-label={`Abrir pestaña ${TAB_CATALOG[btn.id].label}`}
//             className="
//               flex items-center gap-1 px-2.5 py-1.5 mb-px text-[11px] font-medium
//               rounded-t-md border border-dashed border-gray-300 dark:border-gray-600
//               text-gray-400 dark:text-gray-500
//               hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400
//               transition-all duration-150 whitespace-nowrap select-none outline-none
//               focus-visible:ring-2 focus-visible:ring-indigo-500
//             "
//           >
//             {TAB_ICONS[btn.id]}
//             <span className="hidden sm:inline">{btn.label}</span>
//             <span className="text-base leading-none ml-0.5">+</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
