"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="stage grid min-h-[100svh] place-items-center overflow-x-clip py-14">
      <div className="orb left-1/2 top-[6%] h-[380px] w-[380px] -translate-x-1/2 sm:h-[540px] sm:w-[540px]" />

      <div className="wrap">
        <div className="glass pad-lg rise mx-auto max-w-2xl text-center">
          <span className="glass-lite mx-auto grid h-12 w-12 place-items-center rounded-tile">
            <Compass className="h-5 w-5 text-ink" strokeWidth={1.75} />
          </span>

          <p className="tt-mono mt-6">Error 404</p>
          <h1 className="tt-hero mt-5">
            Page not <span className="acc">found.</span>
          </h1>
          <p className="tt-lead mx-auto mt-6 max-w-sm">
            This link is broken or the page has moved. Step back to where you were, or start again from the index.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => router.back()} className="btn btn-glass btn-lg">
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
              Go back
            </button>
            <Link href="/" className="btn btn-acc btn-lg">
              Return home
              <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
