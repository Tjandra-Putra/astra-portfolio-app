"use client";

import { faCircle, faTrash, faPen, faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ManageEducationPage = () => {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const fetchEducations = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/manage/education");
      setEducations(response.data);
    } catch (error) {
      console.error("Error fetching educations:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEducationHandler = async (id: string) => {
    // Display a confirmation prompt
    const confirmed = window.confirm("Are you sure you want to delete this certificate?");

    // If the user confirms, proceed with deletion
    if (confirmed) {
      console.log("DELETE CONFIRMED");
      try {
        setButtonLoading(true);
        await axios.delete(`/api/manage/education/${id}`);
        toast.success("Education deleted successfully");
      } catch (error) {
        console.error("Error deleting education:", error);
      } finally {
        setButtonLoading(false);
      }
    } else {
      console.log("DELETE CANCELLED");
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  return (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3 justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
          <div className="job-title font-medium text-gray-800 text-lg">Manage Education</div>
        </div>
        <Link href="/manage/education/add">
          <Button variant="ash">
            <FontAwesomeIcon icon={faPlusCircle} className="w-3 h-3 pe-2" color="" />
            Add
          </Button>
        </Link>
      </div>

      <div className="text-gray-800 mb-6 font-normal text-sm sm:text-base">
        Manage your educations here. You can add, edit, and delete educations.
      </div>

      <Badge variant="navy" className="text-base font-semibold w-full justify-start rounded-lg rounded-bl-none rounded-br-none">
        Educations
      </Badge>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Institution</TableHead>
            <TableHead>Visiblity</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? // Skeleton rows while loading
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : // Actual content
              educations
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((education) => (
                  <TableRow key={education.id}>
                    <TableCell className="font-medium">{education.schoolName}</TableCell>
                    <TableCell>{education?.visible ? <Badge variant="diamond">Visible</Badge> : <Badge variant="cheese">Hidden</Badge>}</TableCell>
                    <TableCell>
                      <div className="buttons flex gap-2">
                        <Link href={`/manage/education/${education.id}/edit`}>
                          <Button variant="secondary">
                            <FontAwesomeIcon icon={faPen} />
                          </Button>
                        </Link>
                        <Button variant="secondary" disabled={buttonLoading} onClick={() => deleteEducationHandler(education.id)}>
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

export default ManageEducationPage;
