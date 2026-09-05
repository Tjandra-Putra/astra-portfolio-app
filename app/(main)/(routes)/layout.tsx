import BottomGroup from "@/components/layout/bottom-group";
import Navbar from "@/components/layout/navbar";
import { MotionLayer } from "@/components/fx/motion-layer";
import { StageDecor } from "@/components/fx/stage-decor";
import React from "react";

/**
 * Shell for every non-landing public page. Owns the stage, the scroll
 * progress hairline and the single MotionLayer that drives `.reveal`.
 * `.wrap` owns the page gutter — pages must not add horizontal padding.
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="stage flex min-h-[100svh] flex-col">
      <span className="progress" />
      <MotionLayer />
      <Navbar />

      <main className="wrap relative flex-1 pt-6 pb-[var(--gutter)]">
        <StageDecor />
        {children}
        <BottomGroup />
      </main>
    </div>
  );
};

export default MainLayout;
