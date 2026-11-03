import { describe, expect, it } from 'vitest';
import { fetchQueue, mapToQueueItems, type DocumentRow, type MilestoneRow, type PersonRow, type TaskRow } from './dataSource';

// FEAT-004 (datakälla), FEAT-010 (RLS). Alla personer och dokument är fiktiva.

const persons: PersonRow[] = [
  { id: 'p1', name: 'Fiktiv Anna Exempel', profile_type: 'anstalld', department: 'Fiktiv HR' },
];

const milestones: MilestoneRow[] = [
  { id: 'm1', person_id: 'p1', title: 'Uppföljning', due_date: '2026-11-05' },
  // Milestone till en person som RLS inte släppt igenom ska inte visas.
  { id: 'm2', person_id: 'p-saknas', title: 'Ska inte visas', due_date: '2026-11-06' },
];
const tasks: TaskRow[] = [{ milestone_id: 'm1', is_done: false }];

const documents: DocumentRow[] = [
  { id: 'd1', name: 'Fiktiv introduktionsplan', document_type: 'plan', security_class: 'standard', valid_to: '2027-03-01' },
];

describe('mapToQueueItems', () => {
  it('mappar milestones till kö-poster med personkontext', () => {
    const items = mapToQueueItems(persons, milestones, documents, tasks);
    const ms = items.find((i) => i.id === 'm1');
    expect(ms).toMatchObject({ kind: 'milestone', personId: 'p1', personName: 'Fiktiv Anna Exempel', department: 'Fiktiv HR' });
  });

  it('hoppar över milestone vars person saknas, så att kön aldrig visar post utan personkontext', () => {
    const items = mapToQueueItems(persons, milestones, documents, tasks);
    expect(items.find((i) => i.id === 'm2')).toBeUndefined();
  });

  it('task-status når kön: en milestone med alla tasks klara är inte försenad (regression)', () => {
    // Förr hämtades aldrig tasks, så allt som passerat sitt datum blev felaktigt försenat.
    const items = mapToQueueItems(persons, [milestones[0]], [], [{ milestone_id: 'm1', is_done: true }]);
    expect(items[0]).toMatchObject({ kind: 'milestone', tasks: [{ isDone: true }] });
  });

  it('tom task-lista blir tom array, inte null', () => {
    const items = mapToQueueItems(persons, [milestones[0]], [], []);
    expect(items[0]).toMatchObject({ kind: 'milestone', tasks: [] });
  });

  it('dokument får giltighet från den aktuella versionen', () => {
    const items = mapToQueueItems([], [], documents);
    expect(items[0]).toMatchObject({ kind: 'dokument', validTo: '2027-03-01', status: 'giltighet_gar_ut' });
  });

  it('dokument utan giltighet blir aktuella', () => {
    const items = mapToQueueItems([], [], [{ ...documents[0], valid_to: null }]);
    expect(items[0]).toMatchObject({ validTo: null, status: 'aktuell' });
  });
});

describe('fetchQueue', () => {
  it('returnerar det RLS släppt igenom, och visar fel om en fråga misslyckas', async () => {
    const ok = {
      from: (t: string) => ({
        select: async () => {
          if (t === 'persons') return { data: persons, error: null };
          if (t === 'person_milestones') return { data: milestones, error: null };
          return { data: [{ id: 'd1', name: 'x', document_type: 'plan', security_class: 'standard', current_version: { valid_to: null } }], error: null };
        },
      }),
    };
    const res = await fetchQueue(ok);
    expect(res.error).toBeNull();
    expect(res.items.some((i) => i.kind === 'milestone')).toBe(true);

    const failing = {
      from: () => ({ select: async () => ({ data: null, error: { message: 'permission denied' } }) }),
    };
    const err = await fetchQueue(failing);
    expect(err.error).toBe('permission denied');
    expect(err.items).toEqual([]);
  });
});
