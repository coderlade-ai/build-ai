const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "5 minutes ago" in the UI locale; older than a week falls back to a short date. */
export function formatCheckpointTime(iso: string, locale: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const seconds = Math.round((then.getTime() - now.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  const age = Math.abs(seconds);
  if (age >= 7 * 86_400)
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
      then,
    );
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of units)
    if (age >= size) return rtf.format(Math.round(seconds / size), unit);
  return rtf.format(0, "second");
}
