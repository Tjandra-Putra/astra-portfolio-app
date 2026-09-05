"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FileText, Quote, CalendarDays } from "lucide-react";
import { getJSON, syncVersion } from "@/lib/data-client";
import { resolveProfileId } from "@/lib/viewed-profile";
import { Tilt } from "@/components/fx/tilt";
import { ProfilePortrait } from "@/components/profile-portrait";

const GREETINGS = ["Hello", "Hola", "Bonjour", "Ciao", "你好", "안녕하세요", "こんにちは", "Olá"];

const AboutPage = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  // redux is cleared on sign-out; fall back to the durable viewed-profile id
  // so a refresh on this route still knows whose data to load.
  const profileId = resolveProfileId(userInfo?.id);
  const [profile, setProfile] = useState<any>();

  const fetchProfile = async () => {
    try {
      const changed = await syncVersion(profileId);
      const response = await getJSON<any>(`/api/profile/${profileId}`, changed ? { force: true } : {});
      setProfile(response);
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    }
  };

  useEffect(() => {
    if (!profileId) return;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  /* One grid row, two panels. The previous layout stacked a full-width header
     panel above a second row, which made a short page scroll twice as far. */
  if (!profile)
    return (
      <div className="bento rise">
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4">
          <div className="glass shimmer min-h-[230px] flex-1 rounded-panel" />
          <div className="glass shimmer h-[62px] shrink-0 rounded-panel" />
        </div>
        <div className="glass pad sm:col-span-4 lg:col-span-8">
          <div className="glass-lite shimmer h-8 w-[min(20rem,78%)] rounded-tile" />
          <hr className="rule my-4" />
          <div className="grid gap-2.5">
            {[100, 96, 92, 98, 74].map((w, i) => (
              <span key={i} className="glass-lite shimmer h-3.5 rounded-xs" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="bento">
      {/* ══ Left rail: portrait + compact meta ═══════════════
          The portrait FILLS the row rather than setting it. A fixed
          aspect-ratio here made the image dictate the row height, so the copy
          panel stretched to match and left dead space under its text. The
          image is absolutely positioned so it cannot contribute height at all —
          the copy column decides, and the portrait crops to fit. */}
      <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4">
        {profile?.imageUrl && (
          <Tilt max={5} className="rise min-h-0 flex-1 select-none" innerClassName="h-full">
            <div className="glass relative h-full min-h-[230px] rounded-panel p-2">
              <ProfilePortrait
                src={profile.imageUrl}
                alt={profile?.name}
                className="absolute inset-2 rounded-tile"
              />
            </div>
          </Tilt>
        )}

        {/* Meta as a single row, not a big numeral tile */}
        {(profile?.name || profile?.updatedAt) && (
          <div className="glass pad-sm rise flex shrink-0 items-center gap-2.5" style={{ animationDelay: "70ms" }}>
            <span className="glass-lite grid h-9 w-9 shrink-0 place-items-center rounded-xs">
              <CalendarDays className="h-4 w-4 text-ink" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="tt-mono text-[0.625rem]">Last updated</p>
              <p className="truncate font-mono text-[0.8125rem] font-semibold text-ink">
                {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString("en-SG") : "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ══ Everything else in one panel ═════════════════════ */}
      <div
        className={`glass pad rise ${
          profile?.imageUrl ? "sm:col-span-4 lg:col-span-8" : "sm:col-span-6 lg:col-span-12"
        }`}
        style={{ animationDelay: "40ms" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="tt-mono inline-flex items-center gap-2">
              <span className="pin" /> Colophon
            </p>
            <h1 className="tt-h1 mt-3 max-w-[20ch]">
              A little <span className="acc">about me.</span>
            </h1>
          </div>
          <span className="glass-lite grid h-9 w-9 shrink-0 place-items-center rounded-xs">
            <Quote className="h-4 w-4 text-ink" strokeWidth={1.75} />
          </span>
        </div>

        {(profile?.bio || profile?.jobTitle) && (
          <p className="tt-body mt-3 max-w-xl">{profile.bio || profile.jobTitle}</p>
        )}

        {/* Greetings as one mono line rather than a labelled chip grid */}
        <p className="tt-mono mt-4 leading-relaxed">{GREETINGS.join("  ·  ")}</p>

        <hr className="rule my-4" />

        {profile?.about ? (
          <div
            className="tt-body whitespace-pre-line [&_a]:text-[var(--acc-text)] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: profile.about }}
          />
        ) : (
          <div className="glass-well pad grid place-items-center text-center">
            <span className="glass-bright mb-3 grid h-10 w-10 place-items-center rounded-tile">
              <FileText className="h-4 w-4 text-muted-ink" strokeWidth={1.75} />
            </span>
            <p className="tt-h3">Nothing written here yet</p>
            <p className="tt-sub mt-1">This colophon fills in once an about section is added from the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
