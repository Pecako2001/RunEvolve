export function formatTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function getCurrentWeekKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (now.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  const weekNumber = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
  );
  return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
}
