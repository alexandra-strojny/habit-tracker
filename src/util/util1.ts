import type { Frequency, Streak } from "../types/types";

export const getTimeSpan = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Go back 1 Month
  const startMonth = new Date(today);
  startMonth.setMonth(today.getMonth() - 1);
  const startTime = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);

  // Go forward 1 Month
  const endMonth = new Date(today);
  endMonth.setMonth(today.getMonth() + 1);
  const endTime = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);

  return {startTime: startTime.getTime(), endTime: endTime.getTime()};
};

export const analyzeStreaks = (streaks: Streak[], frequency: Frequency) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const msPerUnit = frequency === 'weekly' ? 7 * 86400000 : 86400000;

  let totalUnits = 0;
  let longestStreak = 0;
  let currentStreak = 0;

  const today = new Date();
  const normalizedToday =
    frequency === 'weekly'
      ? getStartOfWeek(today, timezone)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  for (const streak of streaks) {
    const span = Math.floor((streak.endDate - streak.startDate) / msPerUnit) + 1;

    totalUnits += span;
    longestStreak = Math.max(longestStreak, span);

    if (streak.startDate <= normalizedToday && normalizedToday <= streak.endDate) {
      currentStreak = span;
    }
  }

  return {
    totalDays: frequency === 'daily' ? totalUnits : undefined,
    totalWeeks: frequency === 'weekly' ? totalUnits : undefined,
    longestStreak,
    currentStreak,
  };
}

function getStartOfWeek(date: Date, timezone = 'UTC'): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const localDate = new Date(formatter.format(date));
  const day = localDate.getUTCDay(); // Sunday = 0
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  localDate.setUTCDate(localDate.getUTCDate() + diff);
  return Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate());
}

