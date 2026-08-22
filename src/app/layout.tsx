import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Raghav Universe — Interactive Personal Cosmos',
  description:
    'An interactive personal universe representing Raghav Gupta, Mathematics & Computing student, competitive programmer, and systems developer.',
  keywords: [
    'Raghav Gupta',
    'Mathematics & Computing',
    'Competitive Programming',
    'LeetCode',
    'Codeforces',
    '3D Portfolio',
    'React Three Fiber',
  ],
  authors: [{ name: 'Raghav Gupta' }],
};

export const viewport: Viewport = {
  themeColor: '#02050f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark font-sans antialiased" suppressHydrationWarning>
      <body
        className="bg-[#02050f] text-slate-100 min-h-screen overflow-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
