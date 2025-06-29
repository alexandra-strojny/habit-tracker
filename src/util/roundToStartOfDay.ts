export const roundToStartOfDay = (timestamp: number): number => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(timestamp);
  // Use Intl API to adjust to local midnight
  const tzDate = new Date(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  );
  return tzDate.getTime();
}