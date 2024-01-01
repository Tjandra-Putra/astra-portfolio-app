import type { Metadata } from "next";
import { Inter, Sriracha, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { cn } from "@/lib/utils";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astra",
  description: "Portfolio App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="astra-theme">
            <main>{children}</main>
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
