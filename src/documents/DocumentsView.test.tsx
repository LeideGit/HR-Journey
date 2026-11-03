import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DocumentsView } from './DocumentsView';
import type { DocumentRecord } from './documentData';

// FEAT-006 (wireframe 03): sök, filter, tabell, detaljpanel, giltighet. Alla dokument är fiktiva.

afterEach(() => cleanup());

const docs: DocumentRecord[] = [
  { id: 'd1', name: 'Fiktiv introduktionsplan', type: 'plan', links: [], securityClass: 'standard', versionNo: 2, mimeType: 'application/pdf', validFrom: '2026-03-01', validTo: '2027-03-01', isArchived: false, status: 'giltig' },
  { id: 'd2', name: 'Fiktivt konsultuppdragsavtal', type: 'avtal', links: [{ personId: 'p2', personName: 'Fiktiv Bo Testsson' }], securityClass: 'standard', versionNo: 1, mimeType: 'application/pdf', validFrom: '2024-01-01', validTo: '2026-11-10', isArchived: false, status: 'gar_snart_ut' },
  { id: 'd3', name: 'Fiktivt lönebesked', type: 'lon', links: [{ personId: 'p1', personName: 'Fiktiv Anna Exempel' }], securityClass: 'skyddad', versionNo: 1, mimeType: 'application/pdf', validFrom: '2026-01-01', validTo: '2026-12-31', isArchived: false, status: 'giltig' },
];

describe('DocumentsView', () => {
  it('visar rubrik och en rad för varje dokument', () => {
    render(<DocumentsView docs={docs} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dokument' })).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(4);
  });

  it('visar giltighetsstatus med tydlig etikett', () => {
    render(<DocumentsView docs={docs} />);
    expect(screen.getAllByText('Går snart ut').length).toBeGreaterThan(0);
    // Tre dokument i fixturen: två giltiga och ett som går snart ut.
    // Statusetiketter i tabellen. Filterlistans alternativ räknas inte.
    const table = screen.getByRole('table');
    expect(within(table).getAllByText('Giltigt')).toHaveLength(2);
  });

  it('säkerhetsklass visas med svensk etikett', () => {
    render(<DocumentsView docs={docs} />);
    expect(screen.getByText('Särskilt skyddat')).toBeInTheDocument();
    expect(screen.getAllByText('Internt')).toHaveLength(2);
  });

  it('sökning på namn filtrerar listan', () => {
    render(<DocumentsView docs={docs} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'konsult' } });
    expect(screen.queryByText('Fiktiv introduktionsplan')).not.toBeInTheDocument();
    expect(screen.getByText('Fiktivt konsultuppdragsavtal')).toBeInTheDocument();
  });

  it('statusfilter filtrerar listan', () => {
    render(<DocumentsView docs={docs} />);
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'gar_snart_ut' } });
    expect(screen.queryByText('Fiktiv introduktionsplan')).not.toBeInTheDocument();
    expect(screen.getByText('Fiktivt konsultuppdragsavtal')).toBeInTheDocument();
  });

  it('ingen träff ger tydligt besked', () => {
    render(<DocumentsView docs={docs} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'finns inte' } });
    expect(screen.getByText('Inga dokument matchar sökningen.')).toBeInTheDocument();
  });

  it('klick på dokument visar detaljpanelen med version och giltighet', () => {
    render(<DocumentsView docs={docs} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fiktiv introduktionsplan' }));
    const panel = screen.getByRole('complementary', { name: 'Dokumentdetaljer' });
    expect(within(panel).getByText(/version 2/)).toBeInTheDocument();
    expect(within(panel).getByText('Endast för behöriga HR-användare.')).toBeInTheDocument();
  });

  it('utan vald rad visas en neutral uppmaning i detaljpanelen', () => {
    render(<DocumentsView docs={docs} />);
    expect(screen.getByText('Välj ett dokument för att se detaljer.')).toBeInTheDocument();
  });

  it('personen visas som tagg i kolumnen Kopplat till, inte i dokumentets namn (wireframe 03)', () => {
    render(<DocumentsView docs={docs} />);
    // Två rader har taggar, så sökningen görs i tabellen.
    const table = screen.getByRole('table');
    expect(within(table).getByText('Fiktiv Bo Testsson')).toBeInTheDocument();
    expect(screen.getByText('Fiktivt konsultuppdragsavtal')).toBeInTheDocument();
  });

  it('dokument utan giltighet visas som Tills vidare', () => {
    render(<DocumentsView docs={[{ ...docs[0], validTo: null }]} />);
    expect(screen.getByText('Tills vidare')).toBeInTheDocument();
  });
});
