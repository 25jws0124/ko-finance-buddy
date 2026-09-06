# KO-Finance Buddy

외국인 금융 정착 AI 에이전트. 2026 금융 AI Challenge(금융보안원 주최) 출품작.

## 절대 원칙 (모든 코드 결정의 기준)

1. **Source-first** — 모든 근거 데이터는 공식 출처 URL과 checked_at을 가진다.
2. **Rule-first** — 비자·자격·필수서류 판정은 **LLM이 아니라 코드**가 한다. `lib/engine.js` 에서 LLM을 호출하면 안 된다.
3. **LLM-last** — LLM의 역할은 "사용자가 올린 문서 이미지를 읽어 설명"하는 것 하나뿐이다. (`app/api/analyze/route.js`)
4. **Abstention** — 근거가 없으면 답을 만들지 않는다. 서버가 응답을 검사해 근거(evidence) 없는 항목을 **삭제**한 뒤 클라이언트로 보낸다.
5. **Freshness** — 모든 판정 결과에 정보 기준일을 표시한다.

## 금지 사항

- 데이터베이스 사용 금지. 사용자 입력은 브라우저 상태(useState)로만 유지한다.
- 업로드 이미지를 서버 파일시스템이나 외부 스토리지에 저장 금지. 요청 처리 중 메모리에만 존재한다.
- 문서 내용·이미지를 `console.log` 나 로그에 남기지 않는다. (크기 KB 출력은 허용)
- API 키를 클라이언트 번들에 노출 금지. `NEXT_PUBLIC_` 접두사 사용 금지.
- 사용자에게 "유리하다 / 추천한다 / 이 상품이 좋다" 같은 금융 판단 표현 금지. 조항과 주의 이유만 제시한다.
- `data/rules.json` 에 없는 서류·조건을 UI에 하드코딩 금지.
- 신뢰 배너의 수치(5/6 등)를 하드코딩 금지. `getDbStatus()` 가 rules.json 에서 직접 센다.

## 기술 스택 (변경 금지)

- Next.js 14 App Router / React 18 / JavaScript (TypeScript 아님)
- 스타일: `app/globals.css` 하나. 색상은 전부 CSS 변수. Tailwind·UI 라이브러리 설치 금지.
- 백엔드: Next.js Route Handler, `export const runtime = 'nodejs'`
- Vision LLM: Google Gemini (`gemini-2.5-flash`), REST fetch 직접 호출. SDK 설치하지 않는다.
- 배포: Vercel
- 외부 npm 패키지 추가 설치 금지 (next, react, react-dom 만 사용)

## 지원 언어

한국어(ko) / English(en) / Tiếng Việt(vi)
단, **문서 원문 인용(evidence), 출처의 기관명·문서명, required_docs 의 서류 이름은 항상 한국어 원문 그대로 유지**한다.
서류 이름만 괄호로 선택 언어를 병기한다. 예: `재직증명서 (Certificate of Employment)`

## 파일 구조

```
app/
  layout.js            메타데이터 · Pretendard 폰트
  page.js              화면 전환 상태머신 (home → result → prep → confirm → done)
  globals.css          디자인 토큰(목업에서 추출한 실제 hex) + 공통 클래스
  ui.js                공통 조각 (AppBar / Progress / CtaBar / Quote / SourceList / Accordion / ScamCard)
  screens/
    Home.js            내 상황 선택
    Result.js          판정 결과 + ABSTAIN 화면
    Prep.js            준비물 체크리스트 + 문서 분석(업로드)
    Confirm.js         최종 점검
    Done.js            창구 제시 카드
  api/analyze/route.js Gemini 호출 + Abstention 서버 필터
lib/
  engine.js            규칙엔진 (순수 함수, LLM 없음)
  i18n.js              ko/en/vi 문자열
data/
  rules.json           출처 6건 · 규칙 6건 · 사기패턴 2건
design/
  KO-Finance Buddy.dc.html   Claude Design 목업 원본
```

## 작업 방식

- 한 번에 한 가지만 바꾼다. 요청하지 않은 파일을 미리 만들지 않는다.
- 파일을 고치면 `npm run build` 가 통과하는지 확인한다.
- 규칙·서류·수치를 바꿀 때는 코드가 아니라 `data/rules.json` 을 고친다.
