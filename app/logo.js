'use client';

/**
 * 브랜드 마크 — 서류 카드 + 확인된 근거(체크).
 * app/icon.svg(파비콘·앱 아이콘)와 같은 도형을 쓴다.
 * 작은 크기에서도 형태가 뭉개지지 않도록 선 굵기를 키워 둔 버전이다.
 */
export default function Logo({ size = 28, radius = 8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="KO-Finance Buddy"
      style={{ display: 'block', flex: 'none' }}
    >
      <defs>
        <linearGradient id="kfbLogoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F8F86" />
          <stop offset="100%" stopColor="#0B5A54" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx={(radius / size) * 512} fill="url(#kfbLogoBg)" />

      {/* 서류 카드 */}
      <rect x="152" y="128" width="208" height="256" rx="30" fill="#FFFFFF" opacity="0.97" />

      {/* 문서의 줄 — 작은 크기에서도 보이도록 굵게 */}
      <rect x="192" y="180" width="128" height="24" rx="12" fill="#0B5A54" opacity="0.28" />

      {/* 확인된 근거 = 체크 */}
      <path
        d="M190 292 L236 338 L326 244"
        fill="none"
        stroke="#0D7C74"
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
