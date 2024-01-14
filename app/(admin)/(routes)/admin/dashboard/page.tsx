"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleXmark, faEye, faSquareCheck, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DashboardPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]); // Use 'any[]' as the initial state type
  const userInfo = useSelector((state: any) => state.userReducer);
  const router = useRouter();

  useEffect(() => {
    if (userInfo.role !== "ADMIN") {
      toast.error("You are not authorized to access this page.");
      return router.push("/manage");
    }
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("/api/admin/profiles"); // Use 'await' to wait for the response

      setProfiles(response.data); // Access 'data' property of the response
    } catch (error) {
      console.error(error); // Use 'console.error' for better visibility of errors
    }
  };

  const acceptProfile = async (id: string) => {
    try {
      const response = await axios.put(`/api/admin/profiles/${id}`, {
        role: "MEMBER",
      });

      if (Array.isArray(response.data)) {
        setProfiles(response.data);
      } else {
        console.error("Invalid data format received from the server after accepting profile.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectProfile = async (id: string) => {
    try {
      const response = await axios.put(`/api/admin/profiles/${id}`, {
        role: "GUEST",
      });

      if (Array.isArray(response.data)) {
        setProfiles(response.data);
      } else {
        console.error("Invalid data format received from the server after rejecting profile.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfiles(); // Call the fetchProfiles function within useEffect
  }, [profiles]); // Add an empty dependency array to run the effect only once on mount

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">User Management</div>
      </div>

      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles
            ?.filter((profile) => profile.id != userInfo.id)
            ?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.email}</TableCell>
                <TableCell>
                  {profile.role === "MEMBER" ? (
                    <Badge variant={"sky"}>
                      Member <FontAwesomeIcon icon={faCircleCheck} className="ps-1" />
                    </Badge>
                  ) : (
                    <Badge variant={"cheese"}>
                      Guest <FontAwesomeIcon icon={faClock} className="ps-1" />
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2">
                  {profile.role === "GUEST" ? (
                    <Button variant={"secondary"} onClick={() => acceptProfile(profile.id)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  ) : (
                    <Button variant={"diamond"}>
                      <FontAwesomeIcon icon={faSquareCheck} />
                    </Button>
                  )}

                  {profile.role === "GUEST" ? (
                    <Button variant={"tomato"} onClick={() => rejectProfile(profile.id)}>
                      <FontAwesomeIcon icon={faBan} />
                    </Button>
                  ) : (
                    <Button variant={"secondary"} onClick={() => rejectProfile(profile.id)}>
                      <FontAwesomeIcon icon={faBan} />
                    </Button>
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant={"secondary"} onClick={() => rejectProfile(profile.id)}>
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{profile.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardPage;
