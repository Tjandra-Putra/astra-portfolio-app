import { AstraMark } from "@/components/brand/astra-mark";
import { ArrowUpRight } from "lucide-react";

/**
 * Rendered INSIDE `.wrap` by the page shell, so it carries no gutter of its
 * own — just the floating glass panel.
 */
const Footer = () => {
  return (
    <footer className="mt-3.5">
      <div className="glass pad rise flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xs bg-ink text-[12px] font-bold text-stage"><AstraMark className="h-[17px] w-[17px]" /></span>
          <div>
            <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">Astra Portfolio</p>
            <p className="tt-sub">© {new Date().getFullYear()} — All rights reserved</p>
          </div>
        </div>

        <a
          href="https://www.linkedin.com/in/tjandra-putra/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-glass btn-sm"
        >
          Developed by Tjandra
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
