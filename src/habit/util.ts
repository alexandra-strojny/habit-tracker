export const getTimespan = () => {
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