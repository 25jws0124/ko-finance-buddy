# 배포 가이드 — GitHub → Vercel

> 목표: **9/7 11:00 ~ 9/11 23:59 동안 항상 접속되는 URL** 을 만든다.
> 다 합쳐서 15분이면 끝납니다. 터미널 명령은 4줄뿐입니다.

---

## 왜 GitHub Pages가 아니라 Vercel인가

한 줄 요약: **GitHub Pages를 쓰면 Gemini API 키가 그대로 노출됩니다.**

GitHub Pages는 정적 파일만 올릴 수 있어서 서버 코드(`app/api/analyze/route.js`)가 돌지 않습니다.
그러면 키를 브라우저 코드에 박아야 하는데, 그 순간 누구나 개발자도구로 키를 꺼내 쓸 수 있습니다.
Vercel은 서버 코드를 대신 돌려주고, 키는 서버에만 둡니다. 그리고 **GitHub 레포를 연결하는 방식이라 사용법은 GitHub Pages와 거의 같습니다.** 무료입니다.

---

## STEP 1 — VS Code에서 폴더 열기

1. 받은 zip을 압축 해제합니다. → `ko-finance-buddy` 폴더가 생깁니다.
2. VS Code → `파일` → `폴더 열기` → 그 폴더 선택.
3. 터미널 열기: `Ctrl` + `` ` `` (백틱)

## STEP 2 — 로컬에서 한 번 돌려보기

```bash
npm install
```

프로젝트 루트(= `package.json` 이 있는 곳)에 **`.env.local`** 파일을 새로 만들고:

```
GEMINI_API_KEY=여기에_본인_키
```

그리고:

```bash
npm run dev
```

http://localhost:3000 에서 4가지 시나리오(README 표)를 눌러 확인합니다.
확인이 끝나면 터미널에서 `Ctrl` + `C` 로 종료.

## STEP 3 — GitHub에 올리기

GitHub에서 새 레포지토리를 만듭니다 (이름 예: `ko-finance-buddy`, **Public / 아무 파일도 추가하지 않음**).

그 다음 VS Code 터미널에서:

```bash
git init
git add .
git commit -m "KO-Finance Buddy MVP"
git branch -M main
git remote add origin https://github.com/<본인아이디>/ko-finance-buddy.git
git push -u origin main
```

> `.env.local` 은 `.gitignore` 에 있어서 **올라가지 않습니다.** 정상입니다.
> push할 때 로그인 창이 뜨면 GitHub 계정으로 로그인하면 됩니다.

## STEP 4 — Vercel 연결 (여기가 핵심)

1. https://vercel.com 접속 → **Continue with GitHub** 로 로그인
2. `Add New...` → **Project**
3. 방금 만든 `ko-finance-buddy` 레포 옆의 **Import** 클릭
4. 설정 화면이 뜹니다. Framework는 자동으로 `Next.js` 로 잡힙니다. **그대로 두세요.**
5. **`Environment Variables` 섹션을 펼칩니다.** ← 이걸 빼먹으면 문서 분석이 안 됩니다
   - Name: `GEMINI_API_KEY`
   - Value: 본인 키 붙여넣기
   - `Add` 클릭
6. **Deploy** 클릭 → 2~3분 기다립니다.
7. 끝나면 `https://ko-finance-buddy-xxxx.vercel.app` 같은 URL이 나옵니다. **이게 제출용 URL입니다.**

## STEP 5 — 배포 후 반드시 확인할 5가지

**휴대폰으로** 그 URL을 열어서:

- [ ] 홈 화면이 뜨고, 칩을 누르면 진행률 바가 50% → 100% 로 찬다
- [ ] D-2 + 이체한도 풀기 → 판정 결과에 KB국민은행 **원문 인용**이 보인다
- [ ] 준비물 화면에서 **사진 올리기** → 실제 서류 사진 업로드 → 3블록 결과가 나온다 (여기가 API 키 확인)
- [ ] D-2 + 본국으로 송금하기 → **"공식기관 확인 필요"** 화면이 나온다
- [ ] 언어를 EN / VI 로 바꿔도 **문서 원문 인용은 한국어 그대로** 남아 있다

---

## 코드를 고친 뒤 다시 배포하려면

```bash
git add .
git commit -m "수정 내용"
git push
```

push만 하면 Vercel이 자동으로 다시 배포합니다. 버튼 누를 필요 없습니다.

---

## 자주 터지는 곳

| 증상 | 원인 / 해결 |
|---|---|
| 배포는 됐는데 사진 분석에서 "서버에 LLM API 키가 설정되지 않았습니다" | STEP 4의 5번(환경변수)을 빼먹은 것. Vercel → 프로젝트 → `Settings` → `Environment Variables` 에서 `GEMINI_API_KEY` 추가 후, `Deployments` 탭에서 최신 배포의 `⋯` → **Redeploy** |
| "요청이 몰리고 있습니다" | Gemini 무료 플랜의 분당 요청 제한. 30초 뒤 다시 시도하면 됩니다. 심사 시연 전에 한 번 미리 눌러 워밍업해두세요 |
| 폰 사진 업로드가 실패 | 이미 클라이언트에서 긴 변 1280px / JPEG 0.8로 줄여서 보냅니다. 그래도 실패하면 `app/screens/Prep.js` 의 `resizeToBase64(file, 1024, 0.7)` 로 낮추세요 |
| `npm run build` 실패 | 에러 전문을 그대로 Claude Code에 붙여넣고 "원인부터 설명한 뒤 고쳐줘" 라고 하세요. 기능을 지워서 우회하지 마세요 |
| Vercel 빌드 실패 | 로컬에서 `npm run build` 가 되는지 먼저 확인. 로컬에서 되면 대부분 환경변수 문제입니다 |

---

## 제출 직전 체크

- [ ] 기능명세서의 **웹서비스 URL** 칸에 Vercel URL 기입
- [ ] 명세서의 F-01 ~ F-11을 배포된 URL에서 하나씩 눌러 대조 (명세와 실제가 다르면 감점)
- [ ] 9/11 23:59까지 URL이 살아 있어야 하므로, 그 사이 Vercel 프로젝트를 지우지 말 것
