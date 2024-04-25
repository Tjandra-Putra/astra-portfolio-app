"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faEye,
  faSquareCheck,
  faBan,
  faCheck,
  faTrashCan,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface UserProfile {
  userId: string;
  role: string;
}

const formSchema = z.object({
  email: z.string(),
});

const DashboardPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]); // Use 'any[]' as the initial state type
  const userInfo = useSelector((state: any) => state.userReducer);
  const router = useRouter();

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      await axios.post("/api/admin/profiles/new", {
        email: values.email,
      });

      // empty the form
      form.reset();

      toast.success("User added successfully.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data);
    }
  };

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

        toast.success("Profile accepted.");
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

        toast.success("Profile rejected.");
      } else {
        console.error("Invalid data format received from the server after rejecting profile.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      // Show confirmation prompt
      const confirmed = window.confirm("Are you sure you want to delete this profile?");

      if (!confirmed) {
        // If user cancels, do nothing
        return;
      }

      const response = await axios.delete(`/api/admin/profiles/${id}`);

      if (Array.isArray(response.data)) {
        setProfiles(response.data);

        toast.success("Profile deleted.");
      } else {
        console.error("Invalid data format received from the server after deleting profile.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfiles(); // Call the fetchProfiles function within useEffect
  }, [profiles]); // Add an empty dependency array to run the effect only once on mount

  const renderBadge = (profile: UserProfile) => {
    if (profile.userId.includes("login_pending_user")) {
      return (
        <Badge variant={"sky"} className="min-w-[5.5rem] flex place-content-center">
          Pending <FontAwesomeIcon icon={faClock} className="ps-1" />
        </Badge>
      );
    } else if (profile.role === "MEMBER") {
      return (
        <Badge variant={"diamond"} className="min-w-[5.5rem] flex place-content-center">
          Member <FontAwesomeIcon icon={faCircleCheck} className="ps-1" />
        </Badge>
      );
    } else {
      return (
        <Badge variant={"cheese"} className="min-w-[5.5rem] flex place-content-center">
          Guest <FontAwesomeIcon icon={faClock} className="ps-1" />
        </Badge>
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
          <div className="job-title font-medium text-gray-800 text-lg">User Management</div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"ash"}>
              <FontAwesomeIcon icon={faPlusCircle} className="w-3 h-3 pe-2" color="" type="button" />
              Add
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Enter the email address of the user you want to add to the system.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} required />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" variant={"diamond"}>
                    Add User
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles
            ?.filter((profile) => profile.id != userInfo.id)
            ?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{renderBadge(profile)}</TableCell>
                <TableCell className="text-right flex gap-2">
                  {profile.role === "GUEST" ? (
                    <Button variant={"secondary"} onClick={() => acceptProfile(profile.id)}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  ) : (
                    <Button variant={"navy"}>
                      <FontAwesomeIcon icon={faSquareCheck} />
                    </Button>
                  )}

                  {profile.role === "GUEST" ? (
                    <Button variant={"navy"} onClick={() => rejectProfile(profile.id)}>
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
                        <Button variant={"secondary"}>
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{profile.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button variant={"secondary"} onClick={() => deleteProfile(profile.id)}>
                    <FontAwesomeIcon icon={faTrashCan} />
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
