// Arbetskö för dashboarden. PRD: FR-DASH-001 till FR-DASH-008, SK-001, SK-002, SK-013.
// FEAT-004. Ren logik, ingen UI. Körs på data som redan är filtrerad efter behörighet (PP-009).
//
// OQ-001 (gräns Kommande/Aktuellt) är inte beslutad. Statusen tas från statusberäkningen
// i milestones/status.ts, och windowDays måste anges av anroparen.

import { beraknaStatus, type MilestoneStatus, type TaskState } from '../milestones/status';

export type ProfileType = 'anstalld' | 'konsult' | 'lia';
export type QueueKind = 'milestone' | 'dokument';

export interface QueueMilestone {
  kind: 'milestone';
  id: string;
  personId: string;
  personName: string;
  profileType: ProfileType;
  department: string;
  title: string;
  dueDate: string;
  tasks: TaskState[];
}

export interface QueueDocument {
  kind: 'dokument';
  id: string;
  name: string;
  documentType: string;
  /** Person eller profiltyp som dokumentet är kopplat till. Visas som "Person / Profiltyp". */
  linkedTo: string;
  validTo: string | null;
  profileType: ProfileType | null;
  status: 'aktuell' | 'gallring_kravs' | 'giltighet_gar_ut';
}

export type QueueItem = QueueMilestone | QueueDocument;

export interface QueueFilter {
  profileType?: ProfileType;
  status?: MilestoneStatus;
  kind?: QueueKind;
  department?: string;
}

export interface QueueRow {
  item: QueueItem;
  /** Milestone-status. Dokument har ingen milestone-status. */
  status: MilestoneStatus | null;
  sortDate: string;
}

const LAGRE_STATUS: Record<MilestoneStatus, number> = {
  forsenad: 0,
  aktuellt: 1,
  kommande: 2,
  slutford: 3,
};

/**
 * Bygger arbetskön. Milestones som inte är slutförda, sorterade efter status och datum.
 * Filter kombineras (FR-DASH-005). Standardframförhållning är windowDays (FR-DASH-003).
 */
export function byggKo(
  items: QueueItem[],
  today: string,
  windowDays: number,
  filter: QueueFilter = {},
): QueueRow[] {
  const rows: QueueRow[] = [];

  for (const item of items) {
    if (filter.kind && item.kind !== filter.kind) continue;
    if (filter.profileType) {
      const profile = item.profileType;
      if (profile !== filter.profileType) continue;
    }
    if (filter.department && (item.kind !== 'milestone' || item.department !== filter.department)) continue;

    if (item.kind === 'milestone') {
      const status = beraknaStatus({ dueDate: item.dueDate, tasks: item.tasks }, today, windowDays);
      if (status === 'slutford') continue;
      if (filter.status && status !== filter.status) continue;
      rows.push({ item, status, sortDate: item.dueDate });
    } else {
      if (filter.status) continue;
      rows.push({ item, status: null, sortDate: item.validTo ?? '9999-12-31' });
    }
  }

  return rows.sort((a, b) => {
    const sa = a.status ? LAGRE_STATUS[a.status] : 1;
    const sb = b.status ? LAGRE_STATUS[b.status] : 1;
    if (sa !== sb) return sa - sb;
    return a.sortDate.localeCompare(b.sortDate);
  });
}

/** Räknar kort i överkanten: försenade, aktuella, kommande (milestones) och aktiva dokumentärenden. */
export function raknaKort(
  items: QueueItem[],
  today: string,
  windowDays: number,
): { forsenade: number; aktuella: number; kommande: number; dokument: number } {
  const counts = { forsenade: 0, aktuella: 0, kommande: 0, dokument: 0 };
  for (const row of byggKo(items, today, windowDays)) {
    if (row.item.kind === 'dokument') {
      counts.dokument += 1;
      continue;
    }
    if (row.status === 'forsenad') counts.forsenade += 1;
    if (row.status === 'aktuellt') counts.aktuella += 1;
    if (row.status === 'kommande') counts.kommande += 1;
  }
  return counts;
}
