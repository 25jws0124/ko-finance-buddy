'use client';

import { useRef, useState } from 'react';
import { AppBar, Progress, CtaBar, Quote } from '../ui';
import { docName, docNote } from '@/lib/i18n';

/** 긴 변 1280px 이하 / JPEG q0.8 로 축소한 뒤 순수 base64 로 변환.
 *  (Vercel 요청 바디 제한 + Gemini 무료 티어 부담 때문. 이 처리 없으면 실제 폰 사진에서 실패한다.) */
async function resizeToBase64(file, maxEdge = 1280, quality = 0.8) {
  const dataUrl = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => rej(new Error('read fail'));
    fr.readAsDataURL(file);
  });

  const img = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error('decode fail'));
    im.src = dataUrl;
  });

  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  const out = canvas.toDataURL('image/jpeg', quality);
  const base64 = out.split(',')[1];
  // 이미지 내용은 절대 출력하지 않는다. 크기만 KB 로 남긴다.
  if (typeof console !== 'undefined') {
    console.log(`[analyze] resized image ${Math.round((base64.length * 3) / 4 / 1024)}KB`);
  }
  return { base64, preview: out };
}

export default function Prep({ s, lang, visa, task, verdict, checks, setChecks, onBack, onNext }) {
  const docs = verdict.required_docs ?? [];
  const done = checks.filter(Boolean).length;

  const [phase, setPhase] = useState('idle'); // idle | loading | done | unreadable | error
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const fileRef = useRef(null);

  const toggle = (i) => setChecks(checks.map((c, k) => (k === i ? !c : c)));

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhase('loading');
    setResult(null);
    try {
      const { base64, preview: pv } = await resizeToBase64(file);
      setPreview(pv);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mime: 'image/jpeg', lang, visa, task }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data?.error || s.errGeneric);
        setPhase('error');
        return;
      }
      if (data.unreadable) {
        setPhase('unreadable');
        return;
      }
      setResult(data);
      setPhase('done');
    } catch {
      setErrMsg(s.errGeneric);
      setPhase('error');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const retake = () => {
    setPhase('idle');
    setPreview(null);
    setResult(null);
    setErrMsg('');
  };

  const total = result
    ? result.todo.length + result.money_watch.length + result.need_check.length
    : 0;

  return (
    <>
      <div className="scroll">
        <AppBar title={s.prepTitle} onBack={onBack} />
        <Progress step={1} label={s.stepOf(1)} />

        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
          {s.prepCount(done, docs.length)}
        </div>
        <div style={{ fontSize: 14.5, color: 'var(--ink-4)', marginBottom: 16 }}>
          {done > 0 ? s.prepSubSome : s.prepSubNone}
        </div>

        {/* ── 체크리스트 (rules.json 의 required_docs 에서 생성) ── */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 22,
          }}
        >
          {docs.map((d, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              aria-pressed={!!checks[i]}
              style={{
                width: '100%',
                minHeight: 60,
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                padding: '12px 16px',
                textAlign: 'left',
                background: checks[i] ? 'var(--teal-025)' : '#FFFFFF',
                borderBottom: i === docs.length - 1 ? 'none' : '1px solid var(--border-3)',
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 99,
                  flex: 'none',
                  border: `1.5px solid ${checks[i] ? 'var(--teal-600)' : 'var(--border-4)'}`,
                  background: checks[i] ? 'var(--teal-600)' : 'transparent',
                  color: '#fff',
                  fontSize: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {checks[i] ? '✓' : ''}
              </span>
              <span>
                {/* 서류 이름은 창구에서 보여줘야 하므로 한국어 유지 + 선택 언어 병기 */}
                <span style={{ fontSize: 16, fontWeight: 600, display: 'block' }}>
                  {docName(d, lang)}
                </span>
                {docNote(d, lang) ? (
                  <span style={{ fontSize: 12.5, color: 'var(--ink-4)', display: 'block', marginTop: 2 }}>
                    {docNote(d, lang)}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>

        {/* ── 문서 분석 ── */}
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{s.docSectionTitle}</div>
        <div style={{ fontSize: 14.5, color: 'var(--ink-4)', marginBottom: 14 }}>
          {s.docSectionSub}
        </div>

        <input
          ref={fileRef}
          id="doc-photo"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPick}
          className="sr-only"
        />

        {phase === 'idle' ? (
          <label
            htmlFor="doc-photo"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              border: '1.5px dashed var(--teal-dash)',
              background: 'var(--teal-025)',
              borderRadius: 20,
              padding: '28px 20px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'var(--teal-050)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-600)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </span>
            <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--teal-800)' }}>
              {s.uploadLabel}
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>{s.uploadNote}</span>
          </label>
        ) : null}

        {phase === 'loading' ? (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <span className="spinner" />
              <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--teal-800)' }}>
                {s.analyzing}
              </span>
            </div>
            <div className="skel" style={{ width: '100%', marginBottom: 8 }} />
            <div className="skel" style={{ width: '85%', marginBottom: 8 }} />
            <div className="skel" style={{ width: '60%' }} />
          </div>
        ) : null}

        {phase === 'unreadable' || phase === 'error' ? (
          <div
            style={{
              border: '1.5px solid var(--warn-border)',
              background: 'var(--warn-bg-2)',
              borderRadius: 20,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'var(--warn-chip)',
                color: 'var(--warn-600)',
                fontSize: 20,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              !
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--warn-700)', marginBottom: 6 }}>
              {phase === 'error' ? errMsg : s.unreadableTitle}
            </div>
            {phase === 'unreadable' ? (
              <div style={{ fontSize: 14, color: 'var(--warn-muted-2)', lineHeight: 1.6, marginBottom: 14 }}>
                {s.unreadableBody}
              </div>
            ) : (
              <div style={{ height: 10 }} />
            )}
            <label
              htmlFor="doc-photo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 46,
                padding: '0 22px',
                borderRadius: 14,
                background: 'var(--warn-600)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {s.retake}
            </label>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={retake}
                style={{
                  fontSize: 13,
                  color: 'var(--warn-muted)',
                  textDecoration: 'underline',
                }}
              >
                {s.skipPhoto}
              </button>
            </div>
          </div>
        ) : null}

        {phase === 'done' && result ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-600)' }}>
                {s.analyzeDone(total)}
              </span>
              <button
                onClick={retake}
                style={{ fontSize: 12.5, color: 'var(--ink-4)', textDecoration: 'underline' }}
              >
                {s.retake}
              </button>
            </div>

            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                style={{
                  width: '100%',
                  borderRadius: 16,
                  marginBottom: 10,
                  border: '1px solid var(--border)',
                }}
              />
            ) : null}

            <Block
              label={s.blockTodo}
              items={result.todo}
              bg="var(--teal-050)"
              labelColor="var(--teal-600)"
              textColor="var(--teal-900)"
              quoteBorder="var(--teal-quote)"
              quoteColor="var(--teal-muted)"
              evidenceLabel={s.evidenceLabel}
            />
            <Block
              label={s.blockMoney}
              items={result.money_watch}
              bg="var(--warn-bg)"
              labelColor="var(--warn-600)"
              textColor="var(--warn-800)"
              quoteBorder="var(--warn-quote)"
              quoteColor="var(--warn-muted)"
              evidenceLabel={s.evidenceLabel}
            />
            <Block
              label={s.blockNeed}
              items={result.need_check}
              bg="var(--surface-mute)"
              labelColor="var(--ink-4)"
              textColor="var(--ink-2)"
              quoteBorder="var(--border-4)"
              quoteColor="var(--ink-4)"
              evidenceLabel={s.evidenceLabel}
            />

            {result.dropped > 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 10, lineHeight: 1.6 }}>
                {s.droppedNote(result.dropped)}
              </div>
            ) : null}
          </div>
        ) : null}

        <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 14, lineHeight: 1.6 }}>
          {s.uploadFoot}
        </div>
      </div>

      <CtaBar
        label={s.ctaPrep}
        hint={done === 0 ? s.ctaPrepHint : undefined}
        disabled={done === 0}
        onClick={onNext}
      />
    </>
  );
}

function Block({ label, items, bg, labelColor, textColor, quoteBorder, quoteColor, evidenceLabel }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ background: bg, borderRadius: 18, padding: 16, marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: labelColor, marginBottom: 8 }}>
        {label}
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ marginTop: i === 0 ? 0 : 14 }}>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: textColor, lineHeight: 1.55 }}>
            {it.text}
          </div>
          {/* evidence 는 한국어 원문 그대로. 언어를 바꿔도 번역하지 않는다. */}
          <Quote
            label={evidenceLabel}
            text={it.evidence}
            borderColor={quoteBorder}
            color={quoteColor}
          />
        </div>
      ))}
    </div>
  );
}
