import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "./redux/provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { initialProfile } from "@/lib/initial-profile";
import { AppLoaderRemover } from "@/components/layout/app-loader-remover";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CacheScope } from "@/components/providers/cache-scope";

/* Manrope — geometric grotesque, carries the whole interface */
const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/* IBM Plex Mono — micro-labels, IDs and figures. The technical register. */
const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Astra — Portfolio",
  description: "Showcase your projects, experiences and skills. Connect with exceptional talent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize the user profile on the server side
  initialProfile();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={cn(fontSans.variable, fontMono.variable)}>
        <body className={cn(fontSans.className, "relative overflow-x-clip bg-stage text-ink antialiased")}>
          {/* Splash — floating glass tiles, server-rendered before JS boots */}
          <div
            id="app-loader"
            className="fixed inset-0 z-[9999] grid place-items-center bg-[#17171a]"
          >
            <div className="grid grid-cols-2 gap-2">
              {[0, 0.15, 0.3, 0.45].map((d, i) => (
                <span
                  key={i}
                  className="h-6 w-6 rounded-[9px] bg-white/70 shadow-[0_2px_8px_-2px_rgba(13,13,15,.2)] dark:bg-white/12"
                  style={{ animation: `tile-pulse 1.3s cubic-bezier(.4,0,.6,1) ${d}s infinite` }}
                />
              ))}
            </div>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var l=document.getElementById('app-loader'),t=localStorage.getItem('astra-theme'),d=t!=='light';if(l)l.style.backgroundColor=d?'#17171a':'#d7d7d5';if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
            }}
          />

          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="astra-theme" disableTransitionOnChange>
            <SmoothScroll />
            <CacheScope />
            <ReduxProvider>{children}</ReduxProvider>
            <AppLoaderRemover />
            <Analytics />
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
