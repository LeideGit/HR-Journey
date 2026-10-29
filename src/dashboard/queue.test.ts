import { describe, expect, it } from 'vitest';
import { byggKo, raknaKort, type QueueItem } from './queue';

// FEAT-004: FR-DASH-002, FR-DASH-004, FR-DASH-005, FR-DASH-006, FR-DASH-007, SK-002, TEST-001.
// Alla personer är fiktiva.

const TODAY = '2026-10-29';
const WINDOW = 28;

const items: QueueItem[] = [
  {
    kind: 'milestone', id: 'm1', personId: 'p1', personName: 'Fiktiv Anna Exempel', profileType: 'anstalld',
    department: 'Fiktiv HR-avdelning', title: 'Försenad uppföljning', dueDate: '2026-10-20', tasks: [{ isDone: false }],
  },
  {
    kind: 'milestone', id: 'm2', personId: 'p2', personName: 'Fiktiv Bo Testsson', profileType: 'konsult',
    department: 'Fiktiv IT', title: 'Aktuell milestone', dueDate: '2026-11-10', tasks: [{ isDone: false }],
  },
  {
    kind: 'milestone', id: 'm3', personId: 'p3', personName: 'Fiktiv Cia Demo', profileType: 'lia',
    department: 'Fiktiv Försäljning', title: 'Kommande milestone', dueDate: '2027-02-01', tasks: [{ isDone: false }],
  },
  {
    kind: 'milestone', id: 'm4', personId: 'p1', personName: 'Fiktiv Anna Exempel', profileType: 'anstalld',
    department: 'Fiktiv HR-avdelning', title: 'Klar milestone', dueDate: '2026-10-01', tasks: [{ isDone: true }],
  },
  {
    kind: 'dokument', id: 'd1', name: 'Fiktiv introduktionsplan', documentType: 'plan',
    linkedTo: 'Fiktiv Anna Exempel', validTo: '2026-12-31', profileType: 'anstalld', status: 'giltighet_gar_ut',
  },
];

describe('byggKo', () => {
  it('visar inte slutförda milestones (FR-DASH-001)', () => {
    const rows = byggKo(items, TODAY, WINDOW);
    expect(rows.find((r) => r.item.id === 'm4')).toBeUndefined();
  });

  it('sorterar försenade före aktuella före kommande (FR-DASH-002)', () => {
    const milestones = byggKo(items, TODAY, WINDOW).filter((r) => r.item.kind === 'milestone');
    expect(milestones.map((r) => r.status)).toEqual(['forsenad', 'aktuellt', 'kommande']);
  });

  it('filtrerar på profiltyp (FR-DASH-004, SK-002)', () => {
    const rows = byggKo(items, TODAY, WINDOW, { profileType: 'konsult' });
    expect(rows.map((r) => r.item.id)).toEqual(['m2']);
  });

  it('filtrerar på status (FR-DASH-004)', () => {
    const rows = byggKo(items, TODAY, WINDOW, { status: 'forsenad' });
    expect(rows.map((r) => r.item.id)).toEqual(['m1']);
  });

  it('kombinerar filter (FR-DASH-005)', () => {
    const rows = byggKo(items, TODAY, WINDOW, { profileType: 'anstalld', status: 'forsenad' });
    expect(rows.map((r) => r.item.id)).toEqual(['m1']);
    const none = byggKo(items, TODAY, WINDOW, { profileType: 'lia', status: 'forsenad' });
    expect(none).toEqual([]);
  });

  it('visar dokumentärenden i samma kö (FR-DASH-006)', () => {
    const rows = byggKo(items, TODAY, WINDOW);
    expect(rows.some((r) => r.item.kind === 'dokument' && r.item.id === 'd1')).toBe(true);
  });

  it('kan filtrera bort dokument och visa bara milestones (FR-DASH-007)', () => {
    const rows = byggKo(items, TODAY, WINDOW, { kind: 'milestone' });
    expect(rows.every((r) => r.item.kind === 'milestone')).toBe(true);
  });

  it('dokument har ingen milestone-status', () => {
    const doc = byggKo(items, TODAY, WINDOW, { kind: 'dokument' });
    expect(doc[0].status).toBeNull();
  });

  it('statusfilter utesluter dokumentärenden', () => {
    const rows = byggKo(items, TODAY, WINDOW, { status: 'aktuellt' });
    expect(rows.some((r) => r.item.kind === 'dokument')).toBe(false);
  });

  it('avdelningsfilter utesluter dokumentärenden', () => {
    const rows = byggKo(items, TODAY, WINDOW, { department: 'Fiktiv IT' });
    expect(rows.map((r) => r.item.id)).toEqual(['m2']);
  });
});

describe('raknaKort', () => {
  it('räknar försenade, aktuella, kommande och dokument (FR-DASH-002)', () => {
    expect(raknaKort(items, TODAY, WINDOW)).toEqual({ forsenade: 1, aktuella: 1, kommande: 1, dokument: 1 });
  });

  it('en tom kö ger nollor', () => {
    expect(raknaKort([], TODAY, WINDOW)).toEqual({ forsenade: 0, aktuella: 0, kommande: 0, dokument: 0 });
  });
});
