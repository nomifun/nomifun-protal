import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n';

/**
 * OpenApiTabs — interactive "open capability" island for the 开放能力 pillar.
 *
 * Three tabs (MCP / REST / OpenAPI), each a dark code block with pink/violet
 * syntax accents. Switching a tab plays a subtle typewriter reveal of the code
 * (a clip-path/opacity wipe per line). Honors `prefers-reduced-motion`: the
 * code is shown in full instantly and no timers are started.
 *
 * Self-contained — no network, all labels/captions keyed by `locale`. The CODE
 * itself is identical across locales (only labels & captions translate). Timers
 * are cleaned up on unmount / tab switch.
 */

interface Props {
  locale: Locale;
}

type TabId = 'mcp' | 'rest' | 'openapi';

/** A single styled token in a code line. */
type Tok = { t: string; c?: 'key' | 'method' | 'str' | 'punc' | 'flag' | 'comment' | 'host' };

/** Self-contained bilingual labels & captions (code is shared, see CODE). */
const STR: Record<Locale, {
  tabs: { id: TabId; label: string; hint: string }[];
  notes: Record<TabId, string>;
  illustrative: string;
  ariaCopy: string;
}> = {
  'zh-CN': {
    tabs: [
      { id: 'mcp', label: 'MCP', hint: '全量 Remote 能力面' },
      { id: 'rest', label: 'REST', hint: '/v1 适配器' },
      { id: 'openapi', label: 'OpenAPI', hint: '3.1 规范导出' },
    ],
    notes: {
      mcp: 'MCP Streamable-HTTP · 全量 Remote 能力面',
      rest: 'REST 适配器 · /v1/openapi.json（OpenAPI 3.1） · 流式走 SSE',
      openapi: '把全部能力导入任意 OpenAPI 客户端',
    },
    illustrative: '示意调用 · 以 companion-token 鉴权',
    ariaCopy: '代码示例',
  },
  'en-US': {
    tabs: [
      { id: 'mcp', label: 'MCP', hint: 'Full Remote surface' },
      { id: 'rest', label: 'REST', hint: '/v1 adapter' },
      { id: 'openapi', label: 'OpenAPI', hint: '3.1 export' },
    ],
    notes: {
      mcp: 'MCP Streamable-HTTP · full Remote capability surface',
      rest: 'REST adapter · /v1/openapi.json (OpenAPI 3.1) · streaming via SSE',
      openapi: 'Import every capability into any OpenAPI client',
    },
    illustrative: 'Illustrative calls · authenticated with companion-token',
    ariaCopy: 'Code sample',
  },
};

/** Token color map → static UnoCSS classes. */
const TOK_CLASS: Record<NonNullable<Tok['c']>, string> = {
  method: 'text-pink-400 font-semibold',
  host: 'text-violet-300',
  key: 'text-pink-300',
  str: 'text-success',
  flag: 'text-violet-300',
  punc: 'text-low',
  comment: 'text-low italic',
};

/**
 * Code content per tab. IDENTICAL across locales — only the surrounding labels
 * translate (see STR). Each entry is an array of lines; each line is an array
 * of styled tokens.
 */
const CODE: Record<TabId, Tok[][]> = {
  mcp: [
    [{ t: 'POST', c: 'method' }, { t: ' https://' }, { t: '<host>', c: 'host' }, { t: '/mcp' }],
    [{ t: 'Authorization:', c: 'key' }, { t: ' Bearer ' }, { t: '<companion-token>', c: 'str' }],
    [{ t: 'Content-Type:', c: 'key' }, { t: ' application/json' }],
    [{ t: '' }],
    [{ t: '{', c: 'punc' }],
    [{ t: '  "method"', c: 'key' }, { t: ': ', c: 'punc' }, { t: '"tools/call"', c: 'str' }, { t: ',', c: 'punc' }],
    [{ t: '  "params"', c: 'key' }, { t: ': { ', c: 'punc' }, { t: '"name"', c: 'key' }, { t: ': ', c: 'punc' }, { t: '"nomi_agent_run"', c: 'str' }, { t: ' }', c: 'punc' }],
    [{ t: '}', c: 'punc' }],
    [{ t: '' }],
    [{ t: '# Streamable-HTTP · 全量 Remote 能力面', c: 'comment' }],
  ],
  rest: [
    [{ t: '# 列出全部工具', c: 'comment' }],
    [{ t: 'curl', c: 'method' }, { t: ' -H ', c: 'flag' }, { t: '"Authorization: Bearer <token>"', c: 'str' }, { t: ' \\', c: 'punc' }],
    [{ t: '     https://' }, { t: '<host>', c: 'host' }, { t: '/v1/tools' }],
    [{ t: '' }],
    [{ t: '# 委派一次 do-work（流式 SSE）', c: 'comment' }],
    [{ t: 'curl', c: 'method' }, { t: ' -X ', c: 'flag' }, { t: 'POST' }, { t: ' \\', c: 'punc' }],
    [{ t: '     https://' }, { t: '<host>', c: 'host' }, { t: '/v1/tools/nomi_agent_run' }, { t: ' \\', c: 'punc' }],
    [{ t: '     -d ', c: 'flag' }, { t: '\'{"prompt":"..."}\'', c: 'str' }],
  ],
  openapi: [
    [{ t: 'GET', c: 'method' }, { t: ' https://' }, { t: '<host>', c: 'host' }, { t: '/v1/openapi.json' }],
    [{ t: '' }],
    [{ t: '{', c: 'punc' }],
    [{ t: '  "openapi"', c: 'key' }, { t: ': ', c: 'punc' }, { t: '"3.1.0"', c: 'str' }, { t: ',', c: 'punc' }],
    [{ t: '  "info"', c: 'key' }, { t: ': { ', c: 'punc' }, { t: '"title"', c: 'key' }, { t: ': ', c: 'punc' }, { t: '"NomiFun REST"', c: 'str' }, { t: ' },', c: 'punc' }],
    [{ t: '  "paths"', c: 'key' }, { t: ': { ', c: 'punc' }, { t: '"/v1/tools"', c: 'str' }, { t: ': { … }, ', c: 'punc' }, { t: '/* 平台能力 */', c: 'comment' }],
    [{ t: '}', c: 'punc' }],
    [{ t: '' }],
    [{ t: '# 把全部能力导入任意 OpenAPI 客户端', c: 'comment' }],
  ],
};

