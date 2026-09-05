"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";
import { FileText, Copy, ArrowUpRight, Sparkles } from "lucide-react";
import { getJSON } from "@/lib/data-client";
import { resolveProfileId } from "@/lib/viewed-profile";

const Collaborate = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const profileId = resolveProfileId(userInfo?.id);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getJSON<any>(`/api/profile/${profileId}`);
      setProfile(response);
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileId) return;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const email = profile?.workEmail || profile?.email;

  return (
    <section className="glass pad-lg reveal relative mt-10 overflow-hidden text-center">
      <div className="orb bottom-[-45%] left-1/2 h-[400px] w-[400px] -translate-x-1/2" />

      <span className="tt-mono inline-flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        Get in touch
      </span>

      <h2 className="tt-h1 mx-auto mt-5 max-w-xl">
        Let&apos;s make <span className="acc">something.</span>
      </h2>

      <p className="tt-lead mx-auto mt-5 max-w-md">
        Always open to discussing product work, partnerships, or new opportunities.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {loading ? (
          <>
            <span className="glass-lite shimmer h-[46px] w-40 rounded-tile" />
            <span className="glass-lite shimmer h-[46px] w-36 rounded-tile" />
          </>
        ) : (
          <>
            {profile?.resumeUrl ? (
              <Link href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-acc btn-lg">
                View resume
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </Link>
            ) : (
              <span className="btn btn-glass btn-lg" aria-disabled="true">
                Resume unavailable
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
            )}

            {email ? (
              <CopyToClipboard text={email} onCopy={() => toast.success("Copied to clipboard!")}>
                <button className="btn btn-glass btn-lg">
                  Copy email
                  <Copy className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </CopyToClipboard>
            ) : null}
          </>
        )}
      </div>

      {!loading && email && (
        <p className="tt-sub mt-6 inline-flex items-center gap-1.5">
          <span className="pin" />
          {email}
        </p>
      )}
    </section>
  );
};

export default Collaborate;
