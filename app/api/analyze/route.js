// app/api/analyze/route.js
// LLM 의 역할은 단 하나 — "사용자가 올린 문서 이미지를 읽어 설명한다".
// 판정(비자·자격·서류)은 lib/engine.js 가 하며, 이 파일은 engine 을 import 하지 않는다.

export const runtime = 'nodejs';
export const maxDuration = 60;

// 모델 이름은 구글 쪽 사정으로 바뀐다(신규 사용자에게 구버전이 닫히는 식).
// 그래서 하나로 고정하지 않고, 앞에서부터 순서대로 시도해 처음 성공한 모델을 쓴다.
// .env.local 에 GEMINI_MODEL 을 넣으면 그것을 최우선으로 시도한다.
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-2.5-flash',
].filter(Boolean);

const endpointFor = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

// 한 번 성공한 모델을 기억해 다음 요청부터는 바로 그 모델을 쓴다.
// (문서 내용이 아니라 모델 이름 문자열만 보관한다)
let resolvedModel = null;

const LANG_NAME = { ko: '한국어', en: 'English', vi: 'Tiếng Việt' };

const VISA_LABEL = { 'D-2': '유학생(D-2)', 'E-9': '비전문취업(E-9)' };
const TASK_LABEL = {
  account_open: '계좌 개설',
  salary_account: '급여·아르바이트비 수령 계좌',
  limit_release: '이체한도(한도제한계좌) 해제',
  overseas_remit: '본국 송금',
};

function buildPrompt({ lang, visa, task }) {
  const out = LANG_NAME[lang] ?? '한국어';
  const situation = [
    visa ? `체류자격: ${VISA_LABEL[visa] ?? visa}` : null,
    task ? `하려는 일: ${TASK_LABEL[task] ?? task}` : null,
  ]
    .filter(Boolean)
    .join(' / ');

  return `너는 한국의 금융문서를 읽고 한국어가 서툰 외국인 사용자에게 설명해 주는 도우미다.

첨부된 이미지에서 다음 세 가지만 추출한다.
1) todo — 사용자가 해야 할 일
2) money_watch — 돈과 관련해 주의해야 할 점 (한도, 수수료, 기한, 금액, 불이익)
3) need_check — 문서만으로는 확정할 수 없어 기관에 추가로 확인해야 할 점

절대 규칙:
- 각 항목의 evidence 필드에는 문서에 실제로 인쇄되어 있는 한국어 문장을 그대로 옮겨 적는다. 요약·의역·번역·재구성 금지. 한 글자라도 바꾸지 않는다.
- 옮겨 적을 문장이 문서에 없으면 그 항목 자체를 만들지 않는다. 해당 분류에 항목이 없으면 빈 배열을 반환한다.
- 문서에 없는 내용을 추론하거나 일반 상식으로 채워 넣지 않는다.
- text 필드는 ${out} 로 쓴다. evidence 는 언어와 무관하게 항상 한국어 원문 그대로다.
- "유리하다 / 추천한다 / 가입하는 게 좋다 / 이 상품이 좋다" 같은 판단·권유 표현을 쓰지 않는다. 문서에 적힌 조항과 주의해야 하는 이유만 쓴다.
- 금융문서가 아니거나 글자를 읽을 수 없으면 unreadable 을 true 로 하고 세 배열을 모두 빈 배열로 반환한다.
- doc_type 은 문서 종류를 짧게 적는다. 판단할 수 없으면 빈 문자열.

사용자 상황${situation ? `(${situation})` : ''}은 어떤 항목을 먼저 보여줄지 우선순위를 정하는 데만 참고하고, 문서에 없는 내용을 만들어 내는 근거로 쓰지 않는다.

반드시 아래 형태의 JSON 객체 하나만 출력한다. 코드블록 표시(\`\`\`)나 설명 문장을 앞뒤에 붙이지 않는다.
{
  "doc_type": "문서 종류",
  "unreadable": false,
  "todo":        [{ "text": "...", "evidence": "문서에 인쇄된 한국어 원문" }],
  "money_watch": [{ "text": "...", "evidence": "문서에 인쇄된 한국어 원문" }],
  "need_check":  [{ "text": "...", "evidence": "문서에 인쇄된 한국어 원문" }]
}`;
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    doc_type: { type: 'STRING' },
    unreadable: { type: 'BOOLEAN' },
    todo: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { text: { type: 'STRING' }, evidence: { type: 'STRING' } },
        required: ['text', 'evidence'],
      },
    },
    money_watch: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { text: { type: 'STRING' }, evidence: { type: 'STRING' } },
        required: ['text', 'evidence'],
      },
    },
    need_check: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { text: { type: 'STRING' }, evidence: { type: 'STRING' } },
        required: ['text', 'evidence'],
      },
    },
  },
  required: ['doc_type', 'unreadable', 'todo', 'money_watch', 'need_check'],
};

