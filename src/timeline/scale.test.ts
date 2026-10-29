import { describe, expect, it } from 'vitest';
import { addMonths, assignLanes, computeScale, dayToIso, scrollLeftToCenter, xFor } from './scale';
import { toDayNumber } from '../milestones/status';

// FEAT-002, OQ-003 (beslutad 2026-10-29). Alla datum är fiktiva och relativa till TODAY.

const TODAY = '2026-10-29';

describe('computeScale (OQ-003)', () => {
  it('närliggande händelse ger smalt framåtfönster på 1 månad', () => {
    const s = computeScale({ todayIso: TODAY, eventDates: ['2026-11-15'] });
    expect(s.forwardMonths).toBe(1);
  });

  it('händelse längre fram ger fönstret så långt som behövs, högst 6 månader', () => {
    const s = computeScale({ todayIso: TODAY, eventDates: ['2027-03-30'] });
    expect(s.forwardMonths).toBe(6);
  });

  it('framåtfönstret går aldrig längre än 6 månader', () => {
    const s = computeScale({ todayIso: TODAY, eventDates: ['2027-08-15'] });
    expect(s.forwardMonths).toBe(1);
    expect(addMonths(s.todayDay, 6)).toBeLessThan(toDayNumber('2027-08-15'));
  });

  it('händelse längre än 6 månader framåt ligger på canvas, så scroll når den', () => {
    const s = computeScale({ todayIso: TODAY, eventDates: ['2027-08-15'] });
    expect(s.canvasEnd).toBeGreaterThanOrEqual(toDayNumber('2027-08-15'));
    expect(s.viewEnd).toBeLessThan(toDayNumber('2027-08-15'));
  });

  it('inga händelser ger minsta fönster framåt och bakåt', () => {
    const s = computeScale({ todayIso: TODAY, eventDates: [] });
    expect(s.forwardMonths).toBe(1);
    expect(s.pastMonths).toBe(1);
  });

  it('passerad händelse ger bakåtfönster, högst 6 månader', () => {
    expect(computeScale({ todayIso: TODAY, eventDates: ['2026-05-15'] }).pastMonths).toBe(6);
    expect(computeScale({ todayIso: TODAY, eventDates: ['2026-10-01'] }).pastMonths).toBe(1);
  });

  it('idag ligger alltid inom fönstret', () => {
    const s = computeScale({ todayIso: TODAY, eventDates: ['2026-05-15', '2027-08-15'] });
    expect(s.viewStart).toBeLessThanOrEqual(s.todayDay);
    expect(s.viewEnd).toBeGreaterThanOrEqual(s.todayDay);
  });
});

describe('dayToIso och addMonths', () => {
  it('dayToIso är omvänd till toDayNumber', () => {
    expect(dayToIso(toDayNumber('2026-10-29'))).toBe('2026-10-29');
  });

  it('addMonths hanterar månadsslut och skottår', () => {
    expect(dayToIso(addMonths(toDayNumber('2028-01-31'), 1))).toBe('2028-03-02');
    expect(dayToIso(addMonths(toDayNumber('2028-02-29'), 12))).toBe('2029-03-01');
  });
});

describe('xFor', () => {
  it('x ökar monotont med datum', () => {
    const start = toDayNumber('2026-01-01');
    const a = xFor(toDayNumber('2026-02-01'), start, 3);
    const b = xFor(toDayNumber('2026-03-01'), start, 3);
    expect(b).toBeGreaterThan(a);
  });
});

describe('scrollLeftToCenter (idag i mitten)', () => {
  it('placerar idag mitt i vyn när det finns utrymme på båda sidor', () => {
    // idag vid x=1000, vyn 400 bred, canvas 3000 bred → scroll 800 så att 1000 hamnar mitt i 800..1200
    expect(scrollLeftToCenter(1000, 400, 3000)).toBe(800);
  });

  it('startar inte negativt när idag ligger nära canvas-start', () => {
    expect(scrollLeftToCenter(50, 400, 3000)).toBe(0);
  });

  it('stannar vid maxscroll när idag ligger nära canvas-slut', () => {
    // max = 3000 - 400 = 2600
    expect(scrollLeftToCenter(2950, 400, 3000)).toBe(2600);
  });

  it('ger 0 när canvas ryms helt i vyn', () => {
    expect(scrollLeftToCenter(100, 800, 600)).toBe(0);
  });
});

describe('assignLanes', () => {
  it('överlappande kort får olika rader', () => {
    const lanes = assignLanes([{ id: 'a', x: 0 }, { id: 'b', x: 100 }], 152, 10);
    expect(lanes.get('a')).toBe(0);
    expect(lanes.get('b')).toBe(1);
  });

  it('kort utan överlapp delar rad', () => {
    const lanes = assignLanes([{ id: 'a', x: 0 }, { id: 'b', x: 200 }], 152, 10);
    expect(lanes.get('a')).toBe(0);
    expect(lanes.get('b')).toBe(0);
  });

  it('exakt gap räknas som utan överlapp', () => {
    const lanes = assignLanes([{ id: 'a', x: 0 }, { id: 'b', x: 162 }], 152, 10);
    expect(lanes.get('b')).toBe(0);
  });
});
