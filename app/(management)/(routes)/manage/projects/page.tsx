"use client";

import { faCircle, faTrash, faPen, faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import projectsData from "@/data/data";
import axios from "axios";
import { formatDate } from "@/lib/format-date";

const ProjectsPage = () => {
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

  return (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3 justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
          <div className="job-title font-medium text-gray-800 text-lg">Manage Projects</div>
        </div>
        <Link href="/manage/projects/add">
          <Button variant="navy">
            <FontAwesomeIcon icon={faPlusCircle} className="w-3 h-3 pe-2" color="" />
            Add
          </Button>
        </Link>
      </div>
      <div className="text-gray-800 mb-7 font-normal">
        Your projects are listed below. You can edit, delete, or hide them from your profile.
      </div>

      {/* fetchProjects: {JSON.stringify(projects)} */}

      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects
            ?.filter((project) => !project.isWorkExperience)
            .map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {project?.visible ? (
                    <Badge variant={"diamond"}>Visible</Badge>
                  ) : (
                    <Badge variant={"cheese"}>Hidden</Badge>
                  )}
                </TableCell>
                <TableCell>{project?.startDate ? formatDate(project.startDate) : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="buttons flex gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="secondary">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </Link>
                    <Link href={`/manage/projects/${project.id}/edit`}>
                      <Button variant="secondary">
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                    </Link>
                    <Button variant="secondary">
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default ProjectsPage;
