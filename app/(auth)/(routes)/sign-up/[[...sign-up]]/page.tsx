"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { clerkAppearance } from "@/components/clerk-appearance";

export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="glass pad rise w-full max-w-[27rem]">
      <SignUp appearance={clerkAppearance(resolvedTheme !== "light")} />
    </div>
  );
}
