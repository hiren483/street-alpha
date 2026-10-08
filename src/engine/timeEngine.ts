export const TIME_SLOTS = [
  { minutes: 9 * 60, label: '9:00 AM', phase: 'Morning' },
  { minutes: 10 * 60, label: '10:00 AM', phase: 'Daytime' },
  { minutes: 11 * 60, label: '11:00 AM', phase: 'Daytime' },
  { minutes: 12 * 60, label: '12:00 PM', phase: 'Daytime' },
  { minutes: 13 * 60, label: '1:00 PM', phase: 'Daytime' },
  { minutes: 14 * 60, label: '2:00 PM', phase: 'Daytime' },
  { minutes: 15 * 60, label: '3:00 PM', phase: 'Daytime' },
  { minutes: 16 * 60, label: '4:00 PM', phase: 'Daytime' },
  { minutes: 17 * 60, label: '5:00 PM', phase: 'Evening' },
  { minutes: 20 * 60, label: '8:00 PM', phase: 'Evening' },
  { minutes: 22 * 60, label: '10:00 PM', phase: 'Night' },
];

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export function getDayName(day: number): string {
  const index = (day - 1) % DAYS_OF_WEEK.length;
  return DAYS_OF_WEEK[index];
}

export function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  const displayMins = mins < 10 ? `0${mins}` : mins;
  return `${displayHrs}:${displayMins} ${period}`;
}

export function getTimePhase(minutes: number): 'Morning' | 'Daytime' | 'Evening' | 'Night' {
  if (minutes < 10 * 60) return 'Morning';
  if (minutes < 17 * 60) return 'Daytime';
  if (minutes < 21 * 60) return 'Evening';
  return 'Night';
}

export function advanceTime(currentMinutes: number, addedMinutes: number): number {
  const newMinutes = currentMinutes + addedMinutes;
  const maxMinutes = 22 * 60; // 10:00 PM
  return Math.min(newMinutes, maxMinutes);
}
