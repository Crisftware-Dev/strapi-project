export const styles = {
  container:
    "w-full h-screen flex flex-col flex-1 bg-white dark:bg-gray-950 text-xs shadow-sm border border-indigo-100 dark:border-indigo-900/30 rounded-lg overflow-x-hidden",
  mainGrid: "w-full flex h-[850px] gap-0",
  leftColumn: "h-full border-r border-indigo-300 dark:border-indigo-900/30",
  rightColumn: "h-full bg-gray-50/50 dark:bg-gray-900/20",

  input:
    "w-auto bg-transparent border-none px-2 h-6 text-xs focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-700 dark:text-gray-200",
  select:
    "w-full p-0 text-xs focus:ring-0 dark:text-gray-200 cursor-pointer border-none dark:border-indigo-800 rounded px-2 py-2 h-8 bg-indigo-100/30 font-semibold text-indigo-900",
  inputLabel:
    "text-[10px] font-semibold text-indigo-900/60 dark:text-indigo-300/60 uppercase px-2 border-indigo-100 dark:border-indigo-900/30",

  searchInput:
    "w-full pl-8 pr-3 py-1.5 text-xs border border-indigo-100 dark:border-indigo-900/50 rounded bg-white dark:bg-gray-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm",

  radioGroup: "flex items-center gap-6",
  radioLabel: "flex items-center gap-2 cursor-pointer select-none group",
  radio: "w-3.5 h-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500",

  plusButton:
    "w-6 h-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-100 dark:border-indigo-900/30",
  uploadButton:
    "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-medium transition-all shadow-sm flex items-center gap-1.5",
  actionButton:
    "h-auto px-3 py-1 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/30 rounded text-[10px] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 transition-colors",

  tableHeader:
    "h-auto px-3 py-1 text-left text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 tracking-wider uppercase border-b border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/20",
  tableCell:
    "px-3 py-2 border-b border-indigo-50 dark:border-indigo-900/20 text-gray-600 dark:text-gray-300 text-xs",

  toggle:
    "relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer",
  toggleOn: "bg-green-500",
  toggleOff: "bg-gray-200 dark:bg-gray-700",
  toggleThumb:
    "inline-block h-3 w-3 transform rounded-full bg-white transition transition-transform shadow-sm",
  toggleThumbOn: "translate-x-4",
  toggleThumbOff: "translate-x-1",
  icon: "text-indigo-400 text-xs w-[14px] h-[14px]",
  caret: "text-indigo-400 text-xs transition-all duration-300 w-3 h-4",
};
