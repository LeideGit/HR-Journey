import { useMemo, useState } from 'react';
import { byggKo, raknaKort, type ProfileType, type QueueFilter } from './queue';
import { FIXTURE_TODAY, FIXTURE_WINDOW_DAYS, fixtureItems } from './fixtures';
import type { MilestoneStatus } from '../milestones/status';
import './dashboard.css';

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  forsenad: 'Försenad',
  aktuellt: 'Aktuell',
  kommande: 'Kommande',
  slutford: 'Slutförd',
};

const PROFILE_LABEL: Record<ProfileType, string> = {
  anstalld: 'Anställd',
  konsult: 'Konsult',
  lia: 'LIA',
};

const DATE_FORMAT = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' });

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return DATE_FORMAT.format(new Date(Date.UTC(y, m - 1, d)));
}

export function Dashboard() {
  const [profileType, setProfileType] = useState<ProfileType | ''>('');
  const [status, setStatus] = useState<MilestoneStatus | ''>('');

  const rows = useMemo(() => {
    const filter: QueueFilter = {
      profileType: profileType || undefined,
      status: status || undefined,
    };
    return byggKo(fixtureItems, FIXTURE_TODAY, FIXTURE_WINDOW_DAYS, filter);
  }, [profileType, status]);
  const counts = useMemo(
    () => raknaKort(fixtureItems, FIXTURE_TODAY, FIXTURE_WINDOW_DAYS),
    [],
  );

  const milestones = rows.filter((r) => r.item.kind === 'milestone');
  const documents = rows.filter((r) => r.item.kind === 'dokument');

  return (
    <main className="dash">
      <p role="status" className="dash-env">Fiktiv testmiljö. Endast fiktiva personer och dokument.</p>

      <header className="dash-head">
        <span className="dash-eyebrow">Arbetskö</span>
        <h1 className="dash-title">Välkommen</h1>
        <p className="dash-lede">Det som behöver din uppmärksamhet just nu.</p>
        <time className="dash-date" dateTime={FIXTURE_TODAY}>{formatDate(FIXTURE_TODAY)}</time>
      </header>

      <section className="dash-kpis" aria-label="Översikt">
        <KpiCard tone="rose" value={counts.forsenade} label="Försenade" detail="milestones" />
        <KpiCard tone="amber" value={counts.aktuella} label="Aktuella" detail="milestones" />
        <KpiCard tone="sky" value={counts.kommande} label="Kommande" detail="milestones" />
        <KpiCard tone="stone" value={counts.dokument} label="Dokumentärenden" detail="dokument" />
      </section>

      <section className="dash-filters" aria-label="Filter">
        <label className="dash-field">
          <span>Profiltyp</span>
          <select value={profileType} onChange={(e) => setProfileType(e.target.value as ProfileType | '')}>
            <option value="">Alla profiltyper</option>
            {(Object.keys(PROFILE_LABEL) as ProfileType[]).map((p) => (
              <option key={p} value={p}>{PROFILE_LABEL[p]}</option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as MilestoneStatus | '')}>
            <option value="">Alla statusar</option>
            <option value="forsenad">Försenad</option>
            <option value="aktuellt">Aktuell</option>
            <option value="kommande">Kommande</option>
          </select>
        </label>
        <button
          type="button"
          className="dash-reset"
          onClick={() => { setProfileType(''); setStatus(''); }}
          disabled={!profileType && !status}
        >
          Rensa filter
        </button>
      </section>

      <div className="dash-grid">
        <section className="dash-panel" aria-labelledby="ms-heading">
          <div className="dash-panel-head">
            <h2 id="ms-heading">Milestones som behöver uppmärksamhet</h2>
            <span className="dash-count">{milestones.length}</span>
          </div>
          {milestones.length === 0 ? (
            <p className="dash-empty">Inga milestones matchar filtret.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Datum</th>
                  <th scope="col">Person</th>
                  <th scope="col">Milestone</th>
                  <th scope="col">Profiltyp</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((r) => {
                  if (r.item.kind !== 'milestone' || !r.status) return null;
                  return (
                    <tr key={r.item.id}>
                      <td><span className={`badge badge-${r.status}`}>{STATUS_LABEL[r.status]}</span></td>
                      <td>{formatDate(r.item.dueDate)}</td>
                      <td>{r.item.personName}</td>
                      <td>{r.item.title}</td>
                      <td>{PROFILE_LABEL[r.item.profileType]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section className="dash-panel" aria-labelledby="doc-heading">
          <div className="dash-panel-head">
            <h2 id="doc-heading">Dokument som behöver hanteras</h2>
            <span className="dash-count">{documents.length}</span>
          </div>
          {documents.length === 0 ? (
            <p className="dash-empty">Inga dokumentärenden matchar filtret.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th scope="col">Gäller till</th>
                  <th scope="col">Dokument</th>
                  <th scope="col">Kopplat till</th>
                  <th scope="col">Typ</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((r) => {
                  if (r.item.kind !== 'dokument') return null;
                  return (
                    <tr key={r.item.id}>
                      <td>{r.item.validTo ? formatDate(r.item.validTo) : 'Tills vidare'}</td>
                      <td>{r.item.name}</td>
                      <td>{r.item.linkedTo}</td>
                      <td>{r.item.documentType}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

function KpiCard({ tone, value, label, detail }: { tone: string; value: number; label: string; detail: string }) {
  return (
    <article className={`dash-shell dash-shell-${tone}`}>
      <div className="dash-core">
        <span className="dash-kpi-value">{value}</span>
        <span className="dash-kpi-label">{label}</span>
        <span className="dash-kpi-detail">{detail}</span>
      </div>
    </article>
  );
}
