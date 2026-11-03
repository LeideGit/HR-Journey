import { describe, expect, it } from 'vitest';
import { fetchPerson, mapPersonDetail, type PersonClient, type PersonDbRow, type PersonMilestoneDbRow } from './personData';

// FEAT-002 (personsida), FEAT-010 (RLS). Alla personer är fiktiva.

const anna: PersonDbRow = {
  id: '10000000-0000-0000-0000-000000000001', name: 'Fiktiv Anna Exempel', email: 'anna.exempel@example.test',
  profile_type: 'anstalld', department: 'Fiktiv HR-avdelning', manager_name: null,
  start_date: '2026-02-01', end_date: null, is_active: true,
};
const ms: PersonMilestoneDbRow[] = [
  { id: 'm1', person_id: anna.id, title: 'Uppföljning', due_date: '2026-10-22', description: null },
  { id: 'm2', person_id: 'annan-person', title: 'Hör till någon annan', due_date: '2026-10-23', description: null },
];

type Result = { data: unknown; error: { message: string } | null };

/** Ett frågesvar som både kan awaitas och har maybeSingle, som Supabase-klienten. */
function reply(result: Result): Promise<Result> & { maybeSingle: () => Promise<Result> } {
  const p = Promise.resolve(result) as Promise<Result> & { maybeSingle: () => Promise<Result> };
  p.maybeSingle = () => Promise.resolve(result);
  return p;
}

describe('mapPersonDetail', () => {
  it('mappar kolumnerna till personsidans form, med tom chef om den saknas', () => {
    const d = mapPersonDetail(anna, ms, []);
    expect(d).toMatchObject({ id: anna.id, name: anna.name, manager: '', endDate: null, isActive: true });
  });

  it('bara milestones för den personen tas med', () => {
    const d = mapPersonDetail(anna, ms, []);
    expect(d?.milestones.map((m) => m.id)).toEqual(['m1']);
  });

  it('uppgifter kopplas till rätt milestone', () => {
    const d = mapPersonDetail(anna, ms, [{ milestone_id: 'm1', is_done: true }]);
    expect(d?.milestones[0].tasks).toEqual([{ isDone: true }]);
  });

  it('returnerar null när personen saknas (RLS eller fel id)', () => {
    expect(mapPersonDetail(undefined, ms, [])).toBeNull();
  });
});

describe('fetchPerson', () => {
  it('hämtar med databasens id, så att klicket från arbetskön hittar personen (regression)', async () => {
    const seen: string[] = [];
    const client: PersonClient = {
      from: (table) => ({
        select: () => Object.assign(reply({ data: ms, error: null }), {
          eq: (_col: string, value: string) => {
            seen.push(`${table}:${value}`);
            if (table === 'persons') return reply({ data: anna, error: null });
            return reply({ data: ms, error: null });
          },
        }),
      }),
    };
    const res = await fetchPerson(client, anna.id);
    expect(res.error).toBeNull();
    expect(res.person?.id).toBe(anna.id);
    expect(seen).toContain(`persons:${anna.id}`);
  });

  it('visar fel från databasen i stället för att låtsas att personen saknas', async () => {
    const client: PersonClient = {
      from: () => ({
        select: () => Object.assign(reply({ data: null, error: { message: 'permission denied' } }), {
          eq: () => reply({ data: null, error: { message: 'permission denied' } }),
        }),
      }),
    };
    const res = await fetchPerson(client, anna.id);
    expect(res.error).toBe('permission denied');
    expect(res.person).toBeNull();
  });
});

describe('beskrivning på milestones (regression)', () => {
  it('fetchPerson frågar efter description, så att infomodulen kan visa den', async () => {
    const selected: string[] = [];
    const client: PersonClient = {
      from: (table) => ({
        select: (cols: string) => {
          if (table === 'person_milestones') selected.push(cols);
          return Object.assign(reply({ data: table === 'persons' ? anna : ms, error: null }), {
            eq: () => reply({ data: table === 'persons' ? anna : ms, error: null }),
          });
        },
      }),
    };
    await fetchPerson(client, anna.id);
    expect(selected.some((c) => c.includes('description'))).toBe(true);
  });

  it('en milestone med beskrivning får den med i personsidans data', () => {
    const d = mapPersonDetail(anna, [{ ...ms[0], description: 'Kort text.' }], []);
    expect(d?.milestones[0].description).toBe('Kort text.');
  });
});
