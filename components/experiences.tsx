"use client";

import React, { useEffect, useState } from "react";
import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import Link from "next/link";
import ExperienceCard from "./experience-card";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "./layout/loader";

interface ExperiencesProps {
  title?: string;
  showAll?: boolean;
  detailedPage?: boolean;
}

const Experiences: React.FC<ExperiencesProps> = ({ title, showAll, detailedPage }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${userInfo?.id}`);
      // Only show 3 projects on the home page
      setProjects(response.data);

      // Projects exclusive of non work experience
      const allProjects = response.data.filter((project: any) => project.isWorkExperience && project.visible);
      setAllProjects(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userInfo]);

  const projectsToDisplay = showAll
    ? projects.filter((project) => project.isWorkExperience && project.visible)
    : projects.filter((project) => project.isWorkExperience && project.visible).slice(0, 3);

  return loading ? (
    <Loader />
  ) : (
    <div className="projects bg-ash md:p-6 p-3 rounded-lg sm:mt-6 mt-3">
      {projectsToDisplay.length === 0 ? (
        "No project experiences available."
      ) : !showAll ? (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 sm:text-lg text-base">
              {title || `Experiences (${allProjects?.length})`}
            </div>
          </div>
          <Link href={"/experiences"}>
            <Button variant="white">
              View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
            </Button>
          </Link>
        </div>
      ) : !showAll || !detailedPage ? (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 sm:text-lg text-base">
              All Experiences ({allProjects?.length})
            </div>
          </div>
        </div>
      ) : null}

      {/* Use map to render ProjectCard components based on the projectsToDisplay array */}
      {detailedPage && (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 sm:text-lg text-base">{title || "Projects"}</div>
          </div>
          <Link href={"/experiences"}>
            <Button variant="white">
              View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
            </Button>
          </Link>
        </div>
      )}
      {projectsToDisplay.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <ExperienceCard key={project.id} data={project} />
        </Link>
      ))}
    </div>
  );
};

export default Experiences;
