"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  LayoutGrid,
  User,
  FolderKanban,
  GraduationCap,
  Award,
  Plus,
  ArrowUpRight,
  Shield,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { resolveProfileId } from "@/lib/viewed-profile";

/**
 * ⌘K / Ctrl-K jump-to-anywhere.
 *
 * The dashboard is deliberately app-like rather than document-like, and this is
 * the piece that makes deep navigation cheap: every section and every "add"
 * action is one keystroke away without traversing the section pages.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const userInfo = useSelector((s: any) => s.userReducer);
  const profileId = resolveProfileId(userInfo?.id);
  const isAdmin = userInfo?.role === "ADMIN";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a section or create something…" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>

        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => go("/manage")}>
            <LayoutGrid className="mr-2 h-4 w-4" strokeWidth={1.75} /> Overview
          </CommandItem>
          <CommandItem onSelect={() => go("/manage/profile")}>
            <User className="mr-2 h-4 w-4" strokeWidth={1.75} /> Profile
          </CommandItem>
          <CommandItem onSelect={() => go("/manage/projects")}>
            <FolderKanban className="mr-2 h-4 w-4" strokeWidth={1.75} /> Work
          </CommandItem>
          <CommandItem onSelect={() => go("/manage/education")}>
            <GraduationCap className="mr-2 h-4 w-4" strokeWidth={1.75} /> Education
          </CommandItem>
          <CommandItem onSelect={() => go("/manage/certificate")}>
            <Award className="mr-2 h-4 w-4" strokeWidth={1.75} /> Certificates
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Create">
          <CommandItem onSelect={() => go("/manage/projects/add")}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} /> New project or role
          </CommandItem>
          <CommandItem onSelect={() => go("/manage/education/add")}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} /> New education entry
          </CommandItem>
          <CommandItem onSelect={() => go("/manage/certificate/add")}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} /> New certificate
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Elsewhere">
          {profileId && (
            <CommandItem onSelect={() => go(`/profile/${profileId}`)}>
              <ArrowUpRight className="mr-2 h-4 w-4" strokeWidth={1.75} /> View public page
            </CommandItem>
          )}
          {isAdmin && (
            <CommandItem onSelect={() => go("/admin/dashboard")}>
              <Shield className="mr-2 h-4 w-4" strokeWidth={1.75} /> Admin
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
