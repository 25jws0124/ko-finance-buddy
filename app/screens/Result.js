'use client';

import { useState } from 'react';
import { AppBar, CtaBar, SourceList, Accordion, SectionTitle } from '../ui';
import { fmtDate } from '@/lib/i18n';

/** 판정 결과 화면. status === 'abstain' 이면 Abstain 화면을 렌더한다. */
export default function Result({ s, lang, visa, task, verdict, db, onBack, onNext }) {
  const [open, setOpen] = useState(null);

  const summary = `${s.visa[visa].title} · ${s.task[task]}`;

  if (verdict.status === 'abstain') {
    return <Abstain s={s} summary={summary} verdict={verdict} db={db} onBack={onBack} />;
  }

  const headline = buildHeadline(s, lang, task, verdict);

  return (
    <>
      <div className="scroll">
        <AppBar title={s.resultTitle} onBack={onBack} />
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 12 }}>
          {summary}
        </div>

        <div className="badge ok">
          <span className="badge-dot" />
          <span className="badge-text">{s.eligible[verdict.eligibility] ?? verdict.eligibility}</span>
        </div>

        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1.4,
            letterSpacing: '-0.7px',
            color: 'var(--ink)',
            marginBottom: 18,
            whiteSpace: 'pre-line',
          }}
        >
          {headline}
        </div>

        {/* 한도 비교 바 — limit_release 전용 */}
        {task === 'limit_release' ? (
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-4)', marginBottom: 14 }}>
              {s.limitCardLabel}
            </div>
            <Bar label={s.limitNow} value={s.limitNowValue} pct={22} color="var(--bar-now)" />
            <div style={{ height: 12 }} />
            <Bar
              label={s.limitAfter}
              value={s.limitAfterValue}
              pct={100}
              color="var(--teal-600)"
              valueColor="var(--teal-800)"
            />
          </div>
        ) : null}

        {/* 함정 카드 — rules.json 의 risk_note */}
        {verdict.risk_note ? (
          <div style={{ background: 'var(--warn-bg)', borderRadius: 20, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
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
                }}
              >
                !
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--warn-700)' }}>
                {s.trapTitle}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6, color: 'var(--warn-800)' }}>
              {verdict.risk_note}
            </div>
          </div>
        ) : null}

        <div style={{ height: 22 }} />
        <Accordion
          q={s.faq1Q}
          a={s.faq1A}
          open={open === 1}
          onToggle={() => setOpen(open === 1 ? null : 1)}
        />
        {verdict.why_branch ? (
          <Accordion
            q={s.faq2Q}
            a={verdict.why_branch}
            open={open === 2}
            onToggle={() => setOpen(open === 2 ? null : 2)}
          />
        ) : null}

        <SectionTitle>{s.sourcesTitle}</SectionTitle>
        <SourceList sources={verdict.sources} s={s} />

        <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 14, lineHeight: 1.6 }}>
          {s.noRecommendFoot}
        </div>
      </div>

      <CtaBar label={s.ctaResult} onClick={onNext} />
    </>
  );
}

function Bar({ label, value, pct, color, valueColor }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: valueColor ?? 'var(--ink-3)' }}>
          {value}
        </span>
      </div>
      <div style={{ height: 14, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

/** 헤드라인은 rules.json 의 판정 결과에서 생성한다. 없는 정보는 만들지 않는다. */
function buildHeadline(s, lang, task, v) {
  const n = v.required_docs.length;
  if (lang === 'en') {
    return v.branch_required
      ? `Bring ${n} documents\nand go to a branch`
      : `Bring ${n} documents\nand you are set`;
  }
  if (lang === 'vi') {
    return v.branch_required
      ? `Mang theo ${n} giấy tờ\nvà đến chi nhánh`
      : `Chuẩn bị ${n} giấy tờ\nlà xong`;
  }
  return v.branch_required
    ? `서류 ${n}가지를 챙겨\n영업점에 가면 됩니다`
    : `서류 ${n}가지만 챙기면\n됩니다`;
}

/** ── ABSTAIN — 오류가 아니라 설계다. 레이아웃·여백은 정상 결과와 동일하게 유지한다. ── */
function Abstain({ s, summary, verdict, db, onBack }) {
  const unverified = db.rulesTotal - db.rulesVerified;
  return (
    <>
      <div className="scroll">
        <AppBar title={s.resultTitle} onBack={onBack} />
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', marginBottom: 12 }}>
          {summary}
        </div>

        <div className="badge abstain">
          <span className="badge-dot" />
          <span className="badge-text">{s.abstainBadge}</span>
        </div>

        <div
          style={{
            fontSize: 25,
            fontWeight: 800,
            lineHeight: 1.42,
            letterSpacing: '-0.7px',
            color: 'var(--ink-2)',
            marginBottom: 14,
            whiteSpace: 'pre-line',
          }}
        >
          {s.abstainHead}
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-4)', marginBottom: 22 }}>
          {s.abstainBody}
        </div>

        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 18,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-4)', marginBottom: 12 }}>
            {s.abstainWhereLabel}
          </div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700 }}>{s.abstainCenter}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 2 }}>
              {s.abstainCenterSub}
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border-3)', margin: '12px 0' }} />
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700 }}>{s.abstainBank}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 2 }}>{s.abstainBankSub}</div>
          </div>
        </div>

        <div style={{ background: 'var(--surface-mute)', borderRadius: 20, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-4)', marginBottom: 6 }}>
            {s.abstainWhyLabel}
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-3)' }}>
            {s.abstainWhy(unverified, db.rulesTotal)}
          </div>
        </div>

        <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 14, lineHeight: 1.6 }}>
          {s.abstainFoot(fmtDate(verdict.checked_at ?? db.checkedAt))}
        </div>
      </div>

      <div className="ctabar">
        <a
          href="tel:1345"
          className="cta"
          style={{ background: 'var(--abstain-cta)', color: '#fff', textDecoration: 'none' }}
        >
          {s.abstainCta}
        </a>
        <div className="cta-hint">{s.abstainCtaHint}</div>
      </div>
    </>
  );
}
