"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Briefcase, Eye, EyeOff, FolderKanban, Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";

type Filter = "all" | "visible" | "hidden";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Toolbar state — filters the already-fetched array, no extra requests.
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/manage/projects");
      setProjects(response.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);

      setLoading(false);
    }
  };

  const deleteProjectHandler = async (id: string) => {
    // Display a confirmation prompt
    const confirmed = window.confirm("Are you sure you want to delete this project?");

    // If the user confirms, proceed with deletion
    if (confirmed) {
      console.log("DELETE CONFIRMED");
      try {
        setButtonLoading(true);
        await axios.delete(`/api/manage/projects/${id}`);
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
      } finally {
        setButtonLoading(false);
      }
    } else {
      console.log("DELETE CANCELLED");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /**
   * One list, newest first — the old page split personal projects and work
   * experience into two tables, which meant the same record type was managed in
   * two places. The row's icon and subtitle carry the distinction instead.
   */
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return projects
      .slice()
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .filter((project) => {
        if (filter === "visible" && !project?.visible) return false;
        if (filter === "hidden" && project?.visible) return false;
        if (!q) return true;
        return [project.name, project.workExperienceTitle, project.company, project.category]
          .filter(Boolean)
          .some((value: string) => value.toLowerCase().includes(q));
      });
  }, [projects, query, filter]);

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
          <p className="tt-mono">Work</p>
          <h1 className="tt-h2 mt-1.5">Projects &amp; experience</h1>
        </div>
        <Link href="/manage/projects/add" className="btn btn-acc btn-sm shrink-0">
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
            placeholder="Search projects, roles, companies"
            aria-label="Search projects"
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
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-lite shimmer h-[62px] rounded-tile" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="glass-well pad-lg grid place-items-center rounded-tile text-center">
            <span className="glass-bright grid h-12 w-12 place-items-center rounded-tile">
              <FolderKanban className="h-5 w-5 text-ink" strokeWidth={1.75} />
            </span>
            <p className="tt-h3 mt-4">{projects.length === 0 ? "No projects yet" : "No matches"}</p>
            <p className="tt-sub mt-1.5 max-w-sm">
              {projects.length === 0
                ? "Add a project or a role and it appears on your public page."
                : "Nothing matches this search and filter. Try a different term."}
            </p>
            {projects.length === 0 ? (
              <Link href="/manage/projects/add" className="btn btn-acc btn-sm mt-4">
                <Plus className="h-4 w-4" strokeWidth={2} /> Add a project
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
            {rows.map((project) => {
              const Icon = project.isWorkExperience ? Briefcase : Layers;
              const title = project.isWorkExperience
                ? project.workExperienceTitle || project.name
                : project.name || project.workExperienceTitle;
              const meta = [project.company, project.category].filter(Boolean).join(" / ");

              return (
                <div key={project.id} className="rowitem">
                  <span className="glass-well grid h-9 w-9 shrink-0 place-items-center rounded-xs">
                    <Icon className="h-4 w-4 text-ink" strokeWidth={1.75} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.875rem] font-medium text-ink">{title || "Untitled"}</p>
                    {meta && <p className="tt-sub mt-0.5 truncate">{meta}</p>}
                  </div>

                  <span className={`chip hidden shrink-0 sm:inline-flex ${project?.visible ? "" : "chip-acc"}`}>
                    {project?.visible ? (
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
                      href={`/projects/${project.id}`}
                      target="_blank"
                      className="iconbtn iconbtn-sm"
                      aria-label={`View ${title || "project"}`}
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <Link
                      href={`/manage/projects/${project.id}/edit`}
                      className="iconbtn iconbtn-sm"
                      aria-label={`Edit ${title || "project"}`}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProjectHandler(project.id)}
                      disabled={buttonLoading}
                      className="iconbtn iconbtn-sm"
                      aria-label={`Delete ${title || "project"}`}
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

export default ProjectsPage;
