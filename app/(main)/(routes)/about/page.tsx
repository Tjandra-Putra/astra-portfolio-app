"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FileText, Quote } from "lucide-react";
import Loader from "@/components/layout/loader";
import { getJSON, syncVersion } from "@/lib/data-client";
import { Tilt } from "@/components/fx/tilt";

const GREETINGS = ["Hello", "Hola", "Bonjour", "Ciao", "你好", "안녕하세요", "こんにちは", "Olá"];

const AboutPage = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();

  const fetchProfile = async () => {
    try {
      const changed = await syncVersion(String(userInfo.id));
      const response = await getJSON<any>(`/api/profile/${userInfo.id}`, changed ? { force: true } : {});
      setProfile(response);
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userInfo.id]);

  if (!profile)
    return (
      <div className="rise">
        <section className="glass pad-lg">
          <p className="tt-mono">Colophon</p>
          <div className="glass-lite shimmer mt-5 h-10 w-[min(24rem,82%)] rounded-tile" />
          <hr className="rule my-7" />
          <div className="flex flex-wrap gap-2">
            {GREETINGS.map((greeting) => (
              <span key={greeting} className="glass-lite shimmer h-[27px] w-[4.5rem] rounded-xs" />
            ))}
          </div>
        </section>

        <div className="bento mt-3.5">
          <div className="glass shimmer aspect-[4/5] rounded-panel sm:col-span-2 lg:col-span-4" />
          <div className="glass pad-lg sm:col-span-4 lg:col-span-8">
            <div className="grid gap-3">
              {[100, 94, 97, 78].map((w, i) => (
                <span key={i} className="glass-lite shimmer h-3.5 rounded-xs" style={{ width: `${w}%` }} />
              ))}
            </div>
            <Loader />
          </div>
        </div>
      </div>
    );

  return (
    <>
      {/* ══ HEADER PANEL ════════════════════════════════════ */}
      <section className="glass pad-lg rise">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="tt-mono inline-flex items-center gap-2">
              <span className="pin" /> Colophon
            </p>
            <h1 className="tt-h1 mt-4 max-w-[20ch]">
              A little <span className="acc">about me.</span>
            </h1>
            {(profile?.bio || profile?.jobTitle) && (
              <p className="tt-lead mt-5 max-w-md">{profile.bio || profile.jobTitle}</p>
            )}
          </div>

          {profile?.updatedAt && (
            <div className="glass-lite pad-sm min-w-[9.5rem]">
              <p className="tt-mono">Last updated</p>
              <p className="tt-num mt-2.5 text-[1.75rem]">
                {new Date(profile.updatedAt).toLocaleDateString("en-GB", { day: "2-digit" })}
              </p>
              <p className="tt-unit mt-1">
                {new Date(profile.updatedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </p>
            </div>
          )}
        </div>

        <hr className="rule my-7" />

        <p className="tt-mono">{GREETINGS.length} ways to say hello</p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {GREETINGS.map((greeting) => (
            <span key={greeting} className="chip">
              {greeting}
            </span>
          ))}
        </div>
      </section>

      {/* ══ PORTRAIT + COPY ═════════════════════════════════ */}
      <div className="bento mt-3.5">
        {profile?.imageUrl && (
          <Tilt max={5} className="reveal select-none sm:col-span-2 lg:col-span-4">
            <div className="glass rounded-panel p-2.5">
              <img
                src={profile.imageUrl}
                alt={profile?.name}
                className="aspect-[4/5] w-full rounded-tile object-cover"
              />
            </div>
          </Tilt>
        )}

        <div
          className={`glass pad-lg reveal ${
            profile?.imageUrl ? "sm:col-span-4 lg:col-span-8" : "sm:col-span-6 lg:col-span-12"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="tt-mono">In my own words</p>
            <span className="glass-lite grid h-9 w-9 place-items-center rounded-xs">
              <Quote className="h-4 w-4 text-ink" strokeWidth={1.75} />
            </span>
          </div>

          <hr className="rule my-6" />

          {profile?.about ? (
            <div
              className="tt-body whitespace-pre-line [&_a]:text-[var(--acc-text)] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: profile.about }}
            />
          ) : (
            <div className="glass-well pad-lg grid place-items-center text-center">
              <span className="glass-bright mb-4 grid h-12 w-12 place-items-center rounded-tile">
                <FileText className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
              </span>
              <p className="tt-h3">Nothing written here yet</p>
              <p className="tt-sub mt-1">This colophon fills in once an about section is added from the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AboutPage;
