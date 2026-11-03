// Datakälla för arbetskön. FEAT-004, FEAT-010. PRD: PP-009, FR-DASH-001, FR-DASH-006, FR-DSRCH-005.
// Läser från Supabase med användarens egen session. RLS avgör vilka rader som kommer tillbaka,
// så appen filtrerar aldrig själv på behörighet (PP-009).
import type { QueueItem, ProfileType } from './queue';
import type { FixturePersonDetail } from './fixtures';

export interface PersonRow {
  id: string;
  name: string;
  profile_type: ProfileType;
  department: string;
}

export interface MilestoneRow {
  id: string;
  person_id: string;
  title: string;
  due_date: string;
}

export interface DocumentRow {
  id: string;
  name: string;
  document_type: string;
  security_class: string;
  /** Giltighet ligger på den aktuella versionen, inte på dokumentobjektet (ADR-003). */
  valid_to: string | null;
}

/**
 * Bygger kö-poster av databasrader. Ren funktion, inga anrop.
 * En milestone som refererar till en person som RLS inte släppt igenom hoppas över,
 * så att kön aldrig visar en post utan personkontext.
 */
export interface TaskRow {
  milestone_id: string;
  is_done: boolean;
}

export function mapToQueueItems(
  persons: PersonRow[],
  milestones: MilestoneRow[],
  documents: DocumentRow[],
  tasks: TaskRow[] = [],
): QueueItem[] {
  // Tasks grupperas per milestone. Utan detta blir alla milestones utan uppgifter,
  // och statusen blir felaktigt försenad även när allt är klart.
  const tasksByMilestone = new Map<string, { isDone: boolean }[]>();
  for (const t of tasks) {
    const list = tasksByMilestone.get(t.milestone_id) ?? [];
    list.push({ isDone: t.is_done });
    tasksByMilestone.set(t.milestone_id, list);
  }
  const byId = new Map(persons.map((p) => [p.id, p]));
  const items: QueueItem[] = [];

  for (const m of milestones) {
    const p = byId.get(m.person_id);
    if (!p) continue;
    items.push({
      kind: 'milestone',
      id: m.id,
      personId: p.id,
      personName: p.name,
      profileType: p.profile_type,
      department: p.department,
      title: m.title,
      dueDate: m.due_date,
      tasks: tasksByMilestone.get(m.id) ?? [],
    });
  }

  for (const d of documents) {
    items.push({
      kind: 'dokument',
      id: d.id,
      name: d.name,
      documentType: d.document_type,
      linkedTo: '',
      validTo: d.valid_to,
      profileType: null,
      status: d.valid_to ? 'giltighet_gar_ut' : 'aktuell',
    });
  }

  return items;
}

/** Fixturer omvandlas till samma form, så att samma vy kan köras med fiktiv data i test. */
export function fixturePersonsToRows(people: FixturePersonDetail[]): PersonRow[] {
  return people.map((p) => ({ id: p.id, name: p.name, profile_type: p.profileType, department: p.department }));
}

/**
 * Hämtar kö-data från Supabase. Kräver en inloggad session, annars returneras tomt resultat.
 * Anropas bara när klienten är konfigurerad (se auth/supabase.ts).
 */
export async function fetchQueue(
  client: { from: (t: string) => { select: (c: string) => Promise<{ data: unknown[] | null; error: { message: string } | null }> } },
): Promise<{ items: QueueItem[]; error: string | null }> {
  const [p, m, t, d] = await Promise.all([
    client.from('persons').select('id,name,profile_type,department'),
    client.from('person_milestones').select('id,person_id,title,due_date'),
    client.from('milestone_tasks').select('milestone_id,is_done'),
    client.from('documents').select('id,name,document_type,security_class,current_version:document_versions!documents_current_version_fk(valid_to)'),
  ]);
  const error = p.error?.message ?? m.error?.message ?? t.error?.message ?? d.error?.message ?? null;
  if (error) return { items: [], error };
  // Platta ut giltigheten från den aktuella versionen till dokumentraden.
  const docs: DocumentRow[] = ((d.data ?? []) as Array<{ id: string; name: string; document_type: string; security_class: string; current_version: { valid_to: string | null } | null }>).map((x) => ({
    id: x.id,
    name: x.name,
    document_type: x.document_type,
    security_class: x.security_class,
    valid_to: x.current_version?.valid_to ?? null,
  }));
  return {
    items: mapToQueueItems((p.data ?? []) as PersonRow[], (m.data ?? []) as MilestoneRow[], docs, (t.data ?? []) as TaskRow[]),
    error: null,
  };
}
