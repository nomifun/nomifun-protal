import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/i18n';

/**
 * AutoWorkBoard — interactive requirement-board island for the "智能值守" pillar.
 *
 * A 3-column kanban (Pending → InProgress → Done) where requirement cards
 * advance across columns on a gentle loop, plus an IDMM "值守" status strip
 * with a pulsing dot whose label cycles between the rule tier and the sidecar
 * model tier. Honors `prefers-reduced-motion`: the board renders statically
 * (cards fixed across columns, indicator steady) and no timers are started.
 *
 * Self-contained — no network, all strings keyed by `locale`, timers cleaned
 * up on unmount.
 */

type Stage = 0 | 1 | 2; // 0 = Pending, 1 = InProgress, 2 = Done

interface Strings {
  cols: [string, string, string];
  watch: string;
  watchOn: string;
  tiers: [string, string];
  cards: { tag: string; title: string }[];
}

const STRINGS: Record<Locale, Strings> = {
  'zh-CN': {
    cols: ['待处理', '进行中', '已完成'],
    watch: 'IDMM 值守',
    watchOn: '保活中',
    tiers: ['规则层 介入', '旁路模型 决策'],
    cards: [
      { tag: 'web', title: '抓取竞品定价页' },
      { tag: 'code', title: '修复登录回归' },
      { tag: 'docs', title: '生成发布说明' },
      { tag: 'data', title: '汇总本周指标' },
      { tag: 'ops', title: '巡检会话健康' },
    ],
  },
  'en-US': {
    cols: ['Pending', 'In progress', 'Done'],
    watch: 'IDMM watch',
    watchOn: 'Keep-alive',
    tiers: ['Rule tier engaged', 'Sidecar model decides'],
    cards: [
      { tag: 'web', title: 'Snapshot competitor pricing' },
      { tag: 'code', title: 'Fix login regression' },
      { tag: 'docs', title: 'Draft release notes' },
      { tag: 'data', title: 'Roll up weekly metrics' },
      { tag: 'ops', title: 'Sweep session health' },
    ],
  },
};

