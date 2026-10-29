// Fiktiv testdata för dashboarden. Alla personer, avdelningar och dokument är påhittade.
// Ersätts av Supabase-läsning när FEAT-001 och FEAT-010 är kopplade till appen.
import type { ProfileType, QueueItem } from './queue';

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

// Detaljposter för personsidan. Fiktiva personer, samma id som i fixtureItems.
export interface FixturePersonDetail {
  id: string;
  name: string;
  email: string;
  profileType: ProfileType;
  department: string;
  manager: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  milestones: { id: string; title: string; dueDate: string; tasks: { isDone: boolean }[] }[];
}

export const fixturePersons: FixturePersonDetail[] = [
  {
    id: 'fp1', name: 'Fiktiv Anna Exempel', email: 'anna.exempel@example.test', profileType: 'anstalld',
    department: 'Fiktiv HR', manager: 'Fiktiv Chef A', startDate: '2025-02-01', endDate: null, isActive: true,
    milestones: [
      { id: 'fm1', title: 'Uppföljning', dueDate: '2026-10-22', tasks: [{ isDone: false }, { isDone: true }] },
      { id: 'fm1b', title: 'Introduktion', dueDate: '2025-06-01', tasks: [{ isDone: true }] },
      { id: 'fm1c', title: 'Kompetenssamtal', dueDate: '2027-04-10', tasks: [{ isDone: false }] },
    ],
  },
  {
    id: 'fp2', name: 'Fiktiv Bo Testsson', email: 'bo.testsson@example.test', profileType: 'konsult',
    department: 'Fiktiv IT', manager: 'Fiktiv Chef B', startDate: '2026-03-15', endDate: '2027-03-14', isActive: true,
    milestones: [
      { id: 'fm2', title: 'Utvärdering', dueDate: '2026-10-25', tasks: [{ isDone: false }] },
      { id: 'fm2b', title: 'Onboarding', dueDate: '2026-03-20', tasks: [{ isDone: true }] },
    ],
  },
  {
    id: 'fp3', name: 'Fiktiv Cia Demo', email: 'cia.demo@example.test', profileType: 'lia',
    department: 'Fiktiv Försäljning', manager: 'Fiktiv Chef C', startDate: '2026-09-01', endDate: '2027-06-30', isActive: true,
    milestones: [
      { id: 'fm3', title: 'Planera introduktion', dueDate: '2026-11-05', tasks: [{ isDone: false }] },
    ],
  },
];
