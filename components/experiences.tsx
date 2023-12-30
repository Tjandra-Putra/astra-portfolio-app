"use client";

import React, { useEffect, useState } from "react";
import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import Link from "next/link";
import projectsData from "@/data/data";
import ExperienceCard from "./experience-card";
import axios from "axios";

interface ExperiencesProps {
  title?: string;
  showAll?: boolean;
}

const Experiences: React.FC<ExperiencesProps> = ({ title, showAll }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects");
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const projectsToDisplay = showAll
    ? projects.filter((project) => project.isWorkExperience)
    : projects.filter((project) => project.isWorkExperience).slice(0, 3);

  // Check if there are no project experiences to display
  if (projectsToDisplay.length === 0) {
    return (
      <div className="projects bg-ash p-6 rounded-lg mt-6">
        <p>No project experiences available.</p>
      </div>
    );
  }

  return (
    <div className="projects bg-ash p-6 rounded-lg mt-6">
      {!showAll && (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 text-lg">{title || "Experiences"}</div>
          </div>
          <Link href={"/projects"}>
            <Button variant="white">
              View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
            </Button>
          </Link>
        </div>
      )}
      {projectsToDisplay.map((project) => (
        <ExperienceCard key={project.id} data={project} />
      ))}
    </div>
  );
};

export default Experiences;
