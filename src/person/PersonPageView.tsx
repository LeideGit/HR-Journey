import { useEffect, useState } from 'react';
import { PersonPage, type PersonDetail } from './PersonPage';
import { fetchPerson } from './personData';
import { supabase, authConfigured } from '../auth/supabase';
import { fixturePersons } from '../dashboard/fixtures';

// Läser personen från databasen när auth är konfigurerad. Annars från fixturer (lokal testdata).
// Id:t kommer från arbetskön, så det måste vara databasens id, inte fixturens (regression).
interface Props {
  personId: string;
  onBack: () => void;
}

export function PersonPageView({ personId, onBack }: Props) {
  type State =
    | { status: 'loading' }
    | { status: 'ready'; person: PersonDetail }
    | { status: 'missing' }
    | { status: 'error'; message: string };

  // Utan konfigurerad auth är fixturdata statisk, så den härleds direkt utan effekt.
  const fixture: State | null = authConfigured
    ? null
    : (() => {
        const f = fixturePersons.find((p) => p.id === personId);
        return f ? { status: 'ready', person: f as unknown as PersonDetail } : { status: 'missing' };
      })();

  const [remote, setRemote] = useState<State>({ status: 'loading' });
  const state = fixture ?? remote;

  useEffect(() => {
    if (!authConfigured || !supabase) return;
    let active = true;
    fetchPerson(supabase as unknown as Parameters<typeof fetchPerson>[0], personId).then(({ person, error }) => {
      if (!active) return;
      if (error) setRemote({ status: 'error', message: error });
      else if (!person) setRemote({ status: 'missing' });
      else setRemote({ status: 'ready', person });
    });
    return () => { active = false; };
  }, [personId]);

  if (state.status === 'loading') return <p className="person-status" role="status">Hämtar personen…</p>;
  if (state.status === 'missing') return <p role="alert" className="person-alert">Personen hittades inte, eller så saknar du behörighet.</p>;
  if (state.status === 'error') return <p role="alert" className="person-alert">Kunde inte hämta personen: {state.message}</p>;
  return <PersonPage person={state.person} onBack={onBack} />;
}
