import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EDGE MIND AI — AI-Powered Edge Memory & Intelligence Platform',
  description: 'Local intelligence. Persistent memory. Cloud synchronization. Offline-first edge semantic memory architecture powered by Qdrant.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#080a0f] text-slate-100 min-h-screen selection:bg-orange-500/30 selection:text-orange-200 antialiased font-sans bg-tech-grid">
        {children}
      </body>
    </html>
  );
}
