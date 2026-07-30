interface FormButtonProps {
  isPending: boolean;
  label: string;
  pendingLabel?: string;
  className?: string;
}

export default function FormButton({
  isPending,
  label,
  pendingLabel = "Guardando...",
  className = "",
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`
        px-4 py-1.5 text-xs font-semibold rounded-lg text-white
        bg-amber-600 hover:bg-amber-700
        disabled:bg-amber-600/50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-amber-500/50
        transition-all duration-150
        ${className}
      `}
    >
      {isPending ? (
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
