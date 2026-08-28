import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';

const serifFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mandé Héritage | Maison de Haute Mode Africaine & Bôkôlan',
  description:
    'Maison de mode africaine d’exception. Vêtements, sacs, chaussures et accessoires en Bôkôlan authentique et cotonnade fine tissée main.',
  keywords: [
    'Mandé Héritage',
    'Bôkôlan',
    'Bogolan',
    'Mode africaine haut de gamme',
    'Luxe africain',
    'Mali',
    'Bamako',
    'Tissage traditionnel',
    'Maroquinerie africaine',
  ],
  authors: [{ name: 'Mandé Héritage' }],
  openGraph: {
    title: 'Mandé Héritage | Maison de Haute Mode Africaine & Bôkôlan',
    description: 'Héritage — Élégance — Modernité. Découvrez nos créations artisanales de prestige.',
    url: 'https://mandeheritage.com',
    siteName: 'Mandé Héritage',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Mandé Héritage - Maison de Mode',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: '/images/logo/logo.png',
    shortcut: '/images/logo/logo.png',
    apple: '/images/logo/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${serifFont.variable} ${sansFont.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-mande-ivory text-mande-black font-sans antialiased">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
