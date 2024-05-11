import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js companion AI project",
  description: "Get your own AI companion for anything",
};

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("bg-secondary", inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
