'use client';

// 여러 화면이 함께 쓰는 작은 조각들. 색상은 전부 globals.css 의 CSS 변수를 참조한다.

import { fmtDate } from '@/lib/i18n';

export function AppBar({ title, onBack }) {
  return (
    <div className="appbar">
      {onBack ? (
        <button className="back" onClick={onBack} aria-label="뒤로 가기">
          ‹
        </button>
      ) : null}
      <div className="appbar-title">{title}</div>
    </div>
  );
}

export function Progress({ step, label }) {
  return (
    <div className="progress-row">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${step * 50}%` }} />
      </div>
      <div className="progress-label">{label}</div>
    </div>
  );
}

export function CtaBar({ label, hint, onClick, disabled, loading, variant }) {
  const style =
    variant === 'abstain' && !disabled ? { background: 'var(--abstain-cta)' } : undefined;
  return (
    <div className="ctabar">
      <button
        className="cta"
        onClick={onClick}
        disabled={disabled || loading}
        style={loading ? { background: 'var(--teal-700)' } : style}
      >
        {loading ? <span className="spinner white" /> : null}
        {label}
      </button>
      {hint ? <div className="cta-hint">{hint}</div> : null}
    </div>
  );
}

/** evidence 인용 — 항상 한국어 원문 그대로. 번역하지 않는다. */
export function Quote({ label, text, borderColor, color }) {
  return (
    <div className="quote" style={{ borderLeftColor: borderColor, color }}>
      <span className="quote-label">{label}</span>
      “{text}”
    </div>
  );
}

export function SectionTitle({ children, style }) {
  return (
    <div
      style={{
        fontSize: 14.5,
        fontWeight: 700,
        color: 'var(--ink)',
        margin: '22px 0 10px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** 출처 카드 목록. verified 여부에 따라 시각적으로 다르게, quote 도 verified 만 보여준다. */
export function SourceList({ sources, s }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sources.map((src) => {
        const ok = src.verified;
        const hasUrl = src.url && src.url !== 'TODO';
        return (
          <div
            key={src.id}
            style={{
              border: `1px solid ${ok ? 'var(--teal-border)' : 'var(--border)'}`,
              background: ok ? 'var(--teal-025)' : 'var(--surface-flat)',
              borderRadius: 16,
              padding: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <span
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 99,
                  background: ok ? 'var(--teal-600)' : '#D5DAD9',
                  color: '#fff',
                  fontSize: 11,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                {ok ? '✓' : '–'}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: ok ? 'var(--teal-600)' : 'var(--ink-5)',
                }}
              >
                {ok ? s.srcVerified : s.srcUnverified}
              </span>
            </div>

            {/* 기관명·문서명은 번역하지 않는다 */}
            <div
              style={{
                fontSize: 14.5,
                fontWeight: 600,
                color: ok ? 'var(--ink)' : 'var(--ink-4)',
                lineHeight: 1.5,
              }}
            >
              {src.org} — {src.title}
            </div>

            {ok && src.quote ? (
              <Quote
                label={s.evidenceLabel}
                text={src.quote}
                borderColor="var(--teal-quote)"
                color="var(--teal-muted)"
              />
            ) : null}

            <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 9 }}>
              {ok ? (
                <>
                  {s.srcCheckedAt(fmtDate(src.checked_at))}
                  {hasUrl ? (
                    <>
                      {' · '}
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {s.srcOpen}
                      </a>
                    </>
                  ) : null}
                </>
              ) : (
                s.srcUnverifiedNote
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Accordion({ q, a, open, onToggle }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{q}</span>
        <span style={{ fontSize: 13, color: 'var(--ink-5)' }}>{open ? '▲' : '▼'}</span>
      </button>
      <div
        style={{
          maxHeight: open ? 260 : 0,
          overflow: 'hidden',
          transition: 'max-height .25s ease',
        }}
      >
        <div
          style={{
            fontSize: 14.5,
            color: 'var(--ink-3)',
            lineHeight: 1.65,
            paddingTop: open ? 10 : 0,
          }}
        >
          {a}
        </div>
      </div>
    </div>
  );
}

/** 사기 주의 카드 */
export function ScamCard({ patterns, lang, title }) {
  if (!patterns || patterns.length === 0) return null;
  return (
    <div
      style={{
        background: 'var(--warn-bg)',
        borderRadius: 20,
        padding: 18,
        marginTop: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: 'var(--warn-600)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          !
        </span>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--warn-700)' }}>{title}</span>
      </div>
      {patterns.map((p, i) => (
        <div key={p.id} style={{ marginTop: i === 0 ? 0 : 14 }}>
          <div
            style={{
              fontSize: 15.5,
              fontWeight: 700,
              color: 'var(--warn-800)',
              marginBottom: 6,
            }}
          >
            {p.title[lang] ?? p.title.ko}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--warn-800)' }}>
            {p.body[lang] ?? p.body.ko}
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--warn-muted-2)',
              marginTop: 8,
              paddingLeft: 10,
              borderLeft: '3px solid var(--warn-quote)',
            }}
          >
            {p.what_to_do[lang] ?? p.what_to_do.ko}
          </div>
        </div>
      ))}
    </div>
  );
}
