"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { clerkAppearance } from "@/components/clerk-appearance";

export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="glass pad rise w-full max-w-[27rem]">
      <SignIn appearance={clerkAppearance(resolvedTheme !== "light")} />
    </div>
  );
}
