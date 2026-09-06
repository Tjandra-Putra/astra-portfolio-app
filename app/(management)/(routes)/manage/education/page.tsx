"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Pencil, Plus, Search, Trash2 } from "lucide-react";

type Filter = "all" | "visible" | "hidden";

/** "2019 — 2022", or "2019 — Present" while it is still running. */
const yearRange = (start: string | null, end: string | null) => {
  if (!start) return "";
  const from = new Date(start).getFullYear();
  const to = end ? new Date(end).getFullYear() : null;
  return `${from} — ${to ?? "Present"}`;
};

const ManageEducationPage = () => {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Toolbar state — filters the already-fetched array, no extra requests.
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchEducations = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/manage/education");
      setEducations(response.data);
    } catch (error) {
      console.error("Error fetching educations:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEducationHandler = async (id: string) => {
    // Display a confirmation prompt
    const confirmed = window.confirm("Are you sure you want to delete this certificate?");

    // If the user confirms, proceed with deletion
    if (confirmed) {
      console.log("DELETE CONFIRMED");
      try {
        setButtonLoading(true);
        await axios.delete(`/api/manage/education/${id}`);
        toast.success("Education deleted successfully");
      } catch (error) {
        console.error("Error deleting education:", error);
      } finally {
        setButtonLoading(false);
      }
    } else {
      console.log("DELETE CANCELLED");
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return educations
      .slice()
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .filter((education) => {
        if (filter === "visible" && !education?.visible) return false;
        if (filter === "hidden" && education?.visible) return false;
        if (!q) return true;
        return [education.schoolName, education.degree, education.fieldOfStudy]
          .filter(Boolean)
          .some((value: string) => value.toLowerCase().includes(q));
      });
  }, [educations, query, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "visible", label: "Visible" },
    { key: "hidden", label: "Hidden" },
  ];

  return (
    <div className="grid gap-3">
      {/* ══ Header ══════════════════════════════════════════ */}
      <header className="glass pad rise flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="tt-mono">Education</p>
          <h1 className="tt-h2 mt-1.5">Schools &amp; degrees</h1>
        </div>
        <Link href="/manage/education/add" className="btn btn-acc btn-sm shrink-0">
          <Plus className="h-4 w-4" strokeWidth={2} /> Add
        </Link>
      </header>

      {/* ══ Toolbar ═════════════════════════════════════════ */}
      <div className="glass pad-sm rise flex flex-wrap items-center justify-between gap-3" style={{ animationDelay: "60ms" }}>
        <div className="relative min-w-0 flex-1 sm:max-w-[22rem]">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-ink"
            strokeWidth={1.75}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schools, degrees, fields"
            aria-label="Search education"
            className="field field-icon"
          />
        </div>

        <div className="seg" role="group" aria-label="Filter by visibility">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`seg-btn ${filter === key ? "is-on" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Records ═════════════════════════════════════════ */}
      <section className="glass pad rise" style={{ animationDelay: "120ms" }}>
        {loading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-lite shimmer h-[62px] rounded-tile" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="glass-well pad-lg grid place-items-center rounded-tile text-center">
            <span className="glass-bright grid h-12 w-12 place-items-center rounded-tile">
              <GraduationCap className="h-5 w-5 text-ink" strokeWidth={1.75} />
            </span>
            <p className="tt-h3 mt-4">{educations.length === 0 ? "No education yet" : "No matches"}</p>
            <p className="tt-sub mt-1.5 max-w-sm">
              {educations.length === 0
                ? "Add a school or degree and it appears on your public page."
                : "Nothing matches this search and filter. Try a different term."}
            </p>
            {educations.length === 0 ? (
              <Link href="/manage/education/add" className="btn btn-acc btn-sm mt-4">
                <Plus className="h-4 w-4" strokeWidth={2} /> Add education
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="btn btn-glass btn-sm mt-4"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="glass-lite rows overflow-hidden rounded-tile">
            {rows.map((education) => {
              const meta = [education.degree, education.fieldOfStudy].filter(Boolean).join(", ");
              const range = yearRange(education.startDate, education.endDate);

              return (
                <div key={education.id} className="rowitem">
                  <span className="glass-well grid h-9 w-9 shrink-0 place-items-center rounded-xs">
                    <GraduationCap className="h-4 w-4 text-ink" strokeWidth={1.75} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.875rem] font-medium text-ink">{education.schoolName}</p>
                    {meta && <p className="tt-sub mt-0.5 truncate">{meta}</p>}
                  </div>

                  {range && <span className="tt-mono hidden shrink-0 md:block">{range}</span>}

                  <span className={`chip hidden shrink-0 sm:inline-flex ${education?.visible ? "" : "chip-acc"}`}>
                    {education?.visible ? (
                      <React.Fragment>
                        <Eye className="h-3 w-3" strokeWidth={1.75} /> Visible
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <EyeOff className="h-3 w-3" strokeWidth={1.75} /> Hidden
                      </React.Fragment>
                    )}
                  </span>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      href={`/manage/education/${education.id}/edit`}
                      className="iconbtn iconbtn-sm"
                      aria-label={`Edit ${education.schoolName}`}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteEducationHandler(education.id)}
                      disabled={buttonLoading}
                      className="iconbtn iconbtn-sm"
                      aria-label={`Delete ${education.schoolName}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageEducationPage;
