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

interface ProjectsProps {
  title?: string;
  showAll?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ title, showAll }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/projects/${userInfo?.id}`);
      setProjects(response.data);

      console.log("projects: ", projects);

      console.log(userInfo.id);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const projectsToDisplay = showAll
    ? projects.filter((project) => !project.isWorkExperience && project.visible)
    : projects.filter((project) => !project.isWorkExperience && project.visible).slice(0, 3);

  return loading ? (
    <Loader />
  ) : (
    <div className="projects bg-ash p-6 rounded-lg">
      {projectsToDisplay.length === 0
        ? "No projects available."
        : !showAll && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
                <div className="font-medium text-gray-800 text-lg">{title || "Projects"}</div>
              </div>
              <Link href={"/projects"}>
                <Button variant="white">
                  View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
                </Button>
              </Link>
            </div>
          )}
      {/* Use map to render ProjectCard components based on the projectsToDisplay array */}
      {projectsToDisplay.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <ProjectCard key={project.id} data={project} />
        </Link>
      ))}
    </div>
  );
};

export default Projects;
