import { describe, expect, it } from 'vitest';
import { countByStatus, documentStatus, mapDocuments, type DocumentDbRow } from './documentData';

// FEAT-006: FR-DVAL-001, FR-DVAL-002 (fyra veckor), FR-DVAL-003 (passerad raderar inte), FR-DRET-001.
// Alla dokument är fiktiva.

const TODAY = '2026-10-29';

const base = { retention_status: 'ej_aktuell' as const, is_archived: false };

describe('documentStatus', () => {
  it('giltighet mer än fyra veckor bort är giltig (FR-DVAL-002)', () => {
    expect(documentStatus({ ...base, validTo: '2027-03-01' }, TODAY)).toBe('giltig');
  });

  it('giltighet inom fyra veckor ger gar_snart_ut (påminnelse, FR-DVAL-002)', () => {
    // 2026-10-29 + 28 dagar = 2026-11-26
    expect(documentStatus({ ...base, validTo: '2026-11-26' }, TODAY)).toBe('gar_snart_ut');
    expect(documentStatus({ ...base, validTo: '2026-11-27' }, TODAY)).toBe('giltig');
  });

  it('passerad giltighet ger utgangen, men dokumentet raderas inte (FR-DVAL-003)', () => {
    expect(documentStatus({ ...base, validTo: '2026-10-01' }, TODAY)).toBe('utgangen');
  });

  it('dokument utan giltighet är giltigt tills vidare', () => {
    expect(documentStatus({ ...base, validTo: null }, TODAY)).toBe('giltig');
  });

  it('gallringsregel som utlöst ger gallring_kravs, även när giltigheten är giltig (FR-DRET-001)', () => {
    expect(documentStatus({ retention_status: 'gallring_kravs', is_archived: false, validTo: '2027-03-01' }, TODAY)).toBe('gallring_kravs');
  });

  it('arkiverat dokument är arkiverat oavsett giltighet (FR-DARCH-001)', () => {
    expect(documentStatus({ retention_status: 'arkiverad', is_archived: true, validTo: '2026-01-01' }, TODAY)).toBe('arkiverad');
  });
});

describe('mapDocuments', () => {
  const rows: DocumentDbRow[] = [
    {
      id: 'd1', name: 'Fiktiv introduktionsplan', document_type: 'plan', security_class: 'standard',
      retention_status: 'ej_aktuell', is_archived: false,
      current_version: { version_no: 2, valid_from: '2026-03-01', valid_to: '2027-03-01', mime_type: 'application/pdf' },
    },
  ];

  it('giltigheten kommer från den aktuella versionen (ADR-003)', () => {
    const [doc] = mapDocuments(rows, TODAY);
    expect(doc).toMatchObject({ versionNo: 2, validFrom: '2026-03-01', validTo: '2027-03-01', status: 'giltig' });
  });

  it('dokument utan aktuell version blir utan versionsuppgifter', () => {
    const [doc] = mapDocuments([{ ...rows[0], current_version: null }], TODAY);
    expect(doc).toMatchObject({ versionNo: null, mimeType: null, validTo: null });
  });

  it('räknar dokument per status för kortraden', () => {
    const docs = mapDocuments([
      ...rows,
      { ...rows[0], id: 'd2', retention_status: 'gallring_kravs', current_version: null },
    ], TODAY);
    expect(countByStatus(docs)).toMatchObject({ giltig: 1, gallring_kravs: 1, arkiverad: 0 });
  });
});
