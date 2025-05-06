"use client";

import React, { useEffect, useState } from "react";
import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import ProjectCard from "./project-card";
import Link from "next/link";
import projectsData from "@/data/data";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "./layout/loader";
import { useTheme } from "next-themes";

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

  const { resolvedTheme } = useTheme();

  const getButtonVariant = () => {
    if (resolvedTheme === "dark") {
      return "secondary";
    }
    return "white";
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/projects/${userInfo?.id}`);
      // Only show 3 projects on the home page
      setProjects(response.data);

      // Projects exclusive of work experience
      const allProjects = response.data.filter((project: any) => !project.isWorkExperience && project.visible);
      setAllProjects(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      fetchProjects();
    }
  }, [userInfo]);

  const filteredProjects = projects.filter((project) => !project.isWorkExperience && project.visible && project.id !== currentProjectId);

  const projectsToDisplay = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  return loading ? (
    <Loader />
  ) : (
    <div className="projects bg-ash md:p-6 p-3 rounded-lg dark:bg-black/50 dark:backdrop-blur-md dark:border dark:border-white/10">
      {projectsToDisplay && projectsToDisplay?.length === 0 && !loading ? (
        <div>No projects available.</div>
      ) : (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 sm:text-lg text-base dark:text-zinc-400">
              {showAll || detailedPage ? `Other Projects (${allProjects?.length - 1})` : title || `Projects (${filteredProjects.length})`}
            </div>
          </div>
          {!showAll && (
            <Link href={"/projects"}>
              <Button variant={getButtonVariant()}>
                View All <FontAwesomeIcon icon={faArrowRight} className="ms-2 dark:text-zinc-300" color="#000000" />
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Use map to render ProjectCard components based on the projectsToDisplay array */}
      {detailedPage && (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 sm:text-lg text-base">{`${title}` || `Projects ${projectsToDisplay?.length}`}</div>
          </div>
          <Link href={"/projects"}>
            <Button variant="white">
              View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
            </Button>
          </Link>
        </div>
      )}

      {projectsToDisplay.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <ProjectCard key={project.id} data={project} />
        </Link>
      ))}
    </div>
  );
};

export default Projects;
