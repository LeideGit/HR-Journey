import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

// FEAT-012-AC-4: fiktiv-märkning syns. Testet är oberoende av lokal .env.local (mock av auth).
vi.mock('./auth/supabase', () => ({
  supabase: null,
  authConfigured: false,
}));

describe('FEAT-012 startsida', () => {
  it('visar fiktiv testmiljö-märkning', () => {
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Fiktiv testmiljö');
  });
});
