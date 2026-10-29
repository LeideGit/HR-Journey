// Statusberäkning för milestones och tasks. PRD: FR-MILE-004, FR-MILE-005, FR-VTL-018, FR-VTL-019.
// FEAT-003-B9. Ren funktion, inga sidoeffekter.
//
// OQ-001 (gränsen mellan Kommande och Aktuellt) är INTE beslutad. Gränsvärdet tas därför
// som parameter, och ingen standard används i produktion. Se FEAT-004-B4.

export type MilestoneStatus = 'kommande' | 'aktuellt' | 'forsenad' | 'slutford';

export interface TaskState {
  isDone: boolean;
}

export interface MilestoneInput {
  dueDate: string; // ISO-datum, YYYY-MM-DD
  tasks: TaskState[];
}

/**
 * Beräknar status för en milestone.
 *
 * - Alla tasks klara (och minst en task) ger 'slutford' (FR-MILE-004, FR-VTL-018).
 * - Annars jämförs förfallodatum mot `today`:
 *   - förfallodatum passerat ger 'forsenad' (FR-DASH-002),
 *   - förfallodatum inom `windowDays` ger 'aktuellt',
 *   - förfallodatum längre fram ger 'kommande'.
 *
 * Gränsen `windowDays` är OQ-001 och måste beslutas av användaren.
 * En milestone utan tasks kan aldrig bli 'slutford' av tasks. Den följer datum.
 */
export function beraknaStatus(
  milestone: MilestoneInput,
  today: string,
  windowDays: number,
): MilestoneStatus {
  if (!Number.isInteger(windowDays) || windowDays < 0) {
    throw new Error('windowDays måste vara ett icke-negativt heltal (OQ-001 ej beslutad)');
  }

  const allDone = milestone.tasks.length > 0 && milestone.tasks.every((t) => t.isDone);
  if (allDone) return 'slutford';

  const due = toDayNumber(milestone.dueDate);
  const now = toDayNumber(today);
  const diff = due - now;

  if (diff < 0) return 'forsenad';
  if (diff <= windowDays) return 'aktuellt';
  return 'kommande';
}

/**
 * Återöppnad task ska ge Aktuellt eller Försenad utifrån datum (FR-MILE-005, FR-VTL-019).
 * Funktionen beräknar samma regel som beraknaStatus. Den finns för tydlighet vid återöppning.
 */
export function statusEfterAterOppning(
  milestone: MilestoneInput,
  today: string,
  windowDays: number,
): MilestoneStatus {
  // Efter återöppning finns minst en öppen task. Övriga tasks behålls som de är.
  const tasks = milestone.tasks.length === 0
    ? [{ isDone: false }]
    : milestone.tasks.map((t, i) => (i === 0 ? { isDone: false } : t));
  return beraknaStatus({ ...milestone, tasks }, today, windowDays);
}

/** Antal klara och totalt, för progress (FR-MILE-003). */
export function progress(tasks: TaskState[]): { done: number; total: number; percent: number } {
  const total = tasks.length;
  const done = tasks.filter((t) => t.isDone).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}

function toDayNumber(iso: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(`Ogiltigt datum: ${iso}`);
  }
  const [y, m, d] = iso.split('-').map(Number);
  const ms = Date.UTC(y, m - 1, d);
  if (Number.isNaN(ms)) throw new Error(`Ogiltigt datum: ${iso}`);
  return Math.floor(ms / 86_400_000);
}
