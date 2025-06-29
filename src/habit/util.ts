import type { Streak } from "../types/types";

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

export const analyzeStreaks = (streaks: Streak[]) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const msPerDay = 86400000;

  let totalDays = 0;
  let longestStreakDays = 0;
  let currentStreakDays = 0;

  // Normalize "today" to midnight in the user's timezone
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const todayMidnight = new Date(formatter.format(today)).getTime();

  for (const streak of streaks) {
    const days = Math.floor((streak.endDate - streak.startDate) / msPerDay) + 1;

    totalDays += days;
    if (days > longestStreakDays) {
      longestStreakDays = days;
    }

    // Check if today is part of this streak
    if (streak.startDate <= todayMidnight && todayMidnight <= streak.endDate) {
      currentStreakDays = days;
    }
  }

  return {
    totalDays,
    longestStreakDays,
    currentStreakDays,
  };
}
