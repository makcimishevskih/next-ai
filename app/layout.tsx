import "./globals.css";

// import { dark, neobrutalism } from '@clerk/themes';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from '@/components/ui/theme-provider';

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
    <ClerkProvider
    // appearance={{
    //   baseTheme: dark,
    //   variables: { colorPrimary: 'white' },
    //   signIn: { baseTheme: neobrutalism },
    //   signUp: { baseTheme: neobrutalism }
    // }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          // disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
