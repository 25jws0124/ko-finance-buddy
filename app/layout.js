import './globals.css';

export const metadata = {
  title: 'KO-Finance Buddy — 외국인 금융 정착 AI 에이전트',
  description:
    '공식 출처로 대조한 규칙만으로 외국인의 한국 금융 절차를 안내합니다. 근거가 없으면 답하지 않습니다.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'KO-Finance Buddy',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D7C74',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
