import { useEffect, useRef, useState } from 'react';

type Locale = 'zh-CN' | 'en-US';

interface Props {
  locale: Locale;
}

type PersonaId = 'lively' | 'calm' | 'sassy';
type CompanionId = 'mochi' | 'ink' | 'bolt' | 'custom';

/**
 * The 3 current built-in companion characters (+ a custom slot).
 * Source of truth: nomifun-desktop ui/.../companion/characters/index.ts
 *   mochi = mochi bunny (麻薯兔), ink = amber-eyed black cat (琥珀眼黑猫),
 *   bolt = hovering robot (悬浮机器人). Default = mochi.
 * Custom = upload any IP you like, even your own family or pets.
 */
const COMPANION_IDS: CompanionId[] = ['mochi', 'ink', 'bolt', 'custom'];

interface PersonaCopy {
  id: PersonaId;
  label: string;
  reply: string;
}

interface CompanionMeta {
  id: CompanionId;
  name: string;
  style: string;
}

interface Strings {
  choose: string;
  companions: Record<CompanionId, CompanionMeta>;
  persona: { heading: string; items: PersonaCopy[] };
  reply: { speaking: string };
  skill: {
    heading: string;
    sub: string;
    name: string;
    namePrefix: string;
    review: string;
    hint: string;
    accept: string;
    reject: string;
  };
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

const STRINGS: Record<Locale, Strings> = {
  'zh-CN': {
    choose: '选择伙伴形象',
    companions: {
      mochi: { id: 'mochi', name: '团子 Mochi', style: '软糯日系 · 麻薯兔' },
      ink: { id: 'ink', name: '墨墨 Ink', style: '东方水墨 · 琥珀眼黑猫' },
      bolt: { id: 'bolt', name: '波特 Bolt', style: '软萌科技 · 悬浮机器人' },
      custom: { id: 'custom', name: '你的专属伙伴', style: '任意 IP · 家人 · 宠物' },
    },
    persona: {
      heading: '人格预设',
      items: [
        { id: 'lively', label: '活泼', reply: '搞定啦！还有什么想一起做的，尽管说～' },
        { id: 'calm', label: '沉静', reply: '已处理完成。需要我继续下一步吗。' },
        { id: 'sassy', label: '俏皮', reply: '喏，弄好了——是不是又被我惊艳到了？' },
      ],
    },
    reply: { speaking: '正在说' },
    skill: {
      heading: '技能进化',
      sub: '从工具调用序列中自动挖掘',
      name: 'weekly-report-digest',
      namePrefix: '整理周报',
      review: '与你商议',
      hint: '已生成可评审的 SKILL.md，确认后才会启用',
      accept: '采纳',
      reject: '忽略',
    },
  },
  'en-US': {
    choose: 'Pick a companion',
    companions: {
      mochi: { id: 'mochi', name: 'Mochi', style: 'Soft Japanese · mochi bunny' },
      ink: { id: 'ink', name: 'Ink', style: 'Eastern ink-wash · amber-eyed cat' },
      bolt: { id: 'bolt', name: 'Bolt', style: 'Cozy tech · hovering robot' },
      custom: { id: 'custom', name: 'Your own companion', style: 'Any IP · family · pets' },
    },
    persona: {
      heading: 'Persona preset',
      items: [
        { id: 'lively', label: 'Lively', reply: "All done! What else should we tackle — just say the word~" },
        { id: 'calm', label: 'Calm', reply: 'Handled. Shall I move on to the next step.' },
        { id: 'sassy', label: 'Sassy', reply: "There — wrapped it up. Impressed again, aren't you?" },
      ],
    },
    reply: { speaking: 'now speaking' },
    skill: {
      heading: 'Skill evolution',
      sub: 'auto-mined from tool-call sequences',
      name: 'weekly-report-digest',
      namePrefix: 'Tidy weekly report',
      review: 'Review with you',
      hint: 'A reviewable SKILL.md is generated — enabled only after you confirm',
      accept: 'Accept',
      reject: 'Dismiss',
    },
  },
};

/** Inline-SVG mascots — drawn to mirror the in-app code-drawn characters. */
function Avatar({ id, alt }: { id: CompanionId; alt: string }) {
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" role="img" aria-label={alt}>
      <rect width="80" height="80" rx="18" fill="#16121d" />
      <rect width="80" height="38" rx="18" fill="#ffffff" opacity="0.03" />
      {id === 'mochi' && (
        <g>
          {/* ears */}
          <g className="cd-mochi-ear-l">
            <path d="M30 31 Q25 12 31 9 Q37 13 35 31 Z" fill="#fff6f0" />
            <path d="M31 28 Q28.5 16 32 13 Q34.5 16 33 28 Z" fill="#ffb7c9" />
          </g>
          <g className="cd-mochi-ear-r">
            <path d="M50 31 Q55 12 49 9 Q43 13 45 31 Z" fill="#fff6f0" />
            <path d="M49 28 Q51.5 16 48 13 Q45.5 16 47 28 Z" fill="#ffb7c9" />
          </g>
          {/* soft mochi body */}
          <ellipse cx="40" cy="50" rx="22" ry="19" fill="#fff6f0" />
          <ellipse cx="40" cy="50" rx="22" ry="19" fill="#ffb7c9" opacity="0.16" />
          {/* blush */}
          <ellipse cx="29" cy="53" rx="3.4" ry="2.3" fill="#ffb7c9" opacity="0.85" />
          <ellipse cx="51" cy="53" rx="3.4" ry="2.3" fill="#ffb7c9" opacity="0.85" />
          {/* eyes + mouth */}
          <circle cx="34" cy="48" r="2.5" fill="#2b2b33" />
          <circle cx="46" cy="48" r="2.5" fill="#2b2b33" />
          <path d="M37.5 53 Q40 55.5 42.5 53" stroke="#2b2b33" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      )}
      {id === 'ink' && (
        <g>
          {/* tail */}
          <path className="cd-ink-tail" d="M58 56 Q71 53 66 41 Q63.5 34 59 39" stroke="#2f2c38" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* ears */}
          <path d="M26 31 L29 14 L41 27 Z" fill="#2f2c38" />
          <path d="M54 31 L51 14 L39 27 Z" fill="#2f2c38" />
          <path d="M30 27 L31.5 19 L37 26 Z" fill="#4a4654" />
          <path d="M50 27 L48.5 19 L43 26 Z" fill="#4a4654" />
          {/* body */}
          <ellipse cx="40" cy="49" rx="20" ry="18" fill="#2f2c38" stroke="#4a4654" strokeWidth="1" />
          {/* amber eyes */}
          <ellipse cx="33" cy="48" rx="3.2" ry="4.2" fill="#e8b04b" />
          <ellipse cx="47" cy="48" rx="3.2" ry="4.2" fill="#e8b04b" />
          <ellipse className="cd-ink-pupil" cx="33" cy="48" rx="1.1" ry="3.4" fill="#1a1620" />
          <ellipse className="cd-ink-pupil" cx="47" cy="48" rx="1.1" ry="3.4" fill="#1a1620" />
          {/* nose + whiskers */}
          <path d="M38.6 53 L41.4 53 L40 54.6 Z" fill="#ffb7c9" />
          <path d="M22 50 H30 M22 54 H30 M50 50 H58 M50 54 H58" stroke="#6a6576" strokeWidth="0.8" strokeLinecap="round" />
        </g>
      )}
      {id === 'bolt' && (
        <g>
          <ellipse className="cd-bolt-glow" cx="40" cy="65" rx="15" ry="3.2" fill="#37e0ff" opacity="0.25" />
          {/* antenna */}
          <line x1="40" y1="22" x2="40" y2="13" stroke="#bfeee0" strokeWidth="2" strokeLinecap="round" />
          <circle className="cd-bolt-ant" cx="40" cy="10.5" r="3" fill="#37e0ff" />
          {/* arms */}
          <rect x="17" y="42" width="6" height="14" rx="3" fill="#bfeee0" />
          <rect x="57" y="42" width="6" height="14" rx="3" fill="#bfeee0" />
          {/* head/body */}
          <rect x="24" y="23" width="32" height="34" rx="13" fill="#bfeee0" />
          <rect x="24" y="23" width="32" height="16" rx="13" fill="#ffffff" opacity="0.25" />
          {/* face screen */}
          <rect x="29" y="31" width="22" height="16" rx="6" fill="#0B0A10" />
          <circle className="cd-bolt-eye" cx="36" cy="38" r="2.4" fill="#37e0ff" />
          <circle className="cd-bolt-eye" cx="44" cy="38" r="2.4" fill="#37e0ff" />
          <path d="M36 42.5 Q40 44.5 44 42.5" stroke="#37e0ff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      )}
      {id === 'custom' && (
        <g>
          <rect x="15" y="15" width="50" height="50" rx="15" fill="none" stroke="#FF9FB4" strokeWidth="2" strokeDasharray="5 5" opacity="0.8" />
          {/* heart (family / pets / any IP) */}
          <path d="M40 52 C30 45 28 38 33 34.5 C36.5 32 40 35.5 40 38 C40 35.5 43.5 32 47 34.5 C52 38 50 45 40 52 Z" fill="#FF6F91" />
          {/* plus badge */}
          <circle cx="55" cy="25" r="7.5" fill="#FF6F91" />
          <path d="M55 21.5 V28.5 M51.5 25 H58.5" stroke="#0B0A10" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export default function CompanionDemo({ locale }: Props) {
  const s = STRINGS[locale] ?? STRINGS['zh-CN'];
  const reduced = usePrefersReducedMotion();

  const [companionIdx, setCompanionIdx] = useState(0);
  const [personaIdx, setPersonaIdx] = useState(0);
  const persona = s.persona.items[personaIdx];
  const companionId = COMPANION_IDS[companionIdx];
  const companion = s.companions[companionId];

  // ---- typewriter for the generated skill name ----
  const fullSkill = `${s.skill.namePrefix} · ${s.skill.name}`;
  const [typed, setTyped] = useState('');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    if (reduced) {
      clearAll();
      setTyped(fullSkill);
      return clearAll;
    }
    setTyped('');
    const startId = window.setTimeout(() => {
      for (let i = 1; i <= fullSkill.length; i++) {
        const id = window.setTimeout(() => setTyped(fullSkill.slice(0, i)), i * 55);
        timers.current.push(id);
      }
    }, 600);
    timers.current.push(startId);
    return clearAll;
  }, [fullSkill, reduced]);

  return (
    <div className="cd-root card p-5 sm:p-6">
      <div className="grid gap-5 sm:gap-6 md:grid-cols-[auto_1fr] md:items-center">
        {/* ---- selected avatar ---- */}
        <div className="flex justify-center md:justify-start">
          <div className="cd-bowl relative h-28 w-28 sm:h-32 sm:w-32" data-reduced={reduced || undefined}>
            <div className="cd-glow absolute inset-0 rounded-[28px] blur-2xl" aria-hidden="true" />
            <div className="relative h-full w-full">
              <Avatar id={companionId} alt={companion.name} />
            </div>
          </div>
        </div>

        {/* ---- name + style + reply ---- */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-mono text-lg font-semibold text-grad-pink">{companion.name}</span>
            <span className="text-xs text-low">· {s.reply.speaking}</span>
          </div>
          <p className="mt-0.5 text-xs text-low">{companion.style}</p>

          <p className="cd-reply mt-2.5 min-h-[3rem] text-sm leading-relaxed text-mid sm:text-base" key={`${companionIdx}-${personaIdx}`}>
            {persona.reply}
          </p>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-low">{s.persona.heading}</p>
            <div className="flex flex-wrap gap-2">
              {s.persona.items.map((p, i) => {
                const active = i === personaIdx;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonaIdx(i)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'rounded-full border border-pink-500/50 bg-pink-500/15 px-3.5 py-1.5 text-sm font-medium text-pink-300 transition-all'
                        : 'rounded-full border border-ink-600 bg-ink-700/40 px-3.5 py-1.5 text-sm font-medium text-mid transition-all hover:border-violet-400/50 hover:text-hi'
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---- companion selector ---- */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-low">{s.choose}</p>
        <div className="flex flex-wrap gap-2.5">
          {COMPANION_IDS.map((id, i) => {
            const active = i === companionIdx;
            const meta = s.companions[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCompanionIdx(i)}
                aria-pressed={active}
                aria-label={meta.name}
                title={`${meta.name} · ${meta.style}`}
                className={
                  'h-14 w-14 overflow-hidden rounded-2xl border p-0.5 transition-all ' +
                  (active
                    ? 'border-pink-500/70 shadow-[0_0_22px_-6px_rgba(255,111,145,0.6)]'
                    : 'border-ink-600 opacity-70 hover:opacity-100 hover:border-violet-400/50')
                }
              >
                <Avatar id={id} alt={meta.name} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- skill evolution card ---- */}
      <div className="mt-5 rounded-2xl border border-violet-400/20 bg-ink-900/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="i-mdi-auto-fix text-lg text-violet-300" aria-hidden="true" />
            <span className="text-sm font-semibold text-hi">{s.skill.heading}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <span className="i-mdi-account-check-outline" aria-hidden="true" />
            {s.skill.review}
          </span>
        </div>

        <p className="mt-1 text-xs text-low">{s.skill.sub}</p>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-600/70 bg-ink-950/60 px-3.5 py-2.5 font-mono text-sm">
          <span className="i-mdi-script-text-outline shrink-0 text-pink-400" aria-hidden="true" />
          <span className="truncate text-hi">{typed || ' '}</span>
          {!reduced && typed.length < fullSkill.length && <span className="cd-caret" aria-hidden="true" />}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-mid">{s.skill.hint}</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-success/40 bg-success/10 text-success transition-all hover:bg-success/20"
              aria-label={s.skill.accept}
              title={s.skill.accept}
            >
              <span className="i-mdi-check" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600 bg-ink-700/50 text-mid transition-all hover:border-danger/40 hover:text-danger"
              aria-label={s.skill.reject}
              title={s.skill.reject}
            >
              <span className="i-mdi-close" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .cd-bowl { animation: cd-float 6s ease-in-out infinite; }
        .cd-glow { background: radial-gradient(closest-side, rgba(255,111,145,0.45), transparent); opacity: 0.7; }
        .cd-reply { animation: cd-reply-in 0.4s ease both; }
        .cd-mochi-ear-l { transform-origin: 32px 30px; animation: cd-ear-l 4s ease-in-out infinite; }
        .cd-mochi-ear-r { transform-origin: 48px 30px; animation: cd-ear-r 4s ease-in-out infinite; }
        .cd-ink-tail { transform-origin: 60px 50px; animation: cd-tail 3.4s ease-in-out infinite; }
        .cd-ink-pupil { animation: cd-blinkpupil 5s ease-in-out infinite; }
        .cd-bolt-eye { animation: cd-blinkeye 4.5s step-end infinite; }
        .cd-bolt-ant { animation: cd-antglow 2s ease-in-out infinite; }
        .cd-bolt-glow { animation: cd-hoverglow 3s ease-in-out infinite; }
        .cd-caret { display:inline-block; width:2px; height:1em; background: var(--pink-400,#FF9FB4); margin-left:2px; animation: cd-blink 1s step-end infinite; }
        @keyframes cd-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes cd-ear-l { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-7deg)} }
        @keyframes cd-ear-r { 0%,100%{transform:rotate(0)} 50%{transform:rotate(7deg)} }
        @keyframes cd-tail { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-12deg)} }
        @keyframes cd-blinkpupil { 0%,46%,54%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.2)} }
        @keyframes cd-blinkeye { 0%,92%,100%{opacity:1} 96%{opacity:0.25} }
        @keyframes cd-antglow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes cd-hoverglow { 0%,100%{opacity:0.18; transform:scaleX(0.9)} 50%{opacity:0.32; transform:scaleX(1.1)} }
        @keyframes cd-reply-in { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none} }
        @keyframes cd-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cd-bowl[data-reduced] { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .cd-bowl, .cd-reply, .cd-caret, .cd-mochi-ear-l, .cd-mochi-ear-r, .cd-ink-tail, .cd-ink-pupil, .cd-bolt-eye, .cd-bolt-ant, .cd-bolt-glow { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
