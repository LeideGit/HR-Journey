import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';

// Menyn ska finnas kvar över vyer (wireframe 01, persistent meny).

afterEach(() => cleanup());

describe('AppShell', () => {
  it('menyn visas bredvid innehållet', () => {
    render(<AppShell active="dashboard" onSelect={() => {}}><p>Innehåll</p></AppShell>);
    expect(screen.getByRole('navigation', { name: 'Huvudmeny' })).toBeInTheDocument();
    expect(screen.getByText('Innehåll')).toBeInTheDocument();
  });

  it('menyn finns kvar när innehållet byts (persistent över vyer)', () => {
    const { rerender } = render(<AppShell active="dashboard" onSelect={() => {}}><p>Dashboard</p></AppShell>);
    rerender(<AppShell active="personer" onSelect={() => {}}><p>Personsida</p></AppShell>);
    expect(screen.getByRole('navigation', { name: 'Huvudmeny' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Personer/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('Dashboard')).toBeInTheDocument();
  });

  it('menyval skickas vidare till föräldern', () => {
    const onSelect = vi.fn();
    render(<AppShell active="dashboard" onSelect={onSelect}><p>x</p></AppShell>);
    screen.getByRole('button', { name: /Personer/ }).click();
    expect(onSelect).toHaveBeenCalledWith('personer');
  });
});
