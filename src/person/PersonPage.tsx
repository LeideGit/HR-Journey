import { useMemo, useState } from 'react';
import { Timeline, type TimelineMilestone } from '../timeline/Timeline';
import { MilestoneInfo } from './MilestoneInfo';
import { beraknaStatus, type MilestoneStatus } from '../milestones/status';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusOf = useMemo(
    () => (m: TimelineMilestone): MilestoneStatus =>
      beraknaStatus({ dueDate: m.dueDate, tasks: m.tasks }, FIXTURE_TODAY, FIXTURE_WINDOW_DAYS),
    [],
  );

  // Öppna milestones sorterade på datum. Används för snabbfakta i headern.
  const open = person.milestones
    .filter((m) => statusOf(m) !== 'slutford')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const finished = person.milestones.filter((m) => statusOf(m) === 'slutford');
  const done = finished.length;

  // Ingen händelse är vald vid start. Infomodulen visas först när användaren klickar en händelse.
  const selected = person.milestones.find((m) => m.id === selectedId) ?? null;
  const selectedStatus = selected ? statusOf(selected) : null;

  return (
    <main className="person">
      <p role="status" className="person-env">Fiktiv testmiljö. Endast fiktiva personer och dokument.</p>
      <button type="button" className="person-back" onClick={onBack}>← Tillbaka till arbetskön</button>

      <header className="person-head">
        <div className="person-id">
          <div className="person-avatar" aria-hidden="true">{initials(person.name)}</div>
          <div className="person-name">
            <h1>{person.name}</h1>
            <p className="person-role">
              {PROFILE_LABEL[person.profileType]}
              <span className={`person-active ${person.isActive ? 'on' : 'off'}`}>
                {person.isActive ? 'Aktiv' : 'Arkiverad'}
              </span>
            </p>
          </div>
        </div>
        <dl className="person-facts">
          <div><dt>Avdelning</dt><dd>{person.department}</dd></div>
          <div><dt>Chef</dt><dd>{person.manager}</dd></div>
          <div><dt>Startdatum</dt><dd>{fmt(person.startDate)}</dd></div>
          <div><dt>Slutdatum</dt><dd>{person.endDate ? fmt(person.endDate) : 'Tillsvidare'}</dd></div>
          <div><dt>E-post</dt><dd>{person.email}</dd></div>
          <div><dt>Slutförda</dt><dd>{done} av {person.milestones.length}</dd></div>
          <div><dt>Öppna</dt><dd>{open.length}</dd></div>
        </dl>
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
            selectedId={selected?.id ?? null}
            onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
          />

          {selected && selectedStatus && (
            <MilestoneInfo milestone={selected} status={selectedStatus} />
          )}
        </div>
      )}

      {tab !== 'Tidslinje' && (
        <p className="person-empty">{tab} visas i en senare version. Se progress.md.</p>
      )}
    </main>
  );
}


function initials(name: string): string {
  return name.replace(/^Fiktiv\s+/, '').split(' ').map((w) => w[0]).slice(0, 2).join('');
}
