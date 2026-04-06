import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Authrix - AI Content Detector & Humanizer',
  description: 'Advanced AI content detection, plagiarism checking, and humanizing platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 mt-16">
          {children}
        </main>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
