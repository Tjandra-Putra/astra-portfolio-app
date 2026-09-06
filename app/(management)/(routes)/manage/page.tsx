"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  ArrowUpRight,
  Award,
  FolderKanban,
  GraduationCap,
  User,
  Plus,
  Check,
  Circle,
} from "lucide-react";

import { setUserInfo } from "@/app/redux/features/user-slice";
import { getJSON } from "@/lib/data-client";
import { rememberProfileId, resolveProfileId } from "@/lib/viewed-profile";

type Counts = { projects: number; experiences: number; education: number; certificate: number };

const ManagePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userReducer);
  const profileId = resolveProfileId(userInfo?.id);

  const [profile, setProfile] = useState<any>();
  const [counts, setCounts] = useState<Counts>({ projects: 0, experiences: 0, education: 0, certificate: 0 });
  const [loading, setLoading] = useState(true);

  /**
   * Resolve the signed-in user's own profile. Runs once — the previous version
   * depended on `[userInfo]` while also dispatching into it, so it re-entered
   * itself on every resolve.
   */
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/profile/current`);
      if (!data?.id) return;
      setProfile(data);
      rememberProfileId(data.id);
      dispatch(
        setUserInfo({
          id: data.id,
          role: data.role,
          name: data.name,
          domain: data.domain,
          email: data.email,
          workEmail: data.workEmail,
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profileId) return;
    (async () => {
      try {
        const [projects, education, certificate] = await Promise.all([
          getJSON<any[]>(`/api/projects/${profileId}`),
          getJSON<any[]>(`/api/education/${profileId}`),
          getJSON<any[]>(`/api/certificate/${profileId}`),
        ]);
        setCounts({
          projects: projects.filter((p) => !p.isWorkExperience).length,
          experiences: projects.filter((p) => p.isWorkExperience).length,
          education: education.length,
          certificate: certificate.length,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [profileId]);

  const name = profile?.name || userInfo?.name;

  /** What still needs doing before the public page reads as complete. */
  const checklist = [
    { label: "Add your name and role", done: Boolean(profile?.name && profile?.jobTitle), href: "/manage/profile" },
    { label: "Write a bio", done: Boolean(profile?.bio), href: "/manage/profile" },
    { label: "Add a profile photo", done: Boolean(profile?.imageUrl), href: "/manage/profile" },
    { label: "Publish a project", done: counts.projects > 0, href: "/manage/projects/add" },
    { label: "Add work experience", done: counts.experiences > 0, href: "/manage/projects/add" },
    { label: "Add education", done: counts.education > 0, href: "/manage/education/add" },
  ];
  const complete = checklist.filter((c) => c.done).length;
  const pct = Math.round((complete / checklist.length) * 100);

  const stats = [
    { label: "Projects", value: counts.projects, href: "/manage/projects", Icon: FolderKanban },
    { label: "Experience", value: counts.experiences, href: "/manage/projects", Icon: User },
    { label: "Education", value: counts.education, href: "/manage/education", Icon: GraduationCap },
    { label: "Certificates", value: counts.certificate, href: "/manage/certificate", Icon: Award },
  ];

  return (
    <div className="grid gap-3.5">
      {/* ══ Greeting + primary action ═══════════════════════ */}
      <header className="glass pad-lg rise flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="tt-mono">Dashboard</p>
          <h1 className="tt-h2 mt-1.5 truncate">{name ? `Welcome back, ${name.split(" ")[0]}` : "Welcome back"}</h1>
        </div>
        {profileId && (
          <Link href={`/profile/${profileId}`} className="btn btn-acc btn-sm shrink-0">
            View public page
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        )}
      </header>

      {/* ══ Counts ══════════════════════════════════════════ */}
      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {stats.map(({ label, value, href, Icon }, i) => (
          <Link
            key={label}
            href={href}
            className="glass pad lift sheen group rise flex flex-col justify-between"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="glass-lite grid h-8 w-8 place-items-center rounded-xs">
                <Icon className="h-4 w-4 text-ink" strokeWidth={1.75} />
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-muted-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </div>
            <div className="mt-6">
              <p className="tt-num text-[1.75rem]">{loading ? "—" : String(value).padStart(2, "0")}</p>
              <p className="tt-unit mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* ══ Completeness + quick create ═════════════════════ */}
      <section className="grid gap-3.5 lg:grid-cols-12">
        <div className="glass pad-lg rise lg:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="tt-mono">Portfolio completeness</p>
              <p className="tt-h3 mt-1.5">
                {complete} of {checklist.length} done
              </p>
            </div>
            <p className="tt-num text-[1.75rem]">{pct}%</p>
          </div>

          {/* Progress track */}
          <div className="glass-well mt-6 h-2.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-acc transition-[width] duration-700 ease-glass"
              style={{ width: `${pct}%` }}
            />
          </div>

          <ul className="mt-7 grid gap-2">
            {checklist.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="glass-lite flex items-center gap-3 rounded-tile px-3.5 py-2.5 transition-colors hover:opacity-90"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      c.done ? "bg-acc text-on-acc" : "glass-well text-muted-ink"
                    }`}
                  >
                    {c.done ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <Circle className="h-2.5 w-2.5" strokeWidth={2.5} />
                    )}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[0.8125rem] ${
                      c.done ? "text-muted-ink line-through" : "font-medium text-ink"
                    }`}
                  >
                    {c.label}
                  </span>
                  {!c.done && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-ink" strokeWidth={2} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass pad-lg rise lg:col-span-5">
          <p className="tt-mono">Quick create</p>
          <p className="tt-sub mt-1">Or press ⌘K from anywhere</p>
          <hr className="rule my-3" />
          <div className="grid gap-2.5">
            {[
              { href: "/manage/projects/add", label: "Project or role", Icon: FolderKanban },
              { href: "/manage/education/add", label: "Education entry", Icon: GraduationCap },
              { href: "/manage/certificate/add", label: "Certificate", Icon: Award },
              { href: "/manage/profile", label: "Edit profile", Icon: User },
            ].map(({ href, label, Icon }) => (
              <Link key={href} href={href} className="glass-lite flex items-center gap-3 rounded-tile px-3.5 py-3 transition-colors hover:opacity-90">
                <span className="glass-well grid h-7 w-7 shrink-0 place-items-center rounded-xs">
                  <Icon className="h-3.5 w-3.5 text-ink" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-ink">{label}</span>
                <Plus className="h-3.5 w-3.5 shrink-0 text-muted-ink" strokeWidth={2} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagePage;
