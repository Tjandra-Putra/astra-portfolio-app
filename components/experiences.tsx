"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ArrowUpRight, Briefcase } from "lucide-react";

import ExperienceCard from "./experience-card";
import ExperienceCardSkeleton from "@/components/skeleton/experience-card-skeleton";
import { getJSON } from "@/lib/data-client";
import { resolveProfileId } from "@/lib/viewed-profile";

interface ExperiencesProps {
  title?: string;
  showAll?: boolean;
  detailedPage?: boolean;
  currentExperienceId?: string | string[];
}

const Experiences: React.FC<ExperiencesProps> = ({ title, showAll, detailedPage, currentExperienceId }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state: any) => state.userReducer);
  const profileId = resolveProfileId(userInfo?.id);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getJSON<any[]>(`/api/projects/${profileId}`);
      setProjects(response);
      const allProjects = response.filter((project: any) => project.isWorkExperience && project.visible);
      setAllProjects(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileId) return;
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const projectsToDisplay = showAll
    ? projects.filter((project) => project.isWorkExperience && project.visible && project.id !== currentExperienceId)
    : projects.filter((project) => project.isWorkExperience && project.visible).slice(0, 3);

  const heading = showAll || detailedPage ? "Other experiences" : title || "Experiences";
  const count = showAll || detailedPage ? allProjects?.length ?? 0 : projectsToDisplay.length;

  const header = (
    <div className="reveal mb-4 flex flex-wrap items-end justify-between gap-4 sm:mb-5">
      <div>
        <p className="tt-mono">Career</p>
        <h2 className="tt-h2 mt-2.5">
          {heading} <span className="text-muted-ink">{String(count).padStart(2, "0")}</span>
        </h2>
      </div>
      {!showAll && (
        <Link href="/experiences" className="btn btn-glass btn-sm shrink-0">
          View all
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );

  if (!loading && projectsToDisplay.length === 0) {
    return (
      <section className="mt-10 sm:mt-14">
        {header}
        <div className="glass pad-lg reveal grid place-items-center text-center">
          <span className="glass-lite mb-4 grid h-12 w-12 place-items-center">
            <Briefcase className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
          </span>
          <p className="tt-h3">No experience published yet</p>
          <p className="tt-sub mt-1">Roles added and set to visible will show up here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 sm:mt-14">
      {header}

      <div className="bento">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="col-span-1 sm:col-span-3 lg:col-span-4">
                <ExperienceCardSkeleton />
              </div>
            ))
          : projectsToDisplay.map((project, i) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="reveal col-span-1 block sm:col-span-3 lg:col-span-4"
                style={{ transitionDelay: `${Math.min(i, 5) * 60}ms` }}
              >
                <ExperienceCard data={project} />
              </Link>
            ))}
      </div>
    </section>
  );
};

export default Experiences;
