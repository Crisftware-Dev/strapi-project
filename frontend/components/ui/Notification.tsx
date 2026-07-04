interface NotificationProps {
  notification: { message: string; type: "success" | "error" } | null;
}

export default function Notification({ notification }: NotificationProps) {
  if (!notification) return null;

  const colorClass =
    notification.type === "success"
      ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-900 dark:text-green-300"
      : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-900 dark:text-red-300";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-2 px-4 py-2.5
        rounded-lg border text-xs font-medium shadow-lg
        transition-all duration-300 animate-slide-in-up
        ${colorClass}
      `}
    >
      <span>{notification.message}</span>
    </div>
  );
}
