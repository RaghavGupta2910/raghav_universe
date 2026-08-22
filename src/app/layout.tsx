import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raghav Gupta — Astronomical Archive & Portfolio',
  description:
    'An interactive personal universe and astronomical archive of Raghav Gupta: Mathematics & Computing student, competitive programmer, and systems developer.',
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
  themeColor: '#080B12',
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
    <html
      lang="en"
      className={`dark antialiased ${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#080B12] text-[#E8E1D5] min-h-screen overflow-hidden font-body selection:bg-[#B79A5B]/30 selection:text-[#E8E1D5]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
