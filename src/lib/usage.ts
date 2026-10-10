import { createPersistedStore } from '@/lib/persisted-store';

/** Free-tier AI breakdowns per week. Enforced on-device until accounts and the paywall exist. */
export const FREE_BREAKDOWNS_PER_WEEK = 5;

type Usage = { weekStart: number; count: number };

const store = createPersistedStore<Usage>('focusflow.usage', { weekStart: 0, count: 0 });

/** Midnight on the most recent Monday, local time. */
function currentWeekStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.getTime();
}

export function useBreakdownsLeft() {
  const usage = store.use();
  const used = usage.weekStart === currentWeekStart() ? usage.count : 0;
  return Math.max(0, FREE_BREAKDOWNS_PER_WEEK - used);
}

export function recordBreakdown() {
  const weekStart = currentWeekStart();
  const usage = store.get();
  store.set({ weekStart, count: usage.weekStart === weekStart ? usage.count + 1 : 1 });
}
