import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';
import { searchPersons, type SearchablePerson } from './search';

// Menyn och topnav ska finnas kvar över vyer (wireframe 01). FEAT-004, FR-DSRCH-005.
// Alla personer är fiktiva.

afterEach(() => cleanup());

const people: SearchablePerson[] = [
  { id: 'p1', name: 'Fiktiv Anna Exempel', email: 'anna.exempel@example.test', department: 'Fiktiv HR', manager: 'Fiktiv Chef A' },
  { id: 'p2', name: 'Fiktiv Bo Testsson', email: 'bo.testsson@example.test', department: 'Fiktiv IT', manager: 'Fiktiv Chef B' },
];

const base = { active: 'dashboard' as const, onSelect: () => {}, people, email: 'hr@example.test', role: 'hr' as const, onOpenPerson: () => {}, onSignOut: () => {} };

describe('AppShell', () => {
  it('menyn och topnav visas bredvid innehållet', () => {
    render(<AppShell {...base}><p>Innehåll</p></AppShell>);
    expect(screen.getByRole('navigation', { name: 'Huvudmeny' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByText('Innehåll')).toBeInTheDocument();
  });

  it('menyn och topnav finns kvar när innehållet byts (persistent över vyer)', () => {
    const { rerender } = render(<AppShell {...base}><p>Dashboard</p></AppShell>);
    rerender(<AppShell {...base} active="personer"><p>Personsida</p></AppShell>);
    expect(screen.getByRole('navigation', { name: 'Huvudmeny' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Personer/ })).toHaveAttribute('aria-current', 'page');
  });

  it('menyval skickas vidare till föräldern', () => {
    const onSelect = vi.fn();
    render(<AppShell {...base} onSelect={onSelect}><p>x</p></AppShell>);
    fireEvent.click(screen.getByRole('button', { name: /Personer/ }));
    expect(onSelect).toHaveBeenCalledWith('personer');
  });
});

describe('TopNav sökning', () => {
  it('visar inga resultat förrän minst två tecken skrivits', () => {
    render(<AppShell {...base}><p>x</p></AppShell>);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'A' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('sökning på namn ger träffen, och klick öppnar personen', () => {
    const onOpenPerson = vi.fn();
    render(<AppShell {...base} onOpenPerson={onOpenPerson}><p>x</p></AppShell>);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'anna' } });
    fireEvent.click(screen.getByRole('button', { name: /Fiktiv Anna Exempel/ }));
    expect(onOpenPerson).toHaveBeenCalledWith('p1');
  });

  it('sökning på avdelning och chef fungerar', () => {
    expect(searchPersons(people, 'it').map((p) => p.id)).toContain('p2');
    expect(searchPersons(people, 'chef b').map((p) => p.id)).toEqual(['p2']);
  });

  it('en sökning utan träff visar tydligt besked', () => {
    render(<AppShell {...base}><p>x</p></AppShell>);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'finns inte' } });
    expect(screen.getByText('Inga personer matchar sökningen.')).toBeInTheDocument();
  });
});

describe('TopNav användarmeny', () => {
  it('visar inloggad e-post och roll', () => {
    render(<AppShell {...base}><p>x</p></AppShell>);
    const userBtn = screen.getByRole('button', { name: /hr@example.test/ });
    expect(userBtn).toHaveTextContent('hr@example.test');
    expect(userBtn).toHaveTextContent('HR');
  });

  it('visar HR-administratör för admin-rollen', () => {
    render(<AppShell {...base} role="hr_admin"><p>x</p></AppShell>);
    expect(screen.getByText('HR-administratör')).toBeInTheDocument();
  });

  it('logga ut anropar onSignOut', () => {
    const onSignOut = vi.fn();
    render(<AppShell {...base} onSignOut={onSignOut}><p>x</p></AppShell>);
    fireEvent.click(screen.getByRole('button', { name: /hr@example.test/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logga ut' }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