function lineKey(tab: TabId, i: number) {
  return `${tab}-${i}`;
}

export default function OpenApiTabs({ locale }: Props) {
  const s = STR[locale] ?? STR['zh-CN'];

  const [active, setActive] = useState<TabId>('mcp');
  // How many lines of the active tab are revealed (typewriter reveal by line).
  const [shown, setShown] = useState(0);
  const [reduced, setReduced] = useState(false);

  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Track reduced-motion preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // On tab change (or first mount), reveal lines one by one — unless reduced.
  useEffect(() => {
    clearTimers();
    const total = CODE[active].length;
    if (reduced) {
      setShown(total);
      return;
    }
    setShown(0);
    for (let i = 1; i <= total; i++) {
      const id = window.setTimeout(() => setShown(i), i * 75);
      timers.current.push(id);
    }
    return clearTimers;
  }, [active, reduced]);

  // Final cleanup on unmount.
  useEffect(() => clearTimers, []);

  const lines = CODE[active];

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-ink-600/70 bg-ink-850/60 backdrop-blur-sm">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label={s.ariaCopy}
        className="flex min-w-0 items-stretch gap-1 overflow-x-auto border-b border-ink-700/70 bg-ink-900/50 p-1.5"
      >
        {s.tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={`group flex min-w-[7rem] flex-1 flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left transition-colors duration-200 sm:min-w-0 sm:px-3.5 ${
                isActive
                  ? 'bg-ink-800/90 shadow-[0_0_24px_-10px_rgba(255,111,145,0.45)]'
                  : 'hover:bg-ink-800/50'
              }`}
            >
              <span
                className={`text-sm font-semibold tracking-tight ${
                  isActive ? 'text-grad-pink' : 'text-mid group-hover:text-hi'
                }`}
              >
                {tab.label}
              </span>
              <span className="text-[10px] font-medium leading-tight text-low sm:text-[11px]">
                {tab.hint}
              </span>
            </button>
          );
        })}
      </div>

      {/* Code block */}
      <div className="relative">
        {/* faux window dots */}
        <div className="flex items-center gap-1.5 border-b border-ink-800/80 bg-ink-950/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/60" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" aria-hidden="true" />
          <span className="ml-2 truncate text-[11px] font-medium text-low">{s.illustrative}</span>
        </div>

        <pre
          aria-label={s.ariaCopy}
          className="max-w-full overflow-x-auto bg-ink-950 px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]"
        >
          <code className="block">
            {lines.map((line, i) => {
              const visible = i < shown;
              const isLast = visible && i === shown - 1 && shown < lines.length;
              return (
                <span
                  key={lineKey(active, i)}
                  className={`block whitespace-pre ${
                    visible ? (reduced ? '' : 'oat-line') : 'opacity-0'
                  }`}
                >
                  {line.map((tok, j) =>
                    tok.c ? (
                      <span key={j} className={TOK_CLASS[tok.c]}>
                        {tok.t}
                      </span>
                    ) : (
                      <span key={j} className="text-mid">
                        {tok.t}
                      </span>
                    )
                  )}
                  {/* keep empty lines from collapsing */}
                  {line.length === 1 && line[0].t === '' ? ' ' : ''}
                  {isLast && !reduced ? <span className="oat-caret">▍</span> : null}
                </span>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Caption / note for the active tab */}
      <div className="flex items-start gap-2 border-t border-ink-700/70 bg-ink-900/40 px-4 py-3">
        <span className="i-mdi-information-outline mt-0.5 shrink-0 text-sm text-violet-300" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-mid">{s.notes[active]}</p>
      </div>

      <style>{`
        @keyframes oat-line-kf {
          0% { opacity: 0; transform: translateY(3px); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .oat-line { animation: oat-line-kf 0.28s ease-out both; }
        @keyframes oat-caret-kf {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .oat-caret { display: inline-block; margin-left: 1px; color: #FF9FB4; animation: oat-caret-kf 0.9s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .oat-line, .oat-caret { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </div>
  );
}
