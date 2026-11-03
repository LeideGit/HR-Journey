// Dokumentvyn: datakälla och mappning. FEAT-006. PRD: FR-DSRCH-001, FR-DVER-004, FR-DVAL-001,
// FR-DVAL-002, FR-DRET-001, FR-DSRCH-005. ADR-003: giltighet ligger på versionen, inte dokumentet.
// RLS avgör vilka dokument som kommer tillbaka. Appen filtrerar aldrig själv på behörighet.

export interface DocumentDbRow {
  id: string;
  name: string;
  document_type: string;
  security_class: 'standard' | 'skyddad';
  retention_status: 'ej_aktuell' | 'gallring_kravs' | 'arkiverad';
  is_archived: boolean;
  current_version: {
    version_no: number;
    valid_from: string | null;
    valid_to: string | null;
    mime_type: string;
  } | null;
}

export type DocumentStatus = 'giltig' | 'gar_snart_ut' | 'utgangen' | 'gallring_kravs' | 'arkiverad';

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  securityClass: 'standard' | 'skyddad';
  versionNo: number | null;
  mimeType: string | null;
  validFrom: string | null;
  validTo: string | null;
  isArchived: boolean;
  status: DocumentStatus;
}

/** Fyra veckor, enligt FR-DVAL-002. */
export const EXPIRY_WARNING_DAYS = 28;

/**
 * Beräknar status från giltighet, gallringsregel och arkivering. Ren funktion.
 * Passerad giltighet ändrar inte dokumentet (FR-DVAL-003). Den visas bara som status.
 */
export function documentStatus(
  row: { retention_status: DocumentDbRow['retention_status']; is_archived: boolean; validTo: string | null },
  today: string,
): DocumentStatus {
  if (row.is_archived) return 'arkiverad';
  if (row.retention_status === 'gallring_kravs') return 'gallring_kravs';
  if (!row.validTo) return 'giltig';
  const diff = dayDiff(today, row.validTo);
  if (diff < 0) return 'utgangen';
  if (diff <= EXPIRY_WARNING_DAYS) return 'gar_snart_ut';
  return 'giltig';
}

export function mapDocuments(rows: DocumentDbRow[], today: string): DocumentRecord[] {
  return rows.map((r) => {
    const validTo = r.current_version?.valid_to ?? null;
    return {
      id: r.id,
      name: r.name,
      type: r.document_type,
      securityClass: r.security_class,
      versionNo: r.current_version?.version_no ?? null,
      mimeType: r.current_version?.mime_type ?? null,
      validFrom: r.current_version?.valid_from ?? null,
      validTo,
      isArchived: r.is_archived,
      status: documentStatus({ retention_status: r.retention_status, is_archived: r.is_archived, validTo }, today),
    };
  });
}

/** Antal dokument per status, för kortraden överst. */
export function countByStatus(docs: DocumentRecord[]): Record<DocumentStatus, number> {
  const out: Record<DocumentStatus, number> = { giltig: 0, gar_snart_ut: 0, utgangen: 0, gallring_kravs: 0, arkiverad: 0 };
  for (const d of docs) out[d.status] += 1;
  return out;
}

export interface DocumentClient {
  from: (table: string) => {
    select: (cols: string) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
  };
}

/** Hämtar dokument med aktuell version. RLS släpper bara igenom det användaren får läsa. */
export async function fetchDocuments(client: DocumentClient, today: string): Promise<{ docs: DocumentRecord[]; error: string | null }> {
  const res = await client.from('documents').select(
    'id,name,document_type,security_class,retention_status,is_archived,current_version:document_versions!documents_current_version_fk(version_no,valid_from,valid_to,mime_type)',
  );
  if (res.error) return { docs: [], error: res.error.message };
  return { docs: mapDocuments((res.data ?? []) as DocumentDbRow[], today), error: null };
}

function dayDiff(from: string, to: string): number {
  const ms = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((ms(to) - ms(from)) / 86_400_000);
}
