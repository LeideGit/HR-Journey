import { useEffect, useMemo, useRef } from 'react';
import { computeScale, xFor, assignLanes, addMonths, scrollLeftToCenter } from './scale';
import { beraknaStatus, toDayNumber, type MilestoneStatus, type TaskState } from '../milestones/status';

// Tidslinje för en person. FEAT-002, PRD: FR-VTL-001 till FR-VTL-015, AC-004, SK-004, SK-005.
// Skalan följer OQ-003 (se scale.ts). Standardfönstret är högst 6 månader åt vardera hållet,
// och händelser längre bort nås med horisontell scroll.

export interface TimelineMilestone {
  id: string;
  title: string;
  dueDate: string;
  tasks: TaskState[];
}

interface Props {
  todayIso: string;
  milestones: TimelineMilestone[];
  windowDaysForStatus: number;
  monthFormat?: Intl.DateTimeFormat;
}

const PX_PER_DAY = 3;
const CARD_WIDTH = 152;
const CARD_GAP = 10;
const LANE_HEIGHT = 96;

const MONTH = new Intl.DateTimeFormat('sv-SE', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const DAY = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  forsenad: 'Försenad',
  aktuellt: 'Aktuell',
  kommande: 'Kommande',
  slutford: 'Slutförd',
};

export function Timeline({ todayIso, milestones, windowDaysForStatus, monthFormat = MONTH }: Props) {
  const scale = useMemo(
    () => computeScale({ todayIso, eventDates: milestones.map((m) => m.dueDate) }),
    [todayIso, milestones],
  );

  const items = useMemo(
    () => milestones.map((m) => ({
      id: m.id,
      x: xFor(toDayNumber(m.dueDate), scale.canvasStart, PX_PER_DAY),
    })),
    [milestones, scale.canvasStart],
  );
  const lanes = useMemo(() => assignLanes(items, CARD_WIDTH, CARD_GAP), [items]);
  const laneCount = Math.max(1, ...Array.from(lanes.values()).map((l) => l + 1));

  const canvasWidth = (scale.canvasEnd - scale.canvasStart) * PX_PER_DAY;
  const todayX = xFor(scale.todayDay, scale.canvasStart, PX_PER_DAY);
  const viewStartX = xFor(scale.viewStart, scale.canvasStart, PX_PER_DAY);
  const viewEndX = xFor(scale.viewEnd, scale.canvasStart, PX_PER_DAY);

  const months = useMemo(() => {
    const out: { day: number; x: number }[] = [];
    const first = new Date(scale.canvasStart * 86_400_000);
    let day = Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1) / 86_400_000;
    while (day <= scale.canvasEnd) {
      if (day >= scale.canvasStart) out.push({ day, x: xFor(day, scale.canvasStart, PX_PER_DAY) });
      day = addMonths(day, 1);
    }
    return out;
  }, [scale.canvasStart, scale.canvasEnd]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Idag ska alltid synas när tidslinjen öppnas (FEAT-002-B4). Scrolla dit när komponenten
  // monteras och när dagens datum ändras. Vyn utan scroll-stöd hoppar över detta.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = scrollLeftToCenter(todayX, el.clientWidth, canvasWidth);
  }, [todayX, canvasWidth]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    // scrollBy finns inte i alla miljöer (t.ex. jsdom). Sätt scrollLeft direkt när metoden saknas.
    const step = e.key === 'ArrowRight' ? 160 : e.key === 'ArrowLeft' ? -160 : 0;
    if (step === 0) return;
    if (typeof el.scrollBy === 'function') el.scrollBy({ left: step });
    else el.scrollLeft += step;
  }

  return (
    <section className="tl" aria-label="Tidslinje">
      <div
        className="tl-scroll"
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Tidslinje, scrolla horisontellt med piltangenter"
      >
        <div className="tl-canvas" style={{ width: canvasWidth, height: laneCount * LANE_HEIGHT + 48 }}>
          <div className="tl-window" style={{ left: viewStartX, width: viewEndX - viewStartX }} aria-hidden="true" />

          {months.map((m) => (
            <span key={m.day} className="tl-month" style={{ left: m.x }}>
              {monthFormat.format(new Date(m.day * 86_400_000))}
            </span>
          ))}

          <div className="tl-today" style={{ left: todayX }} aria-hidden="true">
            <span className="tl-today-label">Idag</span>
          </div>

          {milestones.map((m) => {
            const day = toDayNumber(m.dueDate);
            const status = beraknaStatus({ dueDate: m.dueDate, tasks: m.tasks }, todayIso, windowDaysForStatus);
            const lane = lanes.get(m.id) ?? 0;
            const x = xFor(day, scale.canvasStart, PX_PER_DAY);
            const done = m.tasks.filter((t) => t.isDone).length;
            return (
              <article
                key={m.id}
                className={`tl-card tl-card-${status}`}
                style={{ left: x, top: 40 + lane * LANE_HEIGHT, width: CARD_WIDTH }}
                tabIndex={0}
                aria-label={`${m.title}, ${DAY.format(new Date(day * 86_400_000))}, ${STATUS_LABEL[status]}, ${done} av ${m.tasks.length} klara`}
              >
                <span className="tl-card-status">{STATUS_LABEL[status]}</span>
                <span className="tl-card-title">{m.title}</span>
                <span className="tl-card-date">{DAY.format(new Date(day * 86_400_000))}</span>
              </article>
            );
          })}
        </div>
      </div>
      <p className="tl-hint">Scrolla horisontellt för att se fler händelser. Piltangenterna fungerar när tidslinjen är i fokus.</p>
    </section>
  );
}
