import { useEffect, useState } from 'react';
import { Dashboard } from './dashboard/Dashboard';
import { LoginView } from './auth/LoginView';
import { supabase, authConfigured } from './auth/supabase';

// Startsida. Visar inloggning om inget konto är inloggat. Fiktiv testmiljö (FEAT-012-B4).
// Gäller endast när auth är konfigurerad. Utan konfiguration visas inloggningsfelet.
export function App() {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);

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
  return <Dashboard />;
}
