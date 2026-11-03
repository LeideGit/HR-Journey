// Datakälla för personsidan. FEAT-002, FEAT-010. PRD: FR-PERSON-001, FR-PERSON-002, FR-PERSON-005.
// Läser med användarens session. RLS avgör om personen och dess milestones syns.
import type { PersonDetail } from './PersonPage';
import type { ProfileType } from '../dashboard/queue';
import type { TaskRow } from '../dashboard/dataSource';

export interface PersonDbRow {
  id: string;
  name: string;
  email: string;
  profile_type: ProfileType;
  department: string;
  manager_name: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export interface PersonMilestoneDbRow {
  id: string;
  person_id: string;
  title: string;
  due_date: string;
  description: string | null;
}

/**
 * Bygger personsidans detaljer av databasrader. Ren funktion.
 * Returnerar null om personen inte finns, eller RLS inte släpper igenom den.
 */
export function mapPersonDetail(
  person: PersonDbRow | undefined,
  milestones: PersonMilestoneDbRow[],
  tasks: TaskRow[],
): PersonDetail | null {
  if (!person) return null;
  const tasksByMilestone = new Map<string, { isDone: boolean }[]>();
  for (const t of tasks) {
    const list = tasksByMilestone.get(t.milestone_id) ?? [];
    list.push({ isDone: t.is_done });
    tasksByMilestone.set(t.milestone_id, list);
  }
  return {
    id: person.id,
    name: person.name,
    email: person.email,
    profileType: person.profile_type,
    department: person.department,
    manager: person.manager_name ?? '',
    startDate: person.start_date,
    endDate: person.end_date,
    isActive: person.is_active,
    milestones: milestones
      .filter((m) => m.person_id === person.id)
      .map((m) => ({
        id: m.id,
        title: m.title,
        dueDate: m.due_date,
        description: m.description ?? undefined,
        tasks: tasksByMilestone.get(m.id) ?? [],
      })),
  };
}

type QueryResult = { data: unknown; error: { message: string } | null };
type Query = PromiseLike<QueryResult> & { maybeSingle: () => PromiseLike<QueryResult> };

/** Minimal form av Supabase-klienten som datakällan använder. Gör det testbart utan nätverk. */
export interface PersonClient {
  from: (table: string) => {
    select: (cols: string) => Query & { eq: (col: string, value: string) => Query };
  };
}

/** Hämtar en person med milestones och uppgifter. Kräver inloggad session. */
export async function fetchPerson(
  client: PersonClient,
  personId: string,
): Promise<{ person: PersonDetail | null; error: string | null }> {
  const [p, m, t] = await Promise.all([
    client.from('persons').select('id,name,email,profile_type,department,manager_name,start_date,end_date,is_active').eq('id', personId).maybeSingle() as Query,
    client.from('person_milestones').select('id,person_id,title,due_date').eq('person_id', personId) as Query,
    client.from('milestone_tasks').select('milestone_id,is_done') as Query,
  ]);
  const error = p.error?.message ?? m.error?.message ?? t.error?.message ?? null;
  if (error) return { person: null, error };
  const milestoneIds = new Set(((m.data ?? []) as PersonMilestoneDbRow[]).map((x) => x.id));
  const tasks = ((t.data ?? []) as Array<{ milestone_id: string; is_done: boolean }>).filter((x) => milestoneIds.has(x.milestone_id));
  return {
    person: mapPersonDetail(p.data as PersonDbRow | undefined, (m.data ?? []) as PersonMilestoneDbRow[], tasks),
    error: null,
  };
}

/**
 * Hämtar alla personer för sökning i topnav. RLS avgör vilka som kommer tillbaka,
 * så sökningen kan aldrig visa en person användaren inte får läsa.
 */
export async function fetchPeople(
  client: PersonClient,
): Promise<{ people: { id: string; name: string; email: string; department: string; manager: string | null }[]; error: string | null }> {
  const res = await (client.from('persons').select('id,name,email,department,manager_name') as unknown as Promise<{ data: unknown; error: { message: string } | null }>);
  if (res.error) return { people: [], error: res.error.message };
  const rows = (res.data ?? []) as Array<{ id: string; name: string; email: string; department: string; manager_name: string | null }>;
  return {
    people: rows.map((r) => ({ id: r.id, name: r.name, email: r.email, department: r.department, manager: r.manager_name })),
    error: null,
  };
}
