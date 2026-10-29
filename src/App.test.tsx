import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

// FEAT-012-AC-4: fiktiv-märkning syns på startsidan.
describe('FEAT-012 startsida', () => {
  it('visar fiktiv testmiljö-märkning', () => {
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Fiktiv testmiljö');
  });
});
