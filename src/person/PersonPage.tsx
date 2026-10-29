import { useMemo, useState } from 'react';
import { Timeline, type TimelineMilestone } from '../timeline/Timeline';
import { beraknaStatus, progress, type MilestoneStatus } from '../milestones/status';
import { FIXTURE_TODAY, FIXTURE_WINDOW_DAYS } from '../dashboard/fixtures';
import type { ProfileType } from '../dashboard/queue';
import './person.css';

// Personsida med tidslinje. FEAT-002-B1, B2, B4, B11. PRD: FR-PERSON-001 till FR-PERSON-005.
// Fiktiv data. Ersätts av Supabase-läsning när personen hämtas från databasen.

export interface PersonDetail {
  id: string;
  name: string;
  email: string;
  profileType: ProfileType;
  department: string;
  manager: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  milestones: TimelineMilestone[];
}

const PROFILE_LABEL: Record<ProfileType, string> = { anstalld: 'Anställd', konsult: 'Konsult', lia: 'LIA' };
const TABS = ['Översikt', 'Tidslinje', 'Dokument', 'Historik'] as const;
type Tab = (typeof TABS)[number];

const DATE = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
function fmt(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return DATE.format(new Date(Date.UTC(y, m - 1, d)));
}

interface Props {
  person: PersonDetail;
  onBack: () => void;
}

export function PersonPage({ person, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('Tidslinje');

  const statusOf = useMemo(
    () => (m: TimelineMilestone): MilestoneStatus =>
      beraknaStatus({ dueDate: m.dueDate, tasks: m.tasks }, FIXTURE_TODAY, FIXTURE_WINDOW_DAYS),
    [],
  );

  // Aktuell milestone: första icke-slutförda, sorterad på datum, som är aktuell eller försenad.
  const open = person.milestones
    .filter((m) => statusOf(m) !== 'slutford')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const current = open.find((m) => statusOf(m) === 'aktuellt' || statusOf(m) === 'forsenad') ?? null;
  const next = open.find((m) => m !== current) ?? null;
  const finished = person.milestones.filter((m) => statusOf(m) === 'slutford');
  const done = finished.length;

  return (
    <main className="person">
      <p role="status" className="person-env">Fiktiv testmiljö. Endast fiktiva personer och dokument.</p>
      <button type="button" className="person-back" onClick={onBack}>← Tillbaka till arbetskön</button>

      <header className="person-head">
        <div className="person-avatar" aria-hidden="true">{initials(person.name)}</div>
        <div className="person-id">
          <h1>{person.name}</h1>
          <p className="person-role">
            {PROFILE_LABEL[person.profileType]}
            <span className={`person-active ${person.isActive ? 'on' : 'off'}`}>
              {person.isActive ? 'Aktiv' : 'Arkiverad'}
            </span>
          </p>
          <dl className="person-facts">
            <div><dt>Avdelning</dt><dd>{person.department}</dd></div>
            <div><dt>Chef</dt><dd>{person.manager}</dd></div>
            <div><dt>Startdatum</dt><dd>{fmt(person.startDate)}</dd></div>
            <div><dt>Slutdatum</dt><dd>{person.endDate ? fmt(person.endDate) : 'Tillsvidare'}</dd></div>
            <div><dt>E-post</dt><dd>{person.email}</dd></div>
          </dl>
        </div>
      </header>

      <nav className="person-tabs" aria-label="Personvyer">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'tab on' : 'tab'}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === 'Tidslinje' && (
        <div className="person-body">
          <Timeline
            todayIso={FIXTURE_TODAY}
            milestones={person.milestones}
            windowDaysForStatus={FIXTURE_WINDOW_DAYS}
          />

          <div className="person-cards">
            <section className="person-card" aria-labelledby="cur-h">
              <h2 id="cur-h">Aktuell milestone</h2>
              {current ? (
                <>
                  <p className="person-card-title">{current.title}</p>
                  <p className="person-card-date">{fmt(current.dueDate)}</p>
                  <ProgressBar tasks={current.tasks} />
                </>
              ) : (
                <p className="person-empty">Ingen aktuell milestone.</p>
              )}
            </section>

            <section className="person-card" aria-labelledby="next-h">
              <h2 id="next-h">Nästa milestone</h2>
              {next ? (
                <>
                  <p className="person-card-title">{next.title}</p>
                  <p className="person-card-date">{fmt(next.dueDate)}</p>
                </>
              ) : (
                <p className="person-empty">Ingen kommande milestone.</p>
              )}
            </section>

            <section className="person-card" aria-labelledby="facts-h">
              <h2 id="facts-h">Snabbfakta</h2>
              <p>Slutförda milestones: {done} av {person.milestones.length}</p>
              <p>Öppna milestones: {open.length}</p>
            </section>
          </div>
        </div>
      )}

      {tab !== 'Tidslinje' && (
        <p className="person-empty">{tab} visas i en senare version. Se progress.md.</p>
      )}
    </main>
  );
}

function ProgressBar({ tasks }: { tasks: TimelineMilestone['tasks'] }) {
  const p = progress(tasks);
  return (
    <div className="person-progress">
      <div
        className="person-progress-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={p.percent}
        aria-label={`${p.done} av ${p.total} uppgifter klara`}
      >
        <span style={{ width: `${p.percent}%` }} />
      </div>
      <span className="person-progress-label">{p.done} av {p.total} uppgifter klara</span>
    </div>
  );
}

function initials(name: string): string {
  return name.replace(/^Fiktiv\s+/, '').split(' ').map((w) => w[0]).slice(0, 2).join('');
}
