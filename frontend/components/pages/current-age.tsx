import { DateTime } from "luxon";

export default function CurrentAge({ date }: { date: string }) {
  const today = DateTime.now();
  const birthDate = DateTime.fromISO(date);
  const diff = today.diff(birthDate, ["years", "months", "days"]).toObject();

  return (
    <div className="flex items-center gap-2 text-indigo-500/80 text-[11px] bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
      <span>📅 Edad:</span>
      <span className="font-medium">
        {diff.years ? diff.years : "0"} años | {diff.months ? diff.months : "0"}{" "}
        meses | {diff.days ? Math.floor(Number(diff.days)) : "0"} días
      </span>
    </div>
  );
}
