"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { GraduationCap } from "lucide-react";
import Loader from "@/components/layout/loader";
import { getJSON, syncVersion } from "@/lib/data-client";

const EducationPage = () => {
  const [educations, setEducations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const changed = await syncVersion(String(userInfo.id));
      const response = await getJSON<any[]>(`/api/education/${userInfo.id}`, changed ? { force: true } : {});
      const visible = response.filter((e: any) => e.visible);
      visible.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setEducations(visible);
    } catch (error) {
      console.error("Error fetching educations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  return (
    <div className="grid gap-3.5">
      {/* ══ Masthead panel ═══════════════════════════════════ */}
      <header className="glass pad-lg rise">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <span className="tt-mono inline-flex items-center gap-2">
              <span className="pin" /> 04 — Education
            </span>
            <h1 className="tt-h1 mt-5">
              What I&apos;ve <span className="acc">studied.</span>
            </h1>
            <p className="tt-body mt-4">
              Degrees, fields of study and the things I actually came away knowing.
            </p>
          </div>
          <span className="glass-lite grid h-12 w-12 place-items-center rounded-tile">
            <GraduationCap className="h-[18px] w-[18px] text-ink" strokeWidth={1.75} />
          </span>
        </div>
      </header>

      {/* ══ Records ══════════════════════════════════════════ */}
      {loading ? (
        <Loader className="!my-0" />
      ) : educations.length > 0 ? (
        educations.map((ed, i) => (
          <article
            key={ed.id}
            className="glass pad reveal"
            style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
          >
            <div className="grid gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-8">
                <div className="flex items-center gap-3">
                  <span className="tt-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rule flex-1" />
                </div>

                <h2 className="tt-h2 mt-4">{ed.schoolName}</h2>
                <p className="tt-sub mt-2">
                  {ed.fieldOfStudy}, {ed.degree}
                </p>

                {ed.description && (
                  <div
                    className="tt-body mt-5 whitespace-pre-line [&_a]:text-acc-text [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: ed.description }}
                  />
                )}

                {ed.skills && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {ed.skills
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((s: string) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Meta column */}
              <div className="md:col-span-4">
                <div className="glass-lite pad-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="tt-mono">Period</span>
                    <span className="tt-mono text-[0.8125rem] text-ink">
                      {new Date(ed.startDate).getFullYear()} —{" "}
                      {ed.endDate ? new Date(ed.endDate).getFullYear() : "Present"}
                    </span>
                  </div>

                  {ed.grade && (
                    <>
                      <hr className="rule my-3.5" />
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="tt-mono">Grade</span>
                        <span className="tt-mono break-all text-right text-[0.8125rem] text-ink">{ed.grade}</span>
                      </div>
                    </>
                  )}
                </div>

                {!ed.endDate && <span className="chip chip-acc mt-2.5">Currently enrolled</span>}
              </div>
            </div>
          </article>
        ))
      ) : (
        <section className="glass pad-lg reveal grid place-items-center text-center">
          <span className="glass-lite mb-4 grid h-12 w-12 place-items-center rounded-tile">
            <GraduationCap className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
          </span>
          <p className="tt-h3">No education published yet</p>
          <p className="tt-sub mt-1.5 max-w-xs">
            Schools, degrees and fields of study will appear here once they are added and set to visible.
          </p>
        </section>
      )}
    </div>
  );
};

export default EducationPage;
