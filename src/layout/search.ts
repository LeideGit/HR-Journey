// Sökning i topnav. FEAT-004, FR-DSRCH-005, SEC-013.
// Sök görs mot det RLS släpper igenom. Här filtreras bara resultatet i minnet.
// Skyddad information får inte läcka: listan kommer från en RLS-filtrerad hämtning (fetchPersons).
// Den här filtreringen ändrar aldrig vad användaren får se, bara vilka av redan tillåtna personer som matchar.

export interface SearchablePerson {
  id: string;
  name: string;
  email: string;
  department: string;
  manager: string | null;
}

/**
 * Filtrerar personer på namn, e-post, avdelning och chef (wireframe 01).
 * Tom eller en-teckens sökning ger inga träffar, så att listan inte visar allt på en gång.
 */
export function searchPersons(people: SearchablePerson[], query: string, limit = 8): SearchablePerson[] {
  const q = query.trim().toLocaleLowerCase('sv-SE');
  if (q.length < 2) return [];
  return people
    .filter((p) =>
      p.name.toLocaleLowerCase('sv-SE').includes(q) ||
      p.email.toLocaleLowerCase('sv-SE').includes(q) ||
      p.department.toLocaleLowerCase('sv-SE').includes(q) ||
      (p.manager ?? '').toLocaleLowerCase('sv-SE').includes(q),
    )
    .slice(0, limit);
}
