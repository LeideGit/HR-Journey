import { useEffect, useState } from 'react';
import { Dashboard } from './dashboard/Dashboard';
import { PersonPageView } from './person/PersonPageView';
import { LoginView } from './auth/LoginView';
import { supabase, authConfigured } from './auth/supabase';
import { AppShell } from './layout/AppShell';
import type { NavView } from './layout/SideNav';

// Startsida: inloggning, sedan arbetskön. Personsidan öppnas från dashboarden.
// Fiktiv testmiljö (FEAT-012-B4). Vyn växlas med state, eftersom projektet saknar router.
export function App() {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [view, setView] = useState<NavView>('dashboard');

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

  // Personer öppnas från dashboarden. Menyn byter vy och nollställer vald person.
  const select = (next: NavView) => {
    setPersonId(null);
    setView(next);
  };

  if (personId) {
    return (
      <AppShell active={view} onSelect={select}>
        <PersonPageView personId={personId} onBack={() => setPersonId(null)} />
      </AppShell>
    );
  }
  return (
    <AppShell active={view} onSelect={select}>
      <Dashboard onOpenPerson={(id) => { setView('dashboard'); setPersonId(id); }} />
    </AppShell>
  );
}
