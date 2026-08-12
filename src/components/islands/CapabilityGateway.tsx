import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n';

/**
 * CapabilityGateway — the three-axis capability gateway matrix for the 开放能力
 * pillar. Rows = Surface (Desktop / Channel / Remote), cols = DangerTier
 * (Read / Write / Destructive / Sensitive). Each cell is colored by its
 * Decision (Allow = success tone, Confirm = warning tone, Deny = danger tone).
 *
 * Hovering or tapping a cell highlights it and surfaces the decision label in a
 * caption area. A fixed caption explains the current knowledge write-back
 * policy without pretending that this illustrative matrix is the full
 * authorization table.
 *
 * Self-contained — no network, all strings keyed by `locale`. Honors
 * `prefers-reduced-motion` (drops the hover/highlight transitions). Responsive:
 * the matrix scrolls horizontally on narrow screens.
 *
 * NOTE: the policy below is ILLUSTRATIVE (示意), matching the spec's example.
 */

interface Props {
  locale: Locale;
}

type Decision = 'allow' | 'confirm' | 'deny';

/** Illustrative policy: surfaces × danger tiers → decision (per spec). */
const POLICY: Decision[][] = [
  // Read       Write      Destructive  Sensitive
  ['allow', 'allow', 'confirm', 'confirm'], // Desktop
  ['allow', 'confirm', 'deny', 'deny'], // Channel
  ['allow', 'confirm', 'confirm', 'deny'], // Remote
];

const DECISION_STYLE: Record<Decision, { cell: string; dot: string; ring: string }> = {
  allow: {
    cell: 'border-success/25 bg-success/10 text-success',
    dot: 'bg-success',
    ring: 'ring-success/60 shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)]',
  },
  confirm: {
    cell: 'border-warning/25 bg-warning/10 text-warning',
    dot: 'bg-warning',
    ring: 'ring-warning/60 shadow-[0_0_24px_-6px_rgba(251,191,36,0.5)]',
  },
  deny: {
    cell: 'border-danger/25 bg-danger/10 text-danger',
    dot: 'bg-danger',
    ring: 'ring-danger/60 shadow-[0_0_24px_-6px_rgba(251,113,133,0.5)]',
  },
};

const STR: Record<Locale, {
  surfaces: [string, string, string];
  surfaceHints: [string, string, string];
  tiers: [string, string, string, string];
  decisions: Record<Decision, string>;
  axisSurface: string;
  axisTier: string;
  axisDecision: string;
  illustrative: string;
  hint: string;
  writebackPolicy: string;
  cellAria: (surface: string, tier: string, decision: string) => string;
}> = {
  'zh-CN': {
    surfaces: ['Desktop 桌面', 'Channel 渠道', 'Remote 远程'],
    surfaceHints: ['本机直接操作', 'IM 社交平台', 'MCP / REST 调用'],
    tiers: ['只读 Read', '写入 Write', '破坏性 Destructive', '敏感 Sensitive'],
    decisions: { allow: '放行 Allow', confirm: '需确认 Confirm', deny: '拒绝 Deny' },
    axisSurface: '调用面 Surface',
    axisTier: '危险级 DangerTier',
    axisDecision: '决策 Decision',
    illustrative: '示意策略',
    hint: '悬停或点击单元格查看该调用面在对应危险级上的决策。',
    writebackPolicy:
      '知识回写不是统一的 IM 暂存规则：关闭时只读，Manual 仅在你明确要求时写入，Auto 才会在回合结束后自动沉淀。外部 IM 渠道还需要单独开启 channel_write_enabled；开启后写入知识库正文。',
    cellAria: (surface, tier, decision) => `${surface} · ${tier}：${decision}`,
  },
  'en-US': {
    surfaces: ['Desktop', 'Channel', 'Remote'],
    surfaceHints: ['Local, hands-on', 'IM / chat apps', 'MCP / REST callers'],
    tiers: ['Read', 'Write', 'Destructive', 'Sensitive'],
    decisions: { allow: 'Allow', confirm: 'Confirm', deny: 'Deny' },
    axisSurface: 'Surface',
    axisTier: 'DangerTier',
    axisDecision: 'Decision',
    illustrative: 'Illustrative policy',
    hint: 'Hover or tap a cell to see the decision for that surface at that danger tier.',
    writebackPolicy:
      'Knowledge write-back is not a universal IM staging rule: Disabled is read-only, Manual writes only when you explicitly ask, and Auto may extract durable knowledge at turn end. External IM channels also require channel_write_enabled; when enabled, writes land in the knowledge-base body.',
    cellAria: (surface, tier, decision) => `${surface} · ${tier}: ${decision}`,
  },
};

