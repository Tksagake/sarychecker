import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sary Network International - Background Check',
  description: 'Submit your details for background verification by Sary Network International',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred.</p>}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}