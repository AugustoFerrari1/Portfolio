import type { Metadata } from 'next';
import { Inter, Barlow } from 'next/font/google';
import FrameLayout from '@/components/FrameLayout';
import { LanguageProvider } from '@/components/LanguageContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Augusto',
  description: 'Design & Development Portfolio',
  icons: {
    icon: '/logoPort.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body>
        <LanguageProvider>
          <FrameLayout>
            {children}
          </FrameLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
