import { useEffect, useState } from 'react';
import { Dashboard } from './dashboard/Dashboard';
import { PersonPage } from './person/PersonPage';
import { fixturePersons } from './dashboard/fixtures';
import { LoginView } from './auth/LoginView';
import { supabase, authConfigured } from './auth/supabase';

// Startsida: inloggning, sedan arbetskön. Personsidan öppnas från dashboarden.
// Fiktiv testmiljö (FEAT-012-B4). Vyn växlas med state, eftersom projektet saknar router.
export function App() {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);
  const [personId, setPersonId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(data.session !== null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(session !== null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (signedIn === null) return null;
  if (!signedIn) return <LoginView onSignedIn={() => setSignedIn(true)} />;

  const person = personId ? fixturePersons.find((p) => p.id === personId) : undefined;
  if (person) {
    return <PersonPage person={person} onBack={() => setPersonId(null)} />;
  }
  return <Dashboard onOpenPerson={setPersonId} />;
}
