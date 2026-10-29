import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Timeline, type TimelineMilestone } from './Timeline';

// FEAT-002: FR-VTL-003, FR-VTL-004, FR-VTL-005, FR-VTL-013, FR-VTL-015, AC-FEAT-002-1..4, SK-005, OQ-003.
// Alla milestones är fiktiva.

afterEach(() => cleanup());

const TODAY = '2026-10-29';

const near: TimelineMilestone = {
  id: 'n1', title: 'Fiktiv uppföljning', dueDate: '2026-11-10', tasks: [{ isDone: false }],
};
const past: TimelineMilestone = {
  id: 'p1', title: 'Fiktiv introduktion', dueDate: '2026-09-01', tasks: [{ isDone: true }],
};
const far: TimelineMilestone = {
  id: 'f1', title: 'Fiktiv avslut', dueDate: '2027-08-15', tasks: [{ isDone: false }],
};

describe('Timeline', () => {
  it('visar milestones med titel, datum och status (FR-VTL-004, FR-VTL-005)', () => {
    render(<Timeline todayIso={TODAY} milestones={[near, past]} windowDaysForStatus={28} />);
    expect(screen.getByText('Fiktiv uppföljning')).toBeInTheDocument();
    expect(screen.getByText('Fiktiv introduktion')).toBeInTheDocument();
    expect(screen.getByText('Slutförd')).toBeInTheDocument();
    // 2026-11-10 är 12 dagar efter TODAY, inom 28-dagars fönstret, så den är Aktuell.
    expect(screen.getByText('Aktuell')).toBeInTheDocument();
  });

  it('markerar dagens datum (FR-VTL-013)', () => {
    render(<Timeline todayIso={TODAY} milestones={[near]} windowDaysForStatus={28} />);
    expect(screen.getByText('Idag')).toBeInTheDocument();
  });

  it('händelse långt fram finns i DOM och nås med scroll (OQ-003, FR-VTL-015)', () => {
    render(<Timeline todayIso={TODAY} milestones={[near, far]} windowDaysForStatus={28} />);
    // Händelsen 2027-08 ligger utanför 6-månadersfönstret men ska finnas på canvas.
    expect(screen.getByText('Fiktiv avslut')).toBeInTheDocument();
  });

  it('kortet är tangentbordsfokuserbart (NFR-011, AC-FEAT-002-4)', () => {
    render(<Timeline todayIso={TODAY} milestones={[near]} windowDaysForStatus={28} />);
    const card = screen.getByRole('article', { name: /Fiktiv uppföljning/ });
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('kortets etikett innehåller status och klara tasks (WCAG, FR-VTL-005)', () => {
    render(<Timeline todayIso={TODAY} milestones={[past]} windowDaysForStatus={28} />);
    const card = screen.getByRole('article', { name: /Fiktiv introduktion/ });
    expect(card.getAttribute('aria-label')).toMatch(/Slutförd/);
    expect(card.getAttribute('aria-label')).toMatch(/1 av 1 klara/);
  });

  it('scroll-området går att nå med tangentbord', () => {
    render(<Timeline todayIso={TODAY} milestones={[near, far]} windowDaysForStatus={28} />);
    const region = screen.getByLabelText(/Tidslinje, scrolla horisontellt/);
    expect(region).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
  });

  it('tom tidslinje renderar utan fel', () => {
    render(<Timeline todayIso={TODAY} milestones={[]} windowDaysForStatus={28} />);
    expect(screen.getByText('Idag')).toBeInTheDocument();
  });
});
