import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginView } from './LoginView';

// FEAT-001: AC-FEAT-001-1, AC-FEAT-001-2, SEC-004. Inga riktiga konton används.

const signIn = vi.fn();

vi.mock('./supabase', () => ({
  get supabase() {
    return { auth: { signInWithPassword: signIn } };
  },
  authConfigured: true,
}));

afterEach(() => {
  cleanup();
  signIn.mockReset();
});

describe('LoginView', () => {
  it('visar fiktiv-märkning', () => {
    render(<LoginView onSignedIn={() => {}} />);
    expect(screen.getByText(/Fiktiv testmiljö/)).toBeInTheDocument();
  });

  it('har ingen självregistrering (SEC-004)', () => {
    render(<LoginView onSignedIn={() => {}} />);
    expect(screen.queryByText(/registrera|skapa konto|sign up/i)).not.toBeInTheDocument();
  });

  it('visar generiskt fel vid fel uppgifter, utan att avslöja om kontot finns', async () => {
    signIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    render(<LoginView onSignedIn={() => {}} />);
    fireEvent.change(screen.getByLabelText('E-post'), { target: { value: 'okand@example.test' } });
    fireEvent.change(screen.getByLabelText('Lösenord'), { target: { value: 'fel' } });
    fireEvent.click(screen.getByRole('button', { name: 'Logga in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Fel e-post eller lösenord.');
  });

  it('anropar onSignedIn vid lyckad inloggning', async () => {
    signIn.mockResolvedValue({ error: null });
    const onSignedIn = vi.fn();
    render(<LoginView onSignedIn={onSignedIn} />);
    fireEvent.change(screen.getByLabelText('E-post'), { target: { value: 'hr@example.test' } });
    fireEvent.change(screen.getByLabelText('Lösenord'), { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Logga in' }));
    await waitFor(() => expect(onSignedIn).toHaveBeenCalledTimes(1));
    expect(signIn).toHaveBeenCalledWith({ email: 'hr@example.test', password: 'test' });
  });
});
