'use client';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { createReplicacheClient } from './replicacheConstructer';
import { ConvexClient } from 'convex/browser';

// export const fontSans = FontSans({
//   subsets: ['latin'],
//   variable: '--font-sans',
// });

interface RootLayoutProps {
  children: React.ReactNode;
}

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export const rep = createReplicacheClient(convex);

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          // fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}




