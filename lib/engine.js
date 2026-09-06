// lib/engine.js
// 규칙엔진 — 순수 함수만. LLM 호출이 이 파일과 이 파일의 호출 경로에 존재해서는 안 된다.
// import 는 data/rules.json 하나뿐이다.

import DB from '@/data/rules.json';

const CHECKED_AT = DB.meta?.checked_at ?? null;

/** id 배열 → 출처 객체 배열 (없는 id는 조용히 버린다) */
function resolveSources(ids) {
  if (!Array.isArray(ids)) return [];
  return ids
    .map((id) => DB.sources.find((s) => s.id === id))
    .filter(Boolean)
    .map((s) => ({
      id: s.id,
      org: s.org,
      title: s.title,
      url: s.url,
      checked_at: s.checked_at,
      verified: s.verified === true,
      // 원문 대조 전(verified:false)인 출처는 quote 를 내보내지 않는다.
      quote: s.verified === true ? s.quote ?? null : null,
    }));
}

/**
 * evaluate(visa, task)
 *  - 구체적 visa 매칭을 "*" 보다 우선한다.
 *  - 매칭 없음        → { status: 'abstain', reason: 'no_rule' }
 *  - verified === false → { status: 'abstain', reason: 'unverified' }
 *  - eligibility === 'unknown' → { status: 'abstain', reason: 'unverified' }
 *  - 그 외            → { status: 'ok', ... }
 *
 * 중요: abstain 인 경우 required_docs / branch_required 를 절대 반환하지 않는다.
 *       근거 없는 안내가 화면에 도달하는 경로 자체를 만들지 않는다.
 */
export function evaluate(visa, task) {
  if (!visa || !task) {
    return { status: 'abstain', reason: 'no_rule', checked_at: CHECKED_AT };
  }

  const candidates = DB.rules.filter(
    (r) => r.task === task && (r.visa === visa || r.visa === '*')
  );
  if (candidates.length === 0) {
    return { status: 'abstain', reason: 'no_rule', checked_at: CHECKED_AT };
  }

  // 구체적 visa 우선
  const rule = candidates.find((r) => r.visa === visa) ?? candidates[0];

  if (rule.verified !== true || rule.eligibility === 'unknown') {
    return {
      status: 'abstain',
      reason: 'unverified',
      rule_id: rule.id,
      note: rule.note ?? null,
      checked_at: CHECKED_AT,
    };
  }

  return {
    status: 'ok',
    rule_id: rule.id,
    visa: rule.visa,
    task: rule.task,
    institution: rule.institution ?? null,
    eligibility: rule.eligibility,
    required_docs: Array.isArray(rule.required_docs) ? rule.required_docs : [],
    branch_required: rule.branch_required === true,
    why_branch: rule.why_branch ?? null,
    risk_note: rule.risk_note ?? null,
    sources: resolveSources(rule.sources),
    checked_at: CHECKED_AT,
  };
}

/** trigger_tasks 에 task 가 포함된 사기 패턴 반환 */
export function getScamPatterns(task) {
  if (!task) return [];
  return DB.scam_patterns.filter(
    (p) => Array.isArray(p.trigger_tasks) && p.trigger_tasks.includes(task)
  );
}

/**
 * 신뢰 배너용 상태. 수치는 하드코딩하지 않고 rules.json 에서 직접 센다.
 * (데이터가 늘거나 줄면 화면 숫자도 자동으로 따라간다 = 숫자가 항상 참이다)
 */
export function getDbStatus() {
  const rulesTotal = DB.rules.length;
  const rulesVerified = DB.rules.filter((r) => r.verified === true).length;
  const sourcesTotal = DB.sources.length;
  const sourcesVerified = DB.sources.filter((s) => s.verified === true).length;
  return {
    rulesTotal,
    rulesVerified,
    sourcesTotal,
    sourcesVerified,
    checkedAt: CHECKED_AT,
  };
}

/** 화면에서 쓰는 상수 (라벨은 i18n 에서 가져온다) */
export const VISAS = ['D-2', 'E-9'];
export const TASKS = ['account_open', 'salary_account', 'limit_release', 'overseas_remit'];
