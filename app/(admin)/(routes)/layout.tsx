"use client";

import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/** Admin runs inside the same app frame as the dashboard. */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default AdminLayout;
