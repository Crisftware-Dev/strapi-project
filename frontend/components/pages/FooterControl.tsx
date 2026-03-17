import { Button } from "@/components/ui/button";

export default function FooterControl() {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-indigo-100 dark:border-indigo-900/30 p-3 shadow-sm mt-auto">
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-7xl mx-auto">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-6">
          Guardar
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          Editar
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          Nuevo
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          + Añadir
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          Liberar
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          RE-ENVIAR PIN
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          Hist de Planes
        </Button>
        <Button variant={"outline"} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
          Enviar Contrato
        </Button>
      </div>
    </footer>
  );
}
