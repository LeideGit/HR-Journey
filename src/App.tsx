import { useEffect, useState, type ReactNode } from 'react';
import { Dashboard } from './dashboard/Dashboard';
import { PersonPageView } from './person/PersonPageView';
import { LoginView } from './auth/LoginView';
import { supabase, authConfigured } from './auth/supabase';
import { AppShell } from './layout/AppShell';
import type { NavView } from './layout/SideNav';
import type { SearchablePerson } from './layout/search';
import { fetchPeople } from './person/personData';
import { fetchRole, type AppRole } from './auth/currentUser';

// Startsida: inloggning, sedan arbetskön. Personsidan öppnas från dashboarden.
// Fiktiv testmiljö (FEAT-012-B4). Vyn växlas med state, eftersom projektet saknar router.
export function App() {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [view, setView] = useState<NavView>('dashboard');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppRole | null>(null);
  const [people, setPeople] = useState<SearchablePerson[]>([]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(data.session !== null);
    });
    // Inloggad användares e-post och roll, samt personlistan för sökning. Allt via RLS.
    const client = supabase as unknown as Parameters<typeof fetchPeople>[0];
    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? '');
    });
    fetchRole(client as unknown as Parameters<typeof fetchRole>[0]).then((r) => {
      if (active) setRole(r);
    });
    fetchPeople(client).then(({ people: rows }) => {
      if (active) setPeople(rows);
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

  // Personer öppnas från dashboarden. Menyn byter vy och nollställer vald person.
  const select = (next: NavView) => {
    setPersonId(null);
    setView(next);
  };
  const openPerson = (id: string) => {
    setView('dashboard');
    setPersonId(id);
  };
  const signOut = () => {
    void supabase?.auth.signOut();
  };
  const shell = (children: ReactNode) => (
    <AppShell
      active={view}
      onSelect={select}
      people={people}
      email={email}
      role={role}
      onOpenPerson={openPerson}
      onSignOut={signOut}
    >
      {children}
    </AppShell>
  );

  if (personId) {
    return shell(<PersonPageView personId={personId} onBack={() => setPersonId(null)} />);
  }
  return shell(<Dashboard onOpenPerson={openPerson} />);
}
