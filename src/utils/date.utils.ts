export function computeScheduledDate(startDate: Date, availableDays: number[], lessonIndex: number): Date {
  const sortedDays = availableDays.slice().sort((a, b) => a - b);
  const weekOffset = Math.floor(lessonIndex / sortedDays.length);
  const targetWeekday = sortedDays[lessonIndex % sortedDays.length];

  const currentDay = startDate.getDay();
  let diff = targetWeekday - currentDay;
  if (diff < 0) {
    diff += 7;
  }
  const scheduled = new Date(startDate);
  scheduled.setDate(scheduled.getDate() + diff + weekOffset * 7);
  return scheduled;
}
