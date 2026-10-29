import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PersonPage, type PersonDetail } from './PersonPage';

// FEAT-002: FR-PERSON-001, FR-PERSON-002, FR-PERSON-003, FR-PERSON-005, FR-VTL-003, SK-004, SK-005.
// Fiktiv person. Dagens datum är FIXTURE_TODAY (2026-10-29).

afterEach(() => cleanup());

const person: PersonDetail = {
  id: 'fp1',
  name: 'Fiktiv Anna Exempel',
  email: 'anna.exempel@example.test',
  profileType: 'anstalld',
  department: 'Fiktiv HR',
  manager: 'Fiktiv Chef A',
  startDate: '2025-02-01',
  endDate: null,
  isActive: true,
  milestones: [
    { id: 'm-past', title: 'Fiktiv introduktion', dueDate: '2025-06-01', tasks: [{ isDone: true }] },
    { id: 'm-cur', title: 'Fiktiv uppföljning', dueDate: '2026-10-22', tasks: [{ isDone: false }, { isDone: true }] },
    { id: 'm-next', title: 'Fiktivt kompetenssamtal', dueDate: '2026-11-20', tasks: [{ isDone: false }] },
    { id: 'm-far', title: 'Fiktivt avslut', dueDate: '2027-04-10', tasks: [{ isDone: false }] },
  ],
};

describe('PersonPage', () => {
  it('visar namn, profiltyp, avdelning, chef, e-post och period (FR-PERSON-002)', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Fiktiv Anna Exempel' })).toBeInTheDocument();
    expect(screen.getByText('Anställd')).toBeInTheDocument();
    expect(screen.getByText('Fiktiv HR')).toBeInTheDocument();
    expect(screen.getByText('Fiktiv Chef A')).toBeInTheDocument();
    expect(screen.getByText('anna.exempel@example.test')).toBeInTheDocument();
    expect(screen.getByText('Tillsvidare')).toBeInTheDocument();
  });

  it('visar aktiv eller arkiverad status (FR-PERSON-005)', () => {
    render(<PersonPage person={{ ...person, isActive: false }} onBack={() => {}} />);
    expect(screen.getByText('Arkiverad')).toBeInTheDocument();
  });

  it('tidslinjen är standardvy och visar dagens datum (FR-PERSON-003, FR-VTL-013)', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Tidslinje' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Idag')).toBeInTheDocument();
  });

  it('aktuell milestone är den som är aktuell eller försenad, inte slutförd (SK-005)', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    const card = screen.getByRole('heading', { name: 'Aktuell milestone' }).closest('section') as HTMLElement;
    expect(within(card).getByText('Fiktiv uppföljning')).toBeInTheDocument();
    expect(within(card).getByText('1 av 2 uppgifter klara')).toBeInTheDocument();
  });

  it('nästa milestone är nästa icke-slutförda, efter aktuell (SK-005)', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    const card = screen.getByRole('heading', { name: 'Nästa milestone' }).closest('section') as HTMLElement;
    expect(within(card).getByText('Fiktivt kompetenssamtal')).toBeInTheDocument();
  });

  it('snabbfakta räknar slutförda och öppna milestones', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    expect(screen.getByText('Slutförda milestones: 1 av 4')).toBeInTheDocument();
    expect(screen.getByText('Öppna milestones: 3')).toBeInTheDocument();
  });

  it('milestone långt fram finns i tidslinjen och nås med scroll (OQ-003)', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    expect(screen.getByRole('article', { name: /Fiktivt avslut/ })).toBeInTheDocument();
  });

  it('andra flikar visar tydligt att de inte är byggda ännu', () => {
    render(<PersonPage person={person} onBack={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Dokument' }));
    expect(screen.getByText(/visas i en senare version/)).toBeInTheDocument();
  });

  it('tillbaka-knappen anropar onBack', () => {
    let called = false;
    render(<PersonPage person={person} onBack={() => { called = true; }} />);
    fireEvent.click(screen.getByRole('button', { name: /Tillbaka till arbetskön/ }));
    expect(called).toBe(true);
  });
});