export default function CapabilityGateway({ locale }: Props) {
  const s = STR[locale] ?? STR['zh-CN'];
  const [reduced, setReduced] = useState(false);
  // Active cell as [row, col], or null when nothing is selected.
  const [active, setActive] = useState<[number, number] | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const activeDecision: Decision | null =
    active ? POLICY[active[0]][active[1]] : null;
  const caption =
    active && activeDecision
      ? `${s.surfaces[active[0]]} · ${s.tiers[active[1]]} → ${s.decisions[activeDecision]}`
      : s.hint;

  const transition = reduced ? '' : 'transition-all duration-200';

  return (
    <div className="min-w-0 rounded-2xl border border-ink-600/70 bg-ink-850/60 p-4 backdrop-blur-sm sm:p-5">
      {/* Header: axes + illustrative badge */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-low">
          <span className="text-mid">{s.axisSurface}</span>
          <span className="i-mdi-close text-[10px]" aria-hidden="true" />
          <span className="text-mid">{s.axisTier}</span>
          <span className="i-mdi-close text-[10px]" aria-hidden="true" />
          <span className="text-mid">{s.axisDecision}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
          <span className="i-mdi-flask-outline text-xs" aria-hidden="true" />
          {s.illustrative}
        </span>
      </div>

      {/* Matrix — scrolls horizontally on small screens */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="min-w-[30rem]">
          {/* Column headers */}
          <div className="grid grid-cols-[7.5rem_repeat(4,minmax(0,1fr))] gap-2">
            <div aria-hidden="true" />
            {s.tiers.map((tier) => (
              <div
                key={tier}
                className="px-1 pb-2 text-center text-[11px] font-semibold leading-tight text-mid"
              >
                {tier}
              </div>
            ))}
          </div>

          {/* Rows */}
          {POLICY.map((row, r) => (
            <div
              key={r}
              className="mb-2 grid grid-cols-[7.5rem_repeat(4,minmax(0,1fr))] items-stretch gap-2"
            >
              {/* Row label */}
              <div className="flex flex-col justify-center rounded-xl border border-ink-700/70 bg-ink-900/50 px-3 py-2.5">
                <span className="text-xs font-semibold text-hi">{s.surfaces[r]}</span>
                <span className="mt-0.5 text-[10px] leading-tight text-low">
                  {s.surfaceHints[r]}
                </span>
              </div>

              {/* Decision cells */}
              {row.map((decision, c) => {
                const isActive = active && active[0] === r && active[1] === c;
                const style = DECISION_STYLE[decision];
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={s.cellAria(s.surfaces[r], s.tiers[c], s.decisions[decision])}
                    aria-pressed={!!isActive}
                    onMouseEnter={() => setActive([r, c])}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive([r, c])}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive([r, c])}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 ${transition} ${style.cell} ${
                      isActive ? `ring-2 ${style.ring} ${reduced ? '' : '-translate-y-0.5'}` : 'ring-0'
                    } ${active && !isActive ? 'opacity-60' : 'opacity-100'}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden="true" />
                    <span className="text-[10px] font-semibold leading-none">
                      {s.decisions[decision]}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Live caption */}
      <div
        className="mt-3 flex min-h-[2.75rem] items-center gap-2 rounded-xl border border-ink-600/60 bg-ink-900/50 px-3.5 py-2.5"
        aria-live="polite"
      >
        {activeDecision ? (
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${DECISION_STYLE[activeDecision].dot}`}
            aria-hidden="true"
          />
        ) : (
          <span className="i-mdi-cursor-default-click-outline shrink-0 text-sm text-low" aria-hidden="true" />
        )}
        <span className={`text-xs font-medium ${activeDecision ? 'text-hi' : 'text-mid'}`}>
          {caption}
        </span>
      </div>

      {/* Current write-back policy — separate from this illustrative matrix */}
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/10 px-3.5 py-3">
        <span className="i-mdi-shield-edit-outline mt-0.5 shrink-0 text-base text-warning" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-mid">{s.writebackPolicy}</p>
      </div>

      {/* Decision legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {(['allow', 'confirm', 'deny'] as Decision[]).map((d) => (
          <span key={d} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-low">
            <span className={`h-2 w-2 rounded-full ${DECISION_STYLE[d].dot}`} aria-hidden="true" />
            {s.decisions[d]}
          </span>
        ))}
      </div>
    </div>
  );
}
