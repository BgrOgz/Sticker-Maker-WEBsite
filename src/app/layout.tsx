import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sticker Maker — Powered by Nano Banana',
  description: 'Generate premium custom stickers with AI. Instant, beautiful, downloadable.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
