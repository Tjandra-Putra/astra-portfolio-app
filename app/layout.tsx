import type { Metadata } from "next";
import { Inter, Sriracha, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "./redux/provider";
import { currentProfile } from "@/lib/current-profile";
import Image from "next/image";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astra",
  description: "Portfolio App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = currentProfile();

  const unverifiedComponent = (
    <div
      id="oopss"
      className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen text-center flex items-center flex-col p-6 absolute top-0 right-0 bottom-0 left-0  z-50"
    >
      <Image src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404" width={400} height={400} />
      <div className="flex flex-col gap-3">
        <span className="sm:text-3xl text-2xl font-semibold">Please wait for the admin to verify your account</span>
        <p className="text-xl">Clear the cookies to go back to the login page.</p>
      </div>
    </div>
  );

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="astra-theme">
            <ReduxProvider>
              {currentUser.then((user) => {
                if (user?.role === "GUEST") {
                  console.log("You are not authorized to access this page");

                  return unverifiedComponent;
                }
              })}

              {currentUser.then((user) => {
                if (user?.role !== "GUEST") {
                  return children;
                }
              })}
              {/* <main>{children}</main> */}
            </ReduxProvider>
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
