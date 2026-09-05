"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ArrowRight, FolderOpen } from "lucide-react";

import ProjectCard from "./project-card";
import ProjectCardSkeleton from "@/components/skeleton/project-card-skeleton";
import { getJSON } from "@/lib/data-client";

interface ProjectsProps {
  title?: string;
  showAll?: boolean;
  detailedPage?: boolean;
  currentProjectId?: string | string[];
}

const Projects: React.FC<ProjectsProps> = ({ title, showAll, detailedPage, currentProjectId }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getJSON<any[]>(`/api/projects/${userInfo?.id}`);
      setProjects(response);
      const allProjects = response.filter((project: any) => !project.isWorkExperience && project.visible);
      setAllProjects(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id) fetchProjects();
  }, [userInfo]);

  const filteredProjects = projects.filter((project) => !project.isWorkExperience && project.visible && project.id !== currentProjectId);
  const projectsToDisplay = showAll ? filteredProjects : filteredProjects.slice(0, 3);
  const heading = showAll || detailedPage ? "Other projects" : title || "Projects";
  const count = showAll || detailedPage ? allProjects?.length ?? 0 : filteredProjects.length;

  if (!loading && projectsToDisplay.length === 0) {
    return (
      <section className="mt-10 sm:mt-14">
        <div className="reveal">
          <p className="tt-mono">Work</p>
          <h2 className="tt-h2 mt-2.5">{heading}</h2>
        </div>

        <div className="glass pad-lg reveal mt-5 grid place-items-center text-center">
          <span className="glass-well mb-4 grid h-12 w-12 place-items-center rounded-tile">
            <FolderOpen className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
          </span>
          <p className="tt-h3">No projects published yet</p>
          <p className="tt-sub mt-1.5">Once a project is added and made visible, it shows up here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 sm:mt-14">
      <div className="reveal mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tt-mono">Work</p>
          <h2 className="tt-h2 mt-2.5">
            {heading} <span className="text-muted-ink">{String(count).padStart(2, "0")}</span>
          </h2>
        </div>
        {!showAll && (
          <Link href="/projects" className="btn btn-glass btn-sm shrink-0">
            View all
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>

      <div className="bento">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="rise col-span-1 sm:col-span-3 lg:col-span-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <ProjectCardSkeleton />
              </div>
            ))
          : projectsToDisplay.map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="reveal col-span-1 block sm:col-span-3 lg:col-span-4"
              >
                <ProjectCard data={project} />
              </Link>
            ))}
      </div>
    </section>
  );
};

export default Projects;
