import { useMemo, useState } from 'react';
import { countByStatus, type DocumentRecord, type DocumentStatus } from './documentData';
import '../dashboard/dashboard.css';
import './documents.css';

// Dokumentvyn enligt wireframe 03: kortrad, sök och filter, tabell och detaljpanel.
// FEAT-006. Sökning är metadata, aldrig filinnehåll (FR-DSRCH-003). Versionen är aktuell som standard.

const STATUS_LABEL: Record<DocumentStatus, string> = {
  giltig: 'Giltigt',
  gar_snart_ut: 'Går snart ut',
  utgangen: 'Utgånget',
  gallring_kravs: 'Gallring krävs',
  arkiverad: 'Arkiverad',
};

const SECURITY_LABEL: Record<DocumentRecord['securityClass'], string> = {
  standard: 'Internt',
  skyddad: 'Särskilt skyddat',
};

const DATE = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function fmt(iso: string | null): string {
  if (!iso) return 'Tills vidare';
  const [y, m, d] = iso.split('-').map(Number);
  return DATE.format(new Date(Date.UTC(y, m - 1, d)));
}

interface Props {
  docs: DocumentRecord[];
}

export function DocumentsView({ docs }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<DocumentStatus | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => countByStatus(docs), [docs]);
  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('sv-SE');
    return docs.filter((d) => {
      if (status && d.status !== status) return false;
      if (q.length < 2) return true;
      return d.name.toLocaleLowerCase('sv-SE').includes(q) || d.type.toLocaleLowerCase('sv-SE').includes(q);
    });
  }, [docs, query, status]);

  const selected = docs.find((d) => d.id === selectedId) ?? null;

  return (
    <section className="docs" aria-labelledby="docs-heading">
      <header className="docs-head">
        <h1 id="docs-heading" className="docs-title">Dokument</h1>
        <p className="docs-lede">Hantera HR-relaterade dokument. Sök, filtrera och se giltighet.</p>
      </header>

      <div className="docs-kpis" aria-label="Översikt">
        <KpiCard label="Totalt" value={docs.length} detail="dokument" />
        <KpiCard label="Går snart ut" value={counts.gar_snart_ut} detail="inom fyra veckor" tone="amber" />
        <KpiCard label="Gallring krävs" value={counts.gallring_kravs} detail="kräver beslut" tone="rose" />
        <KpiCard label="Arkiverade" value={counts.arkiverad} detail="visas i arkivet" tone="stone" />
      </div>

      <div className="docs-body">
        <div className="docs-list">
          <div className="docs-filters">
            <label className="docs-field docs-field-search">
              <span className="sr-only">Sök dokument</span>
              <input
                type="search"
                placeholder="Sök dokument"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label className="docs-field">
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as DocumentStatus | '')}>
                <option value="">Alla</option>
                {(Object.keys(STATUS_LABEL) as DocumentStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="dash-shell">
            <div className="dash-core docs-core">
              {shown.length === 0 ? (
                <p className="docs-empty">Inga dokument matchar sökningen.</p>
              ) : (
                <table className="dash-table docs-table">
                  <thead>
                    <tr>
                      <th scope="col">Namn</th>
                      <th scope="col">Typ</th>
                      <th scope="col">Gäller till</th>
                      <th scope="col">Status</th>
                      <th scope="col">Säkerhet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((d) => (
                      <tr
                        key={d.id}
                        className={d.id === selectedId ? 'is-selected' : undefined}
                        onClick={() => setSelectedId(d.id)}
                      >
                        <td>
                          <button type="button" className="docs-name" onClick={() => setSelectedId(d.id)}>
                            {d.name}
                          </button>
                        </td>
                        <td>{d.type}</td>
                        <td>{fmt(d.validTo)}</td>
                        <td><span className={`badge docs-status docs-status-${d.status}`}>{STATUS_LABEL[d.status]}</span></td>
                        <td>{SECURITY_LABEL[d.securityClass]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <aside className="docs-detail" aria-label="Dokumentdetaljer">
          {selected ? (
            <div className="dash-shell">
              <div className="dash-core docs-core docs-detail-core">
                <h2 className="docs-detail-title">{selected.name}</h2>
                <p className="docs-detail-meta">{selected.type} · version {selected.versionNo ?? '–'}</p>
                <span className={`badge docs-status docs-status-${selected.status}`}>{STATUS_LABEL[selected.status]}</span>
                <dl className="docs-facts">
                  <div><dt>Säkerhetsklass</dt><dd>{SECURITY_LABEL[selected.securityClass]}</dd></div>
                  <div><dt>Gäller från</dt><dd>{fmt(selected.validFrom)}</dd></div>
                  <div><dt>Gäller till</dt><dd>{fmt(selected.validTo)}</dd></div>
                  <div><dt>Format</dt><dd>{selected.mimeType ?? '–'}</dd></div>
                </dl>
                <p className="docs-note">Endast för behöriga HR-användare.</p>
              </div>
            </div>
          ) : (
            <div className="dash-shell">
              <div className="dash-core docs-core">
                <p className="docs-empty">Välj ett dokument för att se detaljer.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function KpiCard({ label, value, detail, tone }: { label: string; value: number; detail: string; tone?: string }) {
  return (
    <div className={`dash-shell${tone ? ` dash-shell-${tone}` : ''}`}>
      <div className="dash-core">
        <span className="dash-kpi-value">{value}</span>
        <span className="dash-kpi-label">{label}</span>
        <span className="dash-kpi-detail">{detail}</span>
      </div>
    </div>
  );
}
