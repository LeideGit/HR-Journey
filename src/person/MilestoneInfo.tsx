import { progress, type MilestoneStatus } from '../milestones/status';
import type { TimelineMilestone } from '../timeline/Timeline';

// Infomodul för vald milestone, under tidslinjen. FEAT-002-B8 (detaljvy), FEAT-003-B7, B8.
// PRD: FR-VTL-007, FR-VTL-008. Wireframe 02.
// Åtgärder är inte kopplade till backend än. De visas men är markerade som inaktiva.

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  forsenad: 'Försenad',
  aktuellt: 'Aktuell',
  kommande: 'Kommande',
  slutford: 'Slutförd',
};

const DATE = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function fmt(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return DATE.format(new Date(Date.UTC(y, m - 1, d)));
}

interface Props {
  milestone: TimelineMilestone;
  status: MilestoneStatus;
  /** Visar uppgifter som kan kryssas i. Ändring sparas inte än, se FEAT-003-B16/B17. */
  onTaskToggle?: (taskIndex: number) => void;
}

export function MilestoneInfo({ milestone, status, onTaskToggle }: Props) {
  const p = progress(milestone.tasks);
  const labelId = `mi-${milestone.id}`;

  return (
    <section className={`mi-shell${status === 'slutford' ? ' mi-shell-slutford' : ''}`} aria-labelledby={labelId}>
      <div className="mi-core">
        <header className="mi-head">
          <div className="mi-title-block">
            <span className={`mi-status mi-status-${status}`}>{STATUS_LABEL[status]}</span>
            <h2 id={labelId} className="mi-title">{milestone.title}</h2>
            <p className="mi-date">{fmt(milestone.dueDate)}</p>
          </div>
          <div className="mi-progress" aria-hidden="true">
            <span className="mi-progress-value">{p.percent}%</span>
          </div>
        </header>

        {milestone.description && <p className="mi-desc">{milestone.description}</p>}

        <div className="mi-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.percent} aria-label={`${p.done} av ${p.total} uppgifter klara`}>
          <span style={{ width: `${p.percent}%` }} />
        </div>
        <p className="mi-progress-label">{p.done} av {p.total} uppgifter klara</p>

        <ul className="mi-tasks">
          {milestone.tasks.map((t, i) => (
            <li key={i} className="mi-task">
              <label>
                <input
                  type="checkbox"
                  checked={t.isDone}
                  disabled={!onTaskToggle}
                  onChange={() => onTaskToggle?.(i)}
                />
                <span className={t.isDone ? 'mi-task-text done' : 'mi-task-text'}>Uppgift {i + 1}</span>
              </label>
            </li>
          ))}
        </ul>

        <footer className="mi-actions">
          <button type="button" className="mi-btn mi-btn-primary" disabled>
            Skicka info
          </button>
          <button type="button" className="mi-btn" disabled>
            Redigera milestone
          </button>
          <button type="button" className="mi-btn mi-btn-icon" disabled aria-label="Fler åtgärder">
            …
          </button>
        </footer>
        <p className="mi-note">Åtgärderna är inte kopplade än. Ändringar sparas när FEAT-003 är kopplad till databasen.</p>
      </div>
    </section>
  );
}
