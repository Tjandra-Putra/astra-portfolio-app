"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/clerk-react";
import { ShieldAlert, ArrowRight } from "lucide-react";

import { removeUserInfo } from "@/app/redux/features/user-slice";
import { StageDecor } from "@/components/fx/stage-decor";

const UnauthorisedPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(removeUserInfo());
  }, [dispatch]);

  return (
    <div className="stage relative grid min-h-[100svh] place-items-center overflow-x-clip px-[var(--gutter)] py-14">
      <StageDecor />
      <div className="orb left-1/2 top-[8%] h-[360px] w-[360px] -translate-x-1/2 sm:h-[520px] sm:w-[520px]" />

      <section className="glass pad-lg rise w-full max-w-[30rem] text-center">
        <span className="glass-lite mx-auto mb-5 grid h-12 w-12 place-items-center rounded-tile">
          <ShieldAlert className="h-5 w-5 text-acc-text" strokeWidth={1.75} />
        </span>

        <p className="tt-mono">Error 401</p>
        <h1 className="tt-h1 mt-3">Unauthorised access</h1>
        <p className="tt-body mx-auto mt-4 max-w-sm">
          You do not have permission to view this page. If you believe this is a mistake, contact the administrator.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <SignOutButton>
            <button className="btn btn-acc" onClick={() => router.push("/")}>
              Return home
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
          </SignOutButton>
        </div>
      </section>
    </div>
  );
};

export default UnauthorisedPage;
