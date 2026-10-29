import { describe, expect, it } from 'vitest';
import { beraknaStatus, progress, statusEfterAterOppning } from './status';

// FEAT-003-B9, FR-MILE-004, FR-MILE-005, FR-VTL-018, FR-VTL-019, TEST-001.
// OQ-001 är ej beslutad. Alla tester anger windowDays uttryckligen.

const TODAY = '2026-10-29';
const WINDOW = 28;

describe('beraknaStatus', () => {
  it('alla tasks klara ger slutford, även om datumet är passerat (FR-VTL-018)', () => {
    const status = beraknaStatus(
      { dueDate: '2026-01-01', tasks: [{ isDone: true }, { isDone: true }] },
      TODAY,
      WINDOW,
    );
    expect(status).toBe('slutford');
  });

  it('milestone utan tasks blir aldrig slutford av tasks', () => {
    const status = beraknaStatus({ dueDate: '2026-12-31', tasks: [] }, TODAY, WINDOW);
    expect(status).toBe('kommande');
  });

  it('en öppen task hindrar slutford, även när alla andra är klara', () => {
    const status = beraknaStatus(
      { dueDate: '2026-12-31', tasks: [{ isDone: true }, { isDone: false }] },
      TODAY,
      WINDOW,
    );
    expect(status).not.toBe('slutford');
  });

  it('förfallodatum passerat och ej klar ger forsenad (FR-DASH-002)', () => {
    const status = beraknaStatus({ dueDate: '2026-10-28', tasks: [{ isDone: false }] }, TODAY, WINDOW);
    expect(status).toBe('forsenad');
  });

  it('förfallodatum idag är inte försenad', () => {
    const status = beraknaStatus({ dueDate: TODAY, tasks: [] }, TODAY, WINDOW);
    expect(status).toBe('aktuellt');
  });

  it('förfallodatum inom fönstret ger aktuellt, på gränsen', () => {
    // 2026-10-29 + 28 dagar = 2026-11-26
    expect(beraknaStatus({ dueDate: '2026-11-26', tasks: [] }, TODAY, WINDOW)).toBe('aktuellt');
  });

  it('förfallodatum en dag efter fönstret ger kommande', () => {
    expect(beraknaStatus({ dueDate: '2026-11-27', tasks: [] }, TODAY, WINDOW)).toBe('kommande');
  });

  it('skottår hanteras: 2028-02-29 är 1 dag efter 2028-02-28, 2028-03-01 är 2 dagar', () => {
    expect(beraknaStatus({ dueDate: '2028-02-29', tasks: [] }, '2028-02-28', 1)).toBe('aktuellt');
    expect(beraknaStatus({ dueDate: '2028-03-01', tasks: [] }, '2028-02-28', 1)).toBe('kommande');
  });

  it('kastar fel vid ogiltigt datumformat', () => {
    expect(() => beraknaStatus({ dueDate: '29/10/2026', tasks: [] }, TODAY, WINDOW)).toThrow();
  });

  it('kastar fel om windowDays saknas eller är negativ (OQ-001 ej beslutad)', () => {
    expect(() => beraknaStatus({ dueDate: TODAY, tasks: [] }, TODAY, -1)).toThrow();
    expect(() => beraknaStatus({ dueDate: TODAY, tasks: [] }, TODAY, 1.5)).toThrow();
  });
});

describe('statusEfterAterOppning', () => {
  it('återöppnad task ger aktuellt när förfallodatum är nära (FR-VTL-019)', () => {
    const status = statusEfterAterOppning(
      { dueDate: '2026-11-10', tasks: [{ isDone: true }] },
      TODAY,
      WINDOW,
    );
    expect(status).toBe('aktuellt');
  });

  it('återöppnad task ger forsenad när förfallodatum passerats', () => {
    const status = statusEfterAterOppning(
      { dueDate: '2026-10-01', tasks: [{ isDone: true }] },
      TODAY,
      WINDOW,
    );
    expect(status).toBe('forsenad');
  });

  it('återöppnad task ger inte slutford', () => {
    const status = statusEfterAterOppning(
      { dueDate: '2026-12-31', tasks: [{ isDone: true }, { isDone: true }] },
      TODAY,
      WINDOW,
    );
    expect(status).not.toBe('slutford');
  });
});

describe('progress', () => {
  it('räknar klara och totalt, och procent avrundas (FR-MILE-003)', () => {
    expect(progress([{ isDone: true }, { isDone: false }, { isDone: false }])).toEqual({
      done: 1,
      total: 3,
      percent: 33,
    });
  });

  it('tom lista ger 0 procent utan division med noll', () => {
    expect(progress([])).toEqual({ done: 0, total: 0, percent: 0 });
  });
});
