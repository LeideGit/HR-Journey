// Fiktiv testdata för dashboarden. Alla personer, avdelningar och dokument är påhittade.
// Ersätts av Supabase-läsning när FEAT-001 och FEAT-010 är kopplade till appen.
import type { QueueItem } from './queue';

export const FIXTURE_TODAY = '2026-10-29';
export const FIXTURE_WINDOW_DAYS = 28;

export const fixtureItems: QueueItem[] = [
  { kind: 'milestone', id: 'fm1', personId: 'fp1', personName: 'Fiktiv Anna Exempel', profileType: 'anstalld', department: 'Fiktiv HR', title: 'Uppföljning', dueDate: '2026-10-22', tasks: [{ isDone: false }, { isDone: true }] },
  { kind: 'milestone', id: 'fm2', personId: 'fp2', personName: 'Fiktiv Bo Testsson', profileType: 'konsult', department: 'Fiktiv IT', title: 'Utvärdering', dueDate: '2026-10-25', tasks: [{ isDone: false }] },
  { kind: 'milestone', id: 'fm3', personId: 'fp3', personName: 'Fiktiv Cia Demo', profileType: 'lia', department: 'Fiktiv Försäljning', title: 'Planera introduktion', dueDate: '2026-11-05', tasks: [{ isDone: false }] },
  { kind: 'milestone', id: 'fm4', personId: 'fp4', personName: 'Fiktiv Dan Prov', profileType: 'anstalld', department: 'Fiktiv Marknad', title: 'Kompetenssamtal', dueDate: '2026-12-10', tasks: [{ isDone: false }, { isDone: false }] },
  { kind: 'milestone', id: 'fm5', personId: 'fp5', personName: 'Fiktiv Eva Mall', profileType: 'konsult', department: 'Fiktiv Konsultteam', title: 'Avslut hos kund', dueDate: '2027-01-15', tasks: [{ isDone: false }] },
  { kind: 'dokument', id: 'fd1', name: 'Fiktiv konsultpolicy 2026', documentType: 'Policy', linkedTo: 'Konsult (generellt)', validTo: '2026-10-20', profileType: 'konsult', status: 'giltighet_gar_ut' },
  { kind: 'dokument', id: 'fd2', name: 'Fiktivt anställningsavtal', documentType: 'Avtal', linkedTo: 'Fiktiv Anna Exempel', validTo: null, profileType: 'anstalld', status: 'aktuell' },
  { kind: 'dokument', id: 'fd3', name: 'Fiktiv informationssäkerhetspolicy', documentType: 'Policy', linkedTo: 'Alla (generellt)', validTo: '2026-11-10', profileType: null, status: 'giltighet_gar_ut' },
];
