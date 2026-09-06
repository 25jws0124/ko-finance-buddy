// app/api/analyze/route.js
// LLM 의 역할은 단 하나 — "사용자가 올린 문서 이미지를 읽어 설명한다".
// 판정(비자·자격·서류)은 lib/engine.js 가 하며, 이 파일은 engine 을 import 하지 않는다.

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

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

사용자 상황${situation ? `(${situation})` : ''}은 어떤 항목을 먼저 보여줄지 우선순위를 정하는 데만 참고하고, 문서에 없는 내용을 만들어 내는 근거로 쓰지 않는다.`;
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

  const payload = {
    contents: [
      {
        parts: [
          { text: buildPrompt({ lang, visa, task }) },
          { inline_data: { mime_type: mime, data: image } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  // 무료 티어는 분당 요청 수 제한이 낮다 → 429 는 지수 백오프로 최대 2회 재시도
  let res = null;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(payload),
      });
    } catch {
      return Response.json(
        { error: '분석 서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 }
      );
    }
    if (res.status !== 429) break;
    if (attempt < 2) await sleep(1200 * Math.pow(2, attempt));
  }

  if (res.status === 429) {
    return Response.json(
      { error: '요청이 몰리고 있습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    );
  }

  if (!res.ok) {
    // 응답 본문에는 문서 내용이 섞일 수 있으므로 로그로 남기지 않는다.
    return Response.json(
      { error: '문서를 분석하지 못했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 502 }
    );
  }

  let parsed;
  try {
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string') throw new Error('no text part');
    parsed = JSON.parse(text);
  } catch {
    return Response.json(
      { error: '분석 결과를 읽지 못했습니다. 사진을 다시 찍어 시도해주세요.' },
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
    provider: MODEL,
    doc_type: typeof parsed.doc_type === 'string' ? parsed.doc_type : '',
    unreadable,
    todo: unreadable ? [] : todo.kept,
    money_watch: unreadable ? [] : money.kept,
    need_check: unreadable ? [] : need.kept,
    dropped,
    analyzed_at: today(),
  });
}

export async function GET() {
  return Response.json({ error: 'POST 만 허용됩니다.' }, { status: 405 });
}
