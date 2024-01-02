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
      const response = await axios.get(`/api/projects/${userInfo?.id}`);
      setProjects(response.data);

      console.log(userInfo.id);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userInfo]);

  const projectsToDisplay = showAll
    ? projects.filter((project) => !project.isWorkExperience)
    : projects.filter((project) => !project.isWorkExperience).slice(0, 3);

  // Check if there are no non-work experience projects to display
  if (projectsToDisplay.length === 0) {
    // You can render a message here
    return (
      <div className="projects bg-ash p-6 rounded-lg">
        <p>No projects available.</p>
      </div>
    );
  }

  return (
    <div className="projects bg-ash p-6 rounded-lg">
      {!showAll && (
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
        <ProjectCard key={project.id} data={project} />
      ))}
    </div>
  );
};

export default Projects;
