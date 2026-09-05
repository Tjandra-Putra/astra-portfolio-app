import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="stage flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-x-clip py-14">
    <div className="orb left-1/2 top-[4%] h-[360px] w-[360px] -translate-x-1/2 sm:h-[520px] sm:w-[520px]" />

    <Link
      href="/"
      aria-label="Astra home"
      className="glass-bright rise flex h-11 shrink-0 items-center gap-2.5 rounded-tile pl-2 pr-4 transition-transform duration-300 ease-glass hover:-translate-y-0.5"
    >
      <span className="grid h-7 w-7 place-items-center rounded-xs bg-ink text-[12px] font-bold text-stage">A</span>
      <span className="text-[15px] font-semibold tracking-tight text-ink">Astra</span>
    </Link>

    <div className="wrap flex justify-center">{children}</div>
  </div>
);

export default AuthLayout;
