import { useState, type FormEvent } from 'react';
import { supabase, authConfigured } from './supabase';

// Inloggning för HR och HR-administratör (FEAT-001-B1). Självregistrering finns inte här (SEC-004).
// Felmeddelandet är generiskt, så att det inte avslöjar om ett konto finns (SEC-004).

interface Props {
  onSignedIn: () => void;
}

export function LoginView({ onSignedIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authConfigured || !supabase) {
    return (
      <main className="login">
        <p role="status" className="login-env">Fiktiv testmiljö. Endast fiktiva personer och dokument.</p>
        <p role="alert" className="login-error">
          Inloggning är inte konfigurerad. Saknade miljövariabler: VITE_SUPABASE_URL och VITE_SUPABASE_PUBLISHABLE_KEY.
        </p>
      </main>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError('Fel e-post eller lösenord.');
      return;
    }
    onSignedIn();
  }

  return (
    <main className="login">
      <p role="status" className="login-env">Fiktiv testmiljö. Endast fiktiva personer och dokument.</p>
      <h1 className="login-title">Logga in</h1>
      <form className="login-form" onSubmit={onSubmit} noValidate>
        <label className="login-field">
          <span>E-post</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="login-field">
          <span>Lösenord</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p role="alert" className="login-error">{error}</p>}
        <button type="submit" className="login-submit" disabled={busy}>
          {busy ? 'Loggar in…' : 'Logga in'}
        </button>
      </form>
    </main>
  );
}
