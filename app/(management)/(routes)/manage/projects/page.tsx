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
import { toast } from "sonner";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

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
      // Optionally, you can handle the case where the user cancels the deletion.
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [projects]);

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

      <Badge
        variant="navy"
        className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
      >
        Personal Projects
      </Badge>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Project Name</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Created</TableHead> */}
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
                {/* <TableCell>{project?.startDate ? formatDate(project.startDate) : "N/A"}</TableCell> */}
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
                    <Button
                      variant="secondary"
                      onClick={() => deleteProjectHandler(project.id)}
                      disabled={buttonLoading}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Badge
        variant="navy"
        className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
      >
        Work Experiences
      </Badge>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Project Name</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Created</TableHead> */}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects
            ?.filter((project) => project.isWorkExperience)
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
                {/* <TableCell>{project?.startDate ? formatDate(project.startDate) : "N/A"}</TableCell> */}
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
                    <Button
                      variant="secondary"
                      onClick={() => deleteProjectHandler(project.id)}
                      disabled={buttonLoading}
                    >
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
