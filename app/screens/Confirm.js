'use client';

import { useState } from 'react';
import { AppBar, Progress, CtaBar, ScamCard } from '../ui';
import { fmtDate } from '@/lib/i18n';

export default function Confirm({ s, lang, visa, task, verdict, checks, scams, db, onBack, onNext }) {
  const [saving, setSaving] = useState(false);
  const docs = verdict.required_docs ?? [];
  const done = checks.filter(Boolean).length;

  const firstSource = verdict.sources?.[0];

  const rows = [
    { k: s.sumSituation, v: `${visa} · ${s.task[task]}` },
    {
      k: s.sumVerdict,
      v: s.eligible[verdict.eligibility] ?? verdict.eligibility,
      accent: true,
    },
    { k: s.sumPrep, v: s.sumPrepValue(done, docs.length) },
    { k: s.sumVisit, v: verdict.branch_required ? s.visitNeeded : s.visitNotNeeded },
  ];

  // rules.json 에 없는 값(예상 소요·수수료)은 타일을 아예 렌더하지 않는다.
  const tiles = [
    verdict.branch_required
      ? { label: s.tileHow, value: s.tileHowValue, bg: 'var(--surface-mute)', fg: 'var(--ink)' }
      : null,
    task === 'limit_release'
      ? {
          label: s.tileAfter,
          value: s.tileAfterValue,
          bg: 'var(--teal-050)',
          fg: 'var(--teal-800)',
          bold: true,
        }
      : null,
  ].filter(Boolean);

  function save() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onNext();
    }, 700);
  }

  return (
    <>
      <div className="scroll">
        <AppBar title={s.confirmTitle} onBack={onBack} />
        <Progress step={2} label={s.stepOf(2)} />

        <div
          style={{
            border: '1px solid var(--teal-border)',
            background: 'var(--teal-025)',
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
          }}
        >
          {rows.map((r, i) => (
            <div
              key={r.k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '9px 0',
                borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--teal-divider)',
              }}
            >
              <span style={{ fontSize: 14, color: 'var(--ink-4)' }}>{r.k}</span>
              <span
                style={{
                  fontSize: 14.5,
                  fontWeight: r.accent ? 800 : 700,
                  color: r.accent ? 'var(--teal-600)' : 'var(--ink)',
                  textAlign: 'right',
                }}
              >
                {r.v}
              </span>
            </div>
          ))}
        </div>

        {tiles.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {tiles.map((t) => (
              <div key={t.label} style={{ background: t.bg, borderRadius: 16, padding: 14 }}>
                <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginBottom: 6 }}>
                  {t.label}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: t.bold ? 800 : 700,
                    color: t.fg,
                    whiteSpace: 'pre-line',
                    lineHeight: 1.4,
                  }}
                >
                  {t.value}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <ScamCard patterns={scams} lang={lang} title={s.scamTitle} />

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 14,
            marginTop: 20,
            fontSize: 12.5,
            color: 'var(--ink-4)',
            lineHeight: 1.7,
          }}
        >
          {firstSource ? (
            <>
              {s.evidenceFootLead}: {firstSource.org} — {firstSource.title}
              {firstSource.url && firstSource.url !== 'TODO' ? (
                <>
                  {' · '}
                  <a href={firstSource.url} target="_blank" rel="noopener noreferrer">
                    {s.srcOpen}
                  </a>
                </>
              ) : null}
              <br />
            </>
          ) : null}
          {s.evidenceFoot(fmtDate(verdict.checked_at ?? db.checkedAt))}
        </div>
      </div>

      <CtaBar
        label={saving ? s.ctaConfirmLoading : s.ctaConfirm}
        loading={saving}
        onClick={save}
      />
    </>
  );
}
