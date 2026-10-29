import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Dashboard } from './Dashboard';

afterEach(() => {
  cleanup();
});

// FEAT-004: FR-DASH-001 till FR-DASH-008, SK-001, SK-002, SK-013, AC-FEAT-004-1, AC-FEAT-004-2.
// Fiktiv data från fixtures.ts.

describe('Dashboard', () => {
  it('visar fiktiv testmiljö-märkning (FEAT-012-AC-4)', () => {
    render(<Dashboard />);
    expect(screen.getByRole('status')).toHaveTextContent('Fiktiv testmiljö');
  });

  it('visar KPI-kort med antal från statusberäkningen (FR-DASH-002)', () => {
    render(<Dashboard />);
    const kpis = screen.getByLabelText('Översikt');
    // Fixtures med FIXTURE_TODAY 2026-10-29 och 28 dagars fönster: 2 försenade, 1 aktuell, 2 kommande.
    expect(within(kpis).getByText('Försenade').previousElementSibling).toHaveTextContent('2');
    expect(within(kpis).getByText('Aktuella').previousElementSibling).toHaveTextContent('1');
    expect(within(kpis).getByText('Kommande').previousElementSibling).toHaveTextContent('2');
  });

  it('listar milestones med status och person (SK-001)', () => {
    render(<Dashboard />);
    const panel = screen.getByRole('heading', { name: 'Milestones som behöver uppmärksamhet' }).closest('section');
    expect(panel).not.toBeNull();
    const rows = within(panel as HTMLElement).getAllByRole('row');
    // 1 rubrikrad + 5 milestones som inte är slutförda. Den slutförda milestonen visas inte.
    expect(rows).toHaveLength(6);
    // Två milestones är försenade i fixtures (22 okt och 25 okt).
    expect(within(panel as HTMLElement).getAllByText('Försenad')).toHaveLength(2);
  });

  it('filtrerar på profiltyp (SK-002)', () => {
    render(<Dashboard />);
    fireEvent.change(screen.getByLabelText('Profiltyp'), { target: { value: 'konsult' } });
    expect(screen.queryByText('Fiktiv Anna Exempel')).not.toBeInTheDocument();
    expect(screen.getByText('Fiktiv Bo Testsson')).toBeInTheDocument();
  });

  it('kombinerar profiltyp och status (FR-DASH-005)', () => {
    render(<Dashboard />);
    fireEvent.change(screen.getByLabelText('Profiltyp'), { target: { value: 'anstalld' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'forsenad' } });
    expect(screen.getByText('Fiktiv Anna Exempel')).toBeInTheDocument();
    expect(screen.queryByText('Fiktiv Dan Prov')).not.toBeInTheDocument();
  });

  it('visar tomt läge när inget matchar (FEAT-004 AC-1)', () => {
    render(<Dashboard />);
    fireEvent.change(screen.getByLabelText('Profiltyp'), { target: { value: 'lia' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'forsenad' } });
    expect(screen.getByText('Inga milestones matchar filtret.')).toBeInTheDocument();
  });

  it('rensa filter återställer listan (FR-DASH-005)', () => {
    render(<Dashboard />);
    fireEvent.change(screen.getByLabelText('Profiltyp'), { target: { value: 'lia' } });
    expect(screen.queryByText('Fiktiv Bo Testsson')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Rensa filter' }));
    expect(screen.getByText('Fiktiv Bo Testsson')).toBeInTheDocument();
  });

  it('visar dokumentärenden i samma vy men i egen tabell (FR-DASH-006, FR-DASH-007)', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: 'Dokument som behöver hanteras' })).toBeInTheDocument();
    expect(screen.getByText('Fiktiv konsultpolicy 2026')).toBeInTheDocument();
  });
});