// ── Abstention 서버 필터 ──────────────────────────────────────────
// 근거(evidence) 없는 항목은 클라이언트로 나가지 못한다. 이 필터가 유일한 출구다.
const MIN_EVIDENCE = 10;
function cleanList(arr) {
  const src = Array.isArray(arr) ? arr : [];
  const kept = src.filter(
    (it) =>
      it &&
      typeof it.text === 'string' &&
      it.text.trim().length > 0 &&
      typeof it.evidence === 'string' &&
      it.evidence.trim().length >= MIN_EVIDENCE
  );
  return {
    kept: kept.map((it) => ({ text: it.text.trim(), evidence: it.evidence.trim() })),
    dropped: src.length - kept.length,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const { image, mime = 'image/jpeg', lang = 'ko', visa = null, task = null } = body ?? {};

  if (!image || typeof image !== 'string') {
    return Response.json({ error: '이미지가 없습니다.' }, { status: 400 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      { error: '서버에 LLM API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const makePayload = (withSchema) => ({
    contents: [
      {
        parts: [
          { text: buildPrompt({ lang, visa, task }) },
          { inline_data: { mime_type: mime, data: image } },
        ],
      },
    ],
    generationConfig: withSchema
      ? {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        }
      : {
          // 일부 키·모델 조합은 responseSchema(구조화 출력)를 거부한다.
          // 그럴 때는 스키마 없이 JSON 만 요구하고, 프롬프트로 형식을 강제한다.
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
  });

  async function call(model, withSchema) {
    // 무료 티어는 분당 요청 수 제한이 낮다 → 429 는 지수 백오프로 최대 2회 재시도
    let r = null;
    for (let attempt = 0; attempt <= 2; attempt++) {
      r = await fetch(endpointFor(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(makePayload(withSchema)),
      });
      if (r.status !== 429) break;
      if (attempt < 2) await sleep(1200 * Math.pow(2, attempt));
    }
    return r;
  }

  /** 한 모델에 대해 스키마 포함 → 실패 시 스키마 없이 순서대로 시도 */
  async function tryModel(model) {
    let r = await call(model, true);
    if (r.status === 400) {
      // 이 키·모델 조합이 구조화 출력(responseSchema)을 거부하는 경우
      console.error(`[analyze] ${model}: responseSchema 거부 → 스키마 없이 재시도`);
      r = await call(model, false);
    }
    return r;
  }

  let res = null;
  let usedModel = null;
  try {
    const order = resolvedModel
      ? [resolvedModel, ...MODEL_CANDIDATES.filter((m) => m !== resolvedModel)]
      : MODEL_CANDIDATES;

    for (const model of order) {
      res = await tryModel(model);
      usedModel = model;
      // 404 = 이 키로는 그 모델을 못 쓴다 → 다음 후보로 넘어간다
      if (res.status === 404) {
        console.error(`[analyze] ${model}: 사용 불가(404) → 다음 모델 시도`);
        continue;
      }
      break;
    }

    if (res && res.ok) {
      if (resolvedModel !== usedModel) console.log(`[analyze] 사용 모델: ${usedModel}`);
      resolvedModel = usedModel;
    }
  } catch {
    return Response.json(
      { error: '분석 서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 502 }
    );
  }

  if (res.status === 429) {
    return Response.json(
      { error: '요청이 몰리고 있습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    );
  }

  if (!res.ok) {
    // Gemini 의 오류 봉투(error.status / error.message)에는 업로드한 문서 내용이 들어가지 않는다.
    // 원인 파악이 불가능하면 배포 후 디버깅이 막히므로, 이 부분만 그대로 전달한다.
    let detail = null;
    try {
      const e = await res.json();
      detail = {
        http: res.status,
        status: e?.error?.status ?? null,
        message: e?.error?.message ?? null,
      };
    } catch {
      detail = { http: res.status, status: null, message: null };
    }
    console.error('[analyze] gemini error', detail);
    return Response.json(
      { error: '문서를 분석하지 못했습니다. 잠시 후 다시 시도해주세요.', detail },
      { status: 502 }
    );
  }

  let parsed;
  let blockReason = null;
  try {
    const data = await res.json();
    const cand = data?.candidates?.[0];
    blockReason = data?.promptFeedback?.blockReason ?? cand?.finishReason ?? null;

    const text = (cand?.content?.parts ?? [])
      .map((p) => p?.text)
      .filter((x) => typeof x === 'string')
      .join('');

    if (!text) throw new Error('no text part');

    // 스키마 없이 호출한 경우 ```json 펜스가 붙어 올 수 있으므로 관대하게 파싱한다.
    const cleaned = text.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const a = cleaned.indexOf('{');
      const b = cleaned.lastIndexOf('}');
      if (a === -1 || b <= a) throw new Error('no json object');
      parsed = JSON.parse(cleaned.slice(a, b + 1));
    }
  } catch {
    return Response.json(
      {
        error: '분석 결과를 읽지 못했습니다. 사진을 다시 찍어 시도해주세요.',
        detail: { http: res.status, status: blockReason, message: null },
      },
      { status: 502 }
    );
  }

  const todo = cleanList(parsed.todo);
  const money = cleanList(parsed.money_watch);
  const need = cleanList(parsed.need_check);
  const dropped = todo.dropped + money.dropped + need.dropped;

  const unreadable =
    parsed.unreadable === true ||
    todo.kept.length + money.kept.length + need.kept.length === 0;

  return Response.json({
    provider: usedModel,
    doc_type: typeof parsed.doc_type === 'string' ? parsed.doc_type : '',
    unreadable,
    todo: unreadable ? [] : todo.kept,
    money_watch: unreadable ? [] : money.kept,
    need_check: unreadable ? [] : need.kept,
    dropped,
    analyzed_at: today(),
  });
}

/**
 * 헬스체크 — 브라우저에서 /api/analyze 를 열면 키가 살아 있는지 확인할 수 있다.
 * 문서를 보내지 않고 모델 목록만 조회하므로 개인정보와 무관하다. 키 자체는 절대 반환하지 않는다.
 */
export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      { ok: false, keyPresent: false, hint: '.env.local 에 GEMINI_API_KEY 가 없거나 서버를 재시작하지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': key },
    });
    const body = await r.json();

    if (!r.ok) {
      return Response.json(
        {
          ok: false,
          keyPresent: true,
          keyPrefix: key.slice(0, 4),
          http: r.status,
          status: body?.error?.status ?? null,
          message: body?.error?.message ?? null,
        },
        { status: 502 }
      );
    }

    const names = (body?.models ?? [])
      .map((m) => String(m.name ?? '').replace('models/', ''))
      .filter((n) => n.includes('flash') || n.includes('pro'));

    return Response.json({
      ok: true,
      keyPresent: true,
      keyPrefix: key.slice(0, 4),
      candidates: MODEL_CANDIDATES,
      firstUsable: MODEL_CANDIDATES.find((m) => names.includes(m)) ?? null,
      available: names,
    });
  } catch (e) {
    return Response.json(
      { ok: false, keyPresent: true, message: '구글 API 서버에 연결하지 못했습니다.' },
      { status: 502 }
    );
  }
}