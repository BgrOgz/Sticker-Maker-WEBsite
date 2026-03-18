import type { Metadata } from 'next';
import { Syne, Nunito } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Sticker Create',
  description: 'Generate premium custom stickers with AI. Instant, beautiful, downloadable.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '64x64' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr" className={`${syne.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
