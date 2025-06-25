import type { Habit } from "../types/types";

export const partition = (
  arr: Habit[],
  fn: (arg0: Habit, arg1: number, arg2: Habit[]) => boolean
): [Habit[], Habit[]] =>
  arr.reduce<[Habit[], Habit[]]>(
    (acc, val, i, arr) => {
      acc[fn(val, i, arr) ? 0 : 1].push(val);
      return acc;
    },
    [[], []]
  );

export const getWeekBounds = (date: Date): { startTime: number; endTime: number } => {
  // Get the current day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = date.getDay();

  // Clone date and set to midnight Sunday (start of week)
  const weekStartDate = new Date(date);
  weekStartDate.setDate(date.getDate() - dayOfWeek);
  weekStartDate.setHours(0, 0, 0, 0);

  // Clone date and set to 11:59:59.999pm Saturday (end of week)
  const weekEndDate = new Date(date);
  weekEndDate.setDate(date.getDate() + (6 - dayOfWeek));
  weekEndDate.setHours(23, 59, 59, 999);

  return {
    startTime: weekStartDate.getTime(),
    endTime: weekEndDate.getTime(),
  };
}

export const getCurrentWeekBounds = (): { startTime: number; endTime: number } => {
  const now = new Date();
  return getWeekBounds(now);
}

export const getCurrentWeekDates = ()=>{
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

export const getCurrentBiMonthlyDates = (): Date[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dayOfWeek = now.getDay();

  // Find the Sunday of the current week
  const currentSunday = new Date(now);
  currentSunday.setDate(now.getDate() - dayOfWeek);

  // Go back 3 Sundays
  const startSunday = new Date(currentSunday);
  startSunday.setDate(currentSunday.getDate() - 21); // 3 weeks back

  // Go forward 3 Sundays (so total is 7 weeks including current)
  const endSunday = new Date(currentSunday);
  endSunday.setDate(currentSunday.getDate() + 21); // 3 weeks forward

  // Generate all Sundays between startSunday and endSunday (inclusive)
  const sundays: Date[] = [];
  const current = new Date(startSunday);
  while (current <= endSunday) {
    sundays.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return sundays;
};

export const getCurrentBiMonthlyBounds = (date: Date[]) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startDate = new Date(date[0]);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date[date.length - 1]);
  endDate.setDate(now.getDate() + (6 - dayOfWeek));
  endDate.setHours(23, 59, 59, 999);

  return {
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
  };
}

export const formatShortDateAsWeek = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay()); // Set to the first day of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
  
  return `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
}

export const formatShortDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });