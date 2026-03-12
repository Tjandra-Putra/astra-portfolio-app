import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "./redux/provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { initialProfile } from "@/lib/initial-profile";
import { AppLoaderRemover } from "@/components/layout/app-loader-remover";

const font = Familjen_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astra",
  description: "Portfolio App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize the user profile on the server side
  initialProfile();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "relative overflow-x-hidden") }>
          {/* Splash screen – server-rendered, visible before JS loads */}
          <div id="app-loader" className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-[#f0f1f3] dark:bg-[#0c0c0c]">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#1c3454]/20 dark:border-zinc-700" />
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#1c3454] dark:border-t-zinc-200 animate-spin" />
            </div>
            <span className="font-semibold text-xl tracking-widest text-[#1c3454] dark:text-zinc-200">Astra</span>
          </div>
          {/* Reads localStorage before first paint so the loader bg matches the stored theme */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var l=document.getElementById('app-loader'),t=localStorage.getItem('astra-theme'),d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(l){l.style.backgroundColor=d?'#0c0c0c':'#f0f1f3';var s=l.querySelector('.border-t-\\[#1c3454\\]');if(s&&d)s.style.borderTopColor='#e4e4e7';}}catch(e){}})();`,
            }}
          />
          {/* Global side background art for all pages */}
          <div className="pointer-events-none fixed left-0 top-0 z-[0] hidden xl:block h-screen w-[22vw] overflow-hidden" aria-hidden="true">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#74c0fc]/35 blur-3xl dark:bg-[#74c0fc]/20" />
            <div className="absolute left-16 top-[44%] h-48 w-48 rounded-[36px] border border-[#1d3554]/20 bg-white/30 rotate-12 dark:border-zinc-400/20 dark:bg-zinc-700/10" />
            <div className="absolute left-8 bottom-20 h-52 w-52 rounded-full border-2 border-dashed border-[#1d3554]/25 dark:border-sky/40" />
          </div>

          <div className="pointer-events-none fixed right-0 top-0 z-[0] hidden xl:block h-screen w-[22vw] overflow-hidden" aria-hidden="true">
            <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-[#1d3554]/25 blur-3xl dark:bg-sky/20" />
            <div className="absolute right-12 top-[38%] h-56 w-56 rounded-full border border-[#1d3554]/20 bg-gradient-to-br from-[#74c0fc]/20 to-[#1d3554]/10 dark:border-zinc-400/20" />
            <div className="absolute right-20 bottom-16 h-28 w-28 rounded-3xl bg-[#fab306]/20 rotate-12 dark:bg-[#fab306]/15" />
          </div>

          <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="astra-theme" disableTransitionOnChange>
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
