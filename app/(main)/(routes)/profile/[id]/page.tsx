"use client";

import Link from "next/link";
import Projects from "@/components/projects";
import Experiences from "@/components/experiences";
import CopyToClipboard from "react-copy-to-clipboard";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { setUserInfo } from "@/app/redux/features/user-slice";
import { rememberProfileId } from "@/lib/viewed-profile";
import { useDispatch } from "react-redux";
import { getJSON, syncVersion } from "@/lib/data-client";
import ProfileToast from "@/components/profile-toast";
import { ProfilePortrait } from "@/components/profile-portrait";
import { FileText, Copy, CalendarDays, Briefcase, Mail, ArrowUpRight } from "lucide-react";

import { Tilt } from "@/components/fx/tilt";

const FALLBACK = "https://vutz38vdur.ufs.sh/f/O8iVoUnKSnAlP7J3LDxbvrzVStD23fJj4xZMB9eRcLgWuknX";

export default function Profile() {
  const params = useParams();
  const id = params.id;

  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const url = `/api/profile/${id}`;
      // An edit made in the dashboard can land while the cached copy is still
      // inside its TTL, so compare the server's row fingerprint first and force
      // past the cache when it has moved. Without this the edit would only show
      // after a hard reload.
      const changed = await syncVersion(String(id));
      const response = await getJSON<any>(url, changed ? { force: true } : {});
      if (!response?.id) throw new Error("Invalid profile data: missing user ID");
      setProfile(response);
      rememberProfileId(String(id));
      dispatch(
        setUserInfo({
          id: id,
          role: response.role,
          name: response.name,
          domain: response.domain,
          email: response.email,
          workEmail: response.workEmail,
        })
      );
    } catch (error: any) {
      console.error("Error fetching data:", error?.response || error.message);
      toast.error("Unable to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <section className="bento" aria-busy="true" aria-label="Loading profile">
        <div className="glass shimmer h-[300px] sm:col-span-6 lg:col-span-8" />
        <div className="glass shimmer h-[300px] sm:col-span-6 lg:col-span-4" />
      </section>
    );
  }

  const image = profile?.imageUrl || FALLBACK;
  const contactEmail = profile?.workEmail || profile?.email;

  return (
    <>
      {/* ══ IDENTITY ══════════════════════════════════════════ */}
      {/* Identity and contact live in ONE panel: the portrait sets the row
          height, and a separate meta row underneath left a dead gap in the
          text column. Meta is now an inline strip, so the column fills. */}
      <section className="bento">
        <div className="glass pad rise sm:col-span-6 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-acc">
              <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} />
              {profile?.jobTitle || "Self Employed"}
            </span>
            <span className="chip">
              <span className="pin" />
              Published profile
            </span>
          </div>

          <h1 className="tt-h1 mt-4">
            Hi, I&apos;m <span className="acc">{profile?.name?.split(" ")[0] || "there"}</span>
          </h1>

          <p className="tt-body mt-3 max-w-xl">
            {profile?.bio ||
              "Welcome to my creative space! I thrive on turning ideas into reality and bringing concepts to life."}
          </p>

          {/* Inline meta strip — fills the column instead of a separate row */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {contactEmail && (
              <div className="glass-lite flex items-center gap-2.5 rounded-tile px-3 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted-ink" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="tt-mono text-[0.625rem]">Get in touch</p>
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">{contactEmail}</p>
                </div>
              </div>
            )}
            {profile?.updatedAt && (
              <div className="glass-lite flex items-center gap-2.5 rounded-tile px-3 py-2.5">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-ink" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="tt-mono text-[0.625rem]">Last updated</p>
                  <p className="truncate font-mono text-[0.8125rem] font-semibold text-ink">
                    {new Date(profile.updatedAt).toLocaleDateString("en-SG")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {profile?.resumeUrl ? (
              <Link href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-acc">
                Resume
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </Link>
            ) : (
              <span className="btn btn-glass" aria-disabled="true">
                Resume
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
            )}
            <CopyToClipboard
              text={profile?.workEmail || profile?.email}
              onCopy={() => profile?.workEmail && toast.success("Copied to clipboard!")}
            >
              <button className="btn btn-glass">
                Copy email
                <Copy className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </CopyToClipboard>
            <Link href="/projects" className="btn btn-bare">
              See the work
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* Portrait. The image is absolutely positioned so it cannot
            contribute to layout height — an in-flow `h-full` image resolves to
            `auto` here (the grid item's own height is auto) and its intrinsic
            height then forces the whole row taller than the text column,
            which is what left dead space under the buttons. */}
        <div className="rise h-full sm:col-span-6 lg:col-span-4" style={{ animationDelay: "90ms" }}>
          <Tilt max={5} className="h-full" innerClassName="h-full">
            <div className="glass relative h-full min-h-[220px] select-none overflow-hidden rounded-panel">
              <ProfileToast profile={profile} defaultProfileImage={FALLBACK}>
                <ProfilePortrait src={image} alt={profile?.name} className="absolute inset-0" />
              </ProfileToast>
            </div>
          </Tilt>
        </div>
      </section>

      <Experiences />
      <Projects />
    </>
  );
}
