"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { resolvedTheme } = useTheme();

  const getButtonVariant = () => {
    return resolvedTheme === "dark" ? "secondary2" : "ash"; // or any other variant for dark
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={getButtonVariant()} size="icon" className="w-[3.4rem]">
          <Sun className="w-6 h-6 sm:w-6 sm:h-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-600" />
          <Moon className="absolute w-6 h-6 sm:w-6 sm:h-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-amber-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