const TAG_TONE: Record<string, string> = {
  web: 'border-violet-400/30 bg-violet-500/12 text-violet-300',
  code: 'border-pink-500/30 bg-pink-500/12 text-pink-300',
  docs: 'border-info/30 bg-info/12 text-info',
  data: 'border-success/30 bg-success/12 text-success',
  ops: 'border-warning/30 bg-warning/12 text-warning',
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function AutoWorkBoard({ locale }: { locale: Locale }) {
  const s = STRINGS[locale] ?? STRINGS['zh-CN'];
  const reduced = useMemo(prefersReducedMotion, []);
  const cardCount = s.cards.length;

  // Each card's current stage. Indices 0..2 by default seed all 3 columns.
  const [stages, setStages] = useState<Stage[]>(() =>
    s.cards.map((_, i) => (i < 3 ? (i as Stage) : 0)),
  );
  // Which card is currently animating its move (for a soft lift highlight).
  const [movingIdx, setMovingIdx] = useState<number>(-1);
  const [tier, setTier] = useState<0 | 1>(0);

  const cursor = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduced) return;

    const clearAll = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };

    const step = () => {
      // Advance the lowest-progress card that still has somewhere to go.
      setStages((prev) => {
        const next = [...prev];
        // pick the card to advance, scanning from a rotating cursor
        let target = -1;
        for (let n = 0; n < cardCount; n++) {
          const i = (cursor.current + n) % cardCount;
          if (next[i] < 2) {
            target = i;
            break;
          }
        }
        if (target === -1) {
          // everything is Done: recycle the oldest Done card back to Pending
          const i = cursor.current % cardCount;
          next[i] = 0;
          setMovingIdx(i);
          cursor.current = (cursor.current + 1) % cardCount;
        } else {
          next[target] = (next[target] + 1) as Stage;
          setMovingIdx(target);
          if (next[target] === 2) cursor.current = (target + 1) % cardCount;
        }
        return next;
      });

      // clear the move highlight shortly after, then schedule the next step
      const clearMove = window.setTimeout(() => setMovingIdx(-1), 650);
      timers.current.push(clearMove);
      const nextDelay = 2000 + Math.round(Math.random() * 900);
      const nextStep = window.setTimeout(step, nextDelay);
      timers.current.push(nextStep);
    };

    const tierTick = window.setInterval(() => {
      setTier((t) => (t === 0 ? 1 : 0));
    }, 3400);

    const first = window.setTimeout(step, 1600);
    timers.current.push(first);

    return () => {
      clearAll();
      window.clearInterval(tierTick);
    };
  }, [reduced, cardCount]);

  const columns: { idx: number; stage: Stage }[][] = [[], [], []];
  stages.forEach((stage, idx) => columns[stage].push({ idx, stage }));

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-ink-600/70 bg-ink-850/60 p-4 backdrop-blur-sm sm:p-5">
      {/* IDMM watch status strip */}
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-ink-600/70 bg-ink-900/50 px-3.5 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-success/70 awb-ping" />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <span className="truncate text-xs font-semibold tracking-wide text-hi sm:text-sm">
            {s.watch}
          </span>
          <span className="hidden text-[11px] font-medium text-low sm:inline">
            · {s.watchOn}
          </span>
        </div>
        <div className="flex min-w-0 shrink items-center justify-end gap-1.5">
          <span className="i-mdi-shield-sync-outline text-sm text-pink-400" aria-hidden="true" />
          <span
            key={tier}
            className={`min-w-0 truncate text-[11px] font-medium tabular-nums sm:text-xs ${reduced ? 'text-mid' : 'awb-fade text-mid'}`}
          >
            {s.tiers[tier]}
          </span>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
        {columns.map((cards, col) => (
          <div
            key={col}
            className="flex min-w-0 flex-col rounded-xl border border-ink-700/70 bg-ink-900/40 p-2 sm:p-2.5"
          >
            <div className="mb-2 flex min-w-0 items-center gap-1.5 px-1">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  col === 0 ? 'bg-low' : col === 1 ? 'bg-warning' : 'bg-success'
                }`}
                aria-hidden="true"
              />
              <span className="min-w-0 truncate text-[11px] font-semibold tracking-wide text-mid sm:text-xs">
                {s.cols[col]}
              </span>
              <span className="ml-auto text-[10px] font-medium tabular-nums text-low">
                {cards.length}
              </span>
            </div>
            <div className="flex min-h-[7rem] min-w-0 flex-col gap-2 sm:min-h-[8.5rem]">
              {cards.map(({ idx }) => {
                const card = s.cards[idx];
                const isMoving = idx === movingIdx;
                return (
                  <div
                    key={idx}
                    className={`group min-w-0 rounded-lg border bg-ink-800/70 p-2 sm:p-2.5 transition-all duration-500 ${
                      isMoving
                        ? 'border-pink-500/50 shadow-[0_0_24px_-6px_rgba(255,111,145,0.45)]'
                        : 'border-ink-600/60'
                    } ${!reduced && isMoving ? 'awb-pop' : ''}`}
                  >
                    <span
                      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                        TAG_TONE[card.tag] ?? 'border-ink-600 bg-ink-700/60 text-mid'
                      }`}
                    >
                      {card.tag}
                    </span>
                    <p className="mt-1.5 break-words text-[11px] font-medium leading-snug text-hi sm:text-xs">
                      {card.title}
                    </p>
                    {col === 2 && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-success">
                        <span className="i-mdi-bell-ring-outline text-xs" aria-hidden="true" />
                        {locale === 'zh-CN' ? '完成通知已推送' : 'Notified'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes awb-ping-kf {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .awb-ping { animation: awb-ping-kf 1.8s cubic-bezier(0,0,0.2,1) infinite; }
        @keyframes awb-pop-kf {
          0% { transform: translateY(-6px) scale(0.97); opacity: 0.55; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .awb-pop { animation: awb-pop-kf 0.55s cubic-bezier(0.16,1,0.3,1); }
        @keyframes awb-fade-kf {
          0% { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .awb-fade { animation: awb-fade-kf 0.5s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .awb-ping, .awb-pop, .awb-fade { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
