"use client";

import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/**
 * Dashboard shell. Deliberately does NOT reuse the public site's Navbar,
 * Footer, StageDecor or scroll-progress bar — this side is an app frame, not a
 * document. See components/dashboard/dashboard-shell.tsx.
 */
const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default ManagementLayout;
