import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { TopPromoBar } from '@/components/layout/TopPromoBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NOVARIDE | Luxury & Everyday Car Rental and Marketplace',
  description:
    'Experience seamless car rental and direct car purchasing. Verified vehicle condition, instant bookings, transparent pricing, and 24/7 roadside assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
        <Providers>
          <TopPromoBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
