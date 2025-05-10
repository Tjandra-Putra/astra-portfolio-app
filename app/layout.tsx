import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "./redux/provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astra",
  description: "Portfolio App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className)}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="astra-theme" disableTransitionOnChange>
            <ReduxProvider>{children}</ReduxProvider>
            <Analytics />
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
