import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { NoticeProvider } from '../context/NoticeContext';

export const metadata: Metadata = {
  title: 'College Notice Board — Campus Announcements Hub',
  description:
    'Consolidated university announcement and communications portal. Discover campus notices, hackathons, academic schedules, and club activities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <NoticeProvider>{children}</NoticeProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
