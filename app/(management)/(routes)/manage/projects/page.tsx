import { faCircle, faTrash, faPen, faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import projectsData from "@/data/data";

const ProjectsPage = () => {
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
          {projectsData
            ?.filter((project) => !project.isWorkExperience)
            .map((project) => (
              <TableRow>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {project?.visible ? (
                    <Badge variant={"diamond"}>Visible</Badge>
                  ) : (
                    <Badge variant={"cheese"}>Hidden</Badge>
                  )}
                </TableCell>
                <TableCell>{project?.startDate.toLocaleDateString("en-US")}</TableCell>
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
