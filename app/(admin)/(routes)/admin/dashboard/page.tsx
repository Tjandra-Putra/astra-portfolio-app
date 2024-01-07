"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      <h1>Dashboard</h1>
      {/* Render your profiles data here */}
      <ul></ul>

      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="w-[120px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles
            ?.filter((profile) => profile.id != userInfo.id)
            ?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.email}</TableCell>
                <TableCell className="font-medium">{profile.name}</TableCell>
                <TableCell>{profile.role}</TableCell>
                <TableCell className="text-right flex gap-2">
                  {profile.role === "MEMBER" ? (
                    <Button variant={"diamond"}>Accepted</Button>
                  ) : (
                    <Button variant={"secondary"} onClick={() => acceptProfile(profile.id)}>
                      Accept
                    </Button>
                  )}
                  <Button variant={"secondary"} onClick={() => rejectProfile(profile.id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardPage;
