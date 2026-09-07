'use client';

import { CtaBar } from '../ui';
import Logo from '../logo';
import { LANGS, fmtDate } from '@/lib/i18n';
import { VISAS, TASKS } from '@/lib/engine';

const chip = (selected) => ({
  border: `1.5px solid ${selected ? 'var(--teal-600)' : 'var(--border-2)'}`,
  background: selected ? 'var(--teal-050)' : '#FFFFFF',
  color: selected ? 'var(--teal-800)' : 'var(--ink-2)',
  borderRadius: 14,
  transition: 'background .15s ease, border-color .15s ease',
});

export default function Home({ s, lang, setLang, visa, task, toggleVisa, toggleTask, db, onNext }) {
  const picked = (visa ? 1 : 0) + (task ? 1 : 0);
  const ready = picked === 2;

  const heroTitle = ready
    ? `${visa} · ${s.task[task]}`
    : s.heroEmptyTitle;
  const heroSub = ready ? s.heroFullSub : picked === 1 ? s.heroHalfSub : s.heroEmptySub;

  return (
    <>
      <div className="scroll">
        {/* ── 앱바 ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} radius={8} />
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px' }}>
              {s.appName}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }} role="group" aria-label={s.langAria}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                aria-label={l.label}
                style={{
                  padding: '5px 9px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: lang === l.code ? 700 : 600,
                  background: lang === l.code ? 'var(--teal-600)' : 'var(--surface-mute)',
                  color: lang === l.code ? '#fff' : 'var(--ink-4)',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 신뢰 배너 (수치는 getDbStatus 에서) ── */}
        <div
          className="rise rise-1"
          style={{
            display: 'flex',
            gap: 10,
            background: 'var(--teal-050)',
            borderRadius: 14,
            padding: '11px 13px',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 99,
              background: 'var(--teal-600)',
              color: '#fff',
              fontSize: 11,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              marginTop: 1,
            }}
          >
            ✓
          </span>
          <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.55, color: 'var(--teal-800)' }}>
            {s.trustLine1(db.rulesVerified, db.rulesTotal, fmtDate(db.checkedAt))}
            <br />
            <span style={{ color: 'var(--teal-600)' }}>{s.trustLine2}</span>
          </div>
        </div>

        {/* ── Hero ── */}
        <div
          className="rise rise-2 card-soft"
          style={{
            borderRadius: 20,
            padding: 20,
            marginBottom: 22,
            background: ready ? 'var(--teal-050)' : 'var(--surface-mute)',
            border: ready ? '1px solid var(--teal-border-2)' : '1px dashed var(--border-4)',
            transition: 'background .25s ease',
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: ready ? 'var(--ink-4)' : 'var(--ink-5)',
              marginBottom: 6,
            }}
          >
            {s.mySituation}
          </div>
          <div
            style={{
              fontSize: ready ? 25 : 23,
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: '-0.6px',
              color: ready ? 'var(--teal-900)' : 'var(--ink-5)',
              whiteSpace: 'pre-line',
            }}
          >
            {heroTitle}
          </div>
          <div style={{ fontSize: 13.5, color: ready ? 'var(--teal-800)' : 'var(--ink-5)', marginTop: 8 }}>
            {heroSub}
          </div>

          <div className="progress-row" style={{ marginTop: 16, marginBottom: 0 }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${picked * 50}%` }} />
            </div>
            <div className="progress-label">{s.stepOf(picked)}</div>
          </div>
        </div>

        {/* ── 1. 체류자격 ── */}
        <div className="rise rise-3" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>{s.step1}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {VISAS.map((v) => (
            <button
              key={v}
              onClick={() => toggleVisa(v)}
              aria-pressed={visa === v}
              className={visa === v ? 'chip-on' : undefined}
              style={{
                ...chip(visa === v),
                flex: 1,
                minHeight: 52,
                padding: '8px 14px',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700 }}>{s.visa[v].title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>
                {s.visa[v].sub}
              </div>
            </button>
          ))}
        </div>

        {/* ── 2. 금융업무 ── */}
        <div className="rise rise-4" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>{s.step2}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {TASKS.map((k) => (
            <button
              key={k}
              onClick={() => toggleTask(k)}
              aria-pressed={task === k}
              className={task === k ? 'chip-on' : undefined}
              style={{
                ...chip(task === k),
                minHeight: 52,
                padding: '8px 14px',
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.35,
                // 한국어는 단어 중간에서 줄바꿈되면 읽기 어렵다 → 어절 단위로만 끊는다
                wordBreak: 'keep-all',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {s.task[k]}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 12, lineHeight: 1.6 }}>
          {s.privacyFoot}
        </div>

        {/* ── 자주 쓰는 기능 ── */}
        <div style={{ fontSize: 14.5, fontWeight: 700, margin: '24px 0 10px' }}>{s.quick}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { k: 'doc', label: s.quickDoc, bg: 'var(--surface-mute)', chipBg: 'var(--teal-050)', fg: 'var(--ink)', icon: <IconDoc /> },
            { k: 'prep', label: s.quickPrep, bg: 'var(--surface-mute)', chipBg: 'var(--teal-050)', fg: 'var(--ink)', icon: <IconCheck /> },
            { k: 'scam', label: s.quickScam, bg: 'var(--warn-bg)', chipBg: 'var(--warn-chip)', fg: 'var(--warn-700)', icon: <IconWarn /> },
            { k: 'src', label: s.quickSrc, bg: 'var(--surface-mute)', chipBg: 'var(--link-tint)', fg: 'var(--ink)', icon: <IconLink /> },
          ].map((tile) => (
            <button
              key={tile.k}
              onClick={ready ? onNext : undefined}
              disabled={!ready}
              style={{
                background: tile.bg,
                borderRadius: 16,
                padding: 14,
                minHeight: 88,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: ready ? 1 : 0.55,
                cursor: ready ? 'pointer' : 'not-allowed',
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: tile.chipBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: tile.fg,
                }}
              >
                {tile.icon}
              </span>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: tile.fg,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.4,
                }}
              >
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <CtaBar
        label={s.ctaHome}
        hint={ready ? s.ctaHomeHintOn : s.ctaHomeHintOff}
        disabled={!ready}
        onClick={onNext}
      />
    </>
  );
}

/* 아이콘 — 외부 아이콘 라이브러리 없이 인라인 SVG. currentColor 를 따른다. */
const svg = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconDoc() {
  return (
    <svg {...svg}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5-5-6 6" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg {...svg}>
      <path d="M9 11l3 3 8-8" />
      <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}
function IconWarn() {
  return (
    <svg {...svg}>
      <path d="M12 3l9 16H3z" />
      <path d="M12 9v4" />
      <path d="M12 16.5v.5" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg {...svg}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}
