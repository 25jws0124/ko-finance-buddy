'use client';

import { docName } from '@/lib/i18n';

export default function Done({ s, lang, task, verdict, checks, onHome }) {
  const docs = verdict.required_docs ?? [];
  const checkedDocs = docs.filter((_, i) => checks[i]);
  const list = (checkedDocs.length ? checkedDocs : docs).map((d) => d.ko).join(' · ');

  // 창구에서 그대로 보여주는 문장이므로 항상 한국어다.
  const script = s.tellerScript[task];

  function saveAsImage() {
    // 외부 라이브러리 없이: 인쇄 대화상자에서 "PDF로 저장"을 쓰도록 안내한다.
    window.print();
  }

  return (
    <div className="scroll" style={{ paddingTop: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 99,
            background: 'var(--teal-050)',
            color: 'var(--teal-600)',
            fontSize: 38,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'popin .45s ease both',
          }}
        >
          ✓
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '-0.6px',
            marginTop: 18,
            marginBottom: 10,
          }}
        >
          {s.doneTitle}
        </div>
        <div
          style={{
            fontSize: 15.5,
            color: 'var(--ink-4)',
            lineHeight: 1.6,
            maxWidth: 300,
            margin: '0 auto 24px',
          }}
        >
          {s.doneSub(checkedDocs.length || docs.length)}
        </div>
      </div>

      {/* ★ 창구 제시 카드 — 이 서비스의 핵심 장면 */}
      <div
        style={{
          border: '1px solid var(--teal-border)',
          background: 'var(--teal-025)',
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--teal-600)', marginBottom: 10 }}>
          {s.showTellerLabel}
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            lineHeight: 1.6,
            letterSpacing: '-0.3px',
            color: 'var(--ink)',
            whiteSpace: 'pre-line',
          }}
        >
          {script}
        </div>
        {list ? (
          <div style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 12, lineHeight: 1.6 }}>
            {s.doneDocs(list)}
          </div>
        ) : null}
      </div>

      <button
        onClick={saveAsImage}
        style={{
          width: '100%',
          minHeight: 52,
          borderRadius: 16,
          border: '1.5px solid var(--teal-600)',
          color: 'var(--teal-600)',
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {s.saveImage}
      </button>
      <button
        onClick={onHome}
        style={{
          width: '100%',
          minHeight: 52,
          borderRadius: 16,
          background: 'var(--surface-mute)',
          color: 'var(--ink-2)',
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {s.goHome}
      </button>

      <div
        style={{
          fontSize: 12.5,
          color: 'var(--ink-5)',
          textAlign: 'center',
          marginTop: 18,
          lineHeight: 1.6,
        }}
      >
        {s.doneFoot}
      </div>
    </div>
  );
}
