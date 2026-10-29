// Tidslinjens skala. FEAT-002, PRD: FR-VTL-001, FR-VTL-002, FR-VTL-003, FR-VTL-015.
// Beslut OQ-003 (användaren, 2026-10-29):
// - Skalan anpassas efter hur många händelser som ligger nära i tiden.
// - Vyn zoomas ut vid behov, högst MAX_FORWARD_MONTHS framåt (och lika långt bakåt).
// - Händelser längre bort än fönstret nås genom horisontell scroll.
// Ren logik, inga sidoeffekter.
import { toDayNumber } from '../milestones/status';

export const MAX_FORWARD_MONTHS = 6;
export const MAX_PAST_MONTHS = 6;
const CANDIDATE_MONTHS = [1, 2, 3, 6] as const;
const CANVAS_PADDING_DAYS = 15;
const DAY_MS = 86_400_000;

export interface ScaleInput {
  todayIso: string;
  eventDates: string[];
}

export interface TimelineScale {
  todayDay: number;
  /** Fönstret som visas direkt när vyn öppnas. */
  viewStart: number;
  viewEnd: number;
  /** Hela canvas. Innehåller även händelser utanför fönstret, som nås med scroll. */
  canvasStart: number;
  canvasEnd: number;
  pastMonths: number;
  forwardMonths: number;
}

export function dayToIso(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

export function addMonths(day: number, months: number): number {
  const d = new Date(day * DAY_MS);
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate());
  return Math.floor(target / DAY_MS);
}

/**
 * Väljer hur långt fönstret ska nå åt ett håll.
 * Kortaste kandidat som rymmer alla händelser inom MAX_*_MONTHS. Ingen händelse inom gränsen ger 1 månad.
 */
function pickMonths(today: number, days: number[], direction: 1 | -1): number {
  const horizon = addMonths(today, direction * MAX_FORWARD_MONTHS);
  const inRange = days.filter((d) =>
    direction > 0 ? d >= today && d <= horizon : d < today && d >= horizon,
  );
  if (inRange.length === 0) return CANDIDATE_MONTHS[0];

  const furthest = direction > 0 ? Math.max(...inRange) : Math.min(...inRange);
  for (const months of CANDIDATE_MONTHS) {
    const limit = addMonths(today, direction * months);
    if (direction > 0 ? furthest <= limit : furthest >= limit) return months;
  }
  return MAX_FORWARD_MONTHS;
}

export function computeScale(input: ScaleInput): TimelineScale {
  const todayDay = toDayNumber(input.todayIso);
  const days = input.eventDates.map(toDayNumber);
  const pastMonths = pickMonths(todayDay, days, -1);
  const forwardMonths = pickMonths(todayDay, days, 1);

  const viewStart = addMonths(todayDay, -pastMonths);
  const viewEnd = addMonths(todayDay, forwardMonths);
  const canvasStart = Math.min(viewStart, ...days) - CANVAS_PADDING_DAYS;
  const canvasEnd = Math.max(viewEnd, ...days) + CANVAS_PADDING_DAYS;

  return { todayDay, viewStart, viewEnd, canvasStart, canvasEnd, pastMonths, forwardMonths };
}

/** Horisontell position i pixlar för en dag på canvas. */
export function xFor(day: number, canvasStart: number, pxPerDay: number): number {
  return (day - canvasStart) * pxPerDay;
}

export interface LaneItem {
  id: string;
  x: number;
}

/**
 * Fördelar kort på rader så att överlappande kort inte ligger på samma rad (FR-VTL-014).
 * Kort som ligger för nära varandra i x hamnar på olika rader.
 */
export function assignLanes(items: LaneItem[], cardWidth: number, gap: number): Map<string, number> {
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const laneRight: number[] = [];
  const result = new Map<string, number>();

  for (const item of sorted) {
    let lane = laneRight.findIndex((right) => item.x >= right + gap);
    if (lane === -1) {
      lane = laneRight.length;
      laneRight.push(0);
    }
    laneRight[lane] = item.x + cardWidth;
    result.set(item.id, lane);
  }
  return result;
}
