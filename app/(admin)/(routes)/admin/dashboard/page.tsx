"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Ban, Check, Clock, Crown, Eye, Loader2, Plus, ShieldCheck, Trash2, Users } from "lucide-react";

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
  const [loading, setLoading] = useState<boolean>(false);

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // add new users
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      setLoading(true);

      const response = await axios.post("/api/admin/profiles/new", {
        email: values.email,
      });

      // update the state
      setProfiles((profiles) => [response.data, ...profiles]);

      // empty the form
      form.reset();

      toast.success("User added successfully.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (userInfo.role !== "ADMIN") {
  //     toast.error("You are not authorized to access this page.");
  //     return router.push("/manage");
  //   }
  // }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/admin/profiles"); // Use 'await' to wait for the response

      setProfiles(response.data); // Access 'data' property of the response
    } catch (error) {
      console.error(error); // Use 'console.error' for better visibility of errors
    } finally {
      setLoading(false);
    }
  };

  const acceptProfile = async (id: string, userId: string) => {
    // userId refers to the clerk userId
    // id refers to the database id
    try {
      setLoading(true);

      const response = await axios.put(`/api/admin/profiles/${id}`, {
        role: "MEMBER",
      });

      // update the clerk metadata role by calling auth role
      const auth_role_response = await axios
        .post(`/api/auth/role`, {
          dbId: userId,
          dbRole: "MEMBER",
        })
        .then((res) => {
          console.log(res.data);
        });

      // update state
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) => {
          if (profile.id === id) {
            return { ...profile, role: "MEMBER" };
          }

          return profile;
        }),
      );

      toast.success("Profile accepted.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response);
    } finally {
      setLoading(false);
    }
  };

  const rejectProfile = async (id: string, userId: string) => {
    // userId refers to the clerk userId
    // id refers to the database id
    try {
      const response = await axios.put(`/api/admin/profiles/${id}`, {
        role: "GUEST",
      });

      // update the clerk metadata role by calling auth role
      const auth_role_response = await axios
        .post(`/api/auth/role`, {
          dbId: userId,
          dbRole: "GUEST",
        })
        .then((res) => {
          console.log(res.data);
        });

      console.log(response);

      // update state
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) => {
          if (profile.id === id) {
            return { ...profile, role: "GUEST" };
          }

          return profile;
        }),
      );

      toast.success("Profile rejected.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response);
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

      setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== id));

      toast.success("Profile deleted.");
    } catch (error: any) {
      toast.error(error.response);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  /** Role as a chip — accent for ADMIN, plain glass otherwise. */
  const renderBadge = (profile: UserProfile) => {
    if (profile.userId.includes("login_pending_user")) {
      return (
        <span className="chip">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
          Pending
        </span>
      );
    } else if (profile.role === "MEMBER") {
      return (
        <span className="chip">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
          Member
        </span>
      );
    } else if (profile.role === "ADMIN") {
      return (
        <span className="chip chip-acc">
          <Crown className="h-3.5 w-3.5" strokeWidth={1.75} />
          Admin
        </span>
      );
    } else {
      return (
        <span className="chip">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
          Guest
        </span>
      );
    }
  };

  /** Totals the profile list supports: everyone, then a count per role. */
  const stats = [
    { label: "Total", value: profiles.length, unit: "profiles" },
    { label: "Admin", value: profiles.filter((p) => p.role === "ADMIN").length, unit: "admins" },
    { label: "Member", value: profiles.filter((p) => p.role === "MEMBER").length, unit: "members" },
    { label: "Guest", value: profiles.filter((p) => p.role === "GUEST").length, unit: "guests" },
  ];

  return (
    <div className="grid gap-3.5">
      {/* ══ Section header + add user ═══════════════════════ */}
      <header className="glass pad-lg rise flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="tt-mono">Admin</p>
          <h1 className="tt-h2 mt-1.5 truncate">User management</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="btn btn-acc btn-sm shrink-0">
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add user
            </button>
          </DialogTrigger>

          <DialogContent className="plate pad border-0 shadow-e3 sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle className="tt-h3">Add user</DialogTitle>
              <DialogDescription className="tt-sub">
                Enter the email address of the user you want to add to the system.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <hr className="rule mb-4" />

                <div className="flex flex-col">
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tt-sub">Email</FormLabel>
                          <FormControl>
                            <Input type="email" className="field border-0" {...field} required />
                          </FormControl>

                          <FormMessage className="text-[0.78125rem] text-[color:var(--acc-text)]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <button type="button" className="btn btn-glass btn-sm">
                      Cancel
                    </button>
                  </DialogClose>
                  <button type="submit" className="btn btn-acc btn-sm" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> Adding user
                      </>
                    ) : (
                      "Add user"
                    )}
                  </button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      {/* ══ Totals ══════════════════════════════════════════ */}
      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {stats.map(({ label, value, unit }, i) => (
          <div key={label} className="glass pad-sm rise" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="tt-mono">{label}</p>
            <p className="tt-num mt-3 text-[1.75rem]">{loading ? "—" : String(value).padStart(2, "0")}</p>
            <p className="tt-unit mt-0.5">{unit}</p>
          </div>
        ))}
      </section>

      {/* ══ Profiles — genuinely tabular, so the table stays ═ */}
      <section className="glass pad rise" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between gap-3">
          <p className="tt-mono">Profiles</p>
          <span className="tt-sub">{loading ? "Loading" : `${profiles.length} total`}</span>
        </div>

        <hr className="rule my-3" />

        {loading ? (
          <div className="grid gap-2" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-lite shimmer h-[52px] rounded-tile" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="glass-well pad-lg grid place-items-center rounded-tile text-center">
            <span className="glass-bright grid h-11 w-11 place-items-center rounded-tile">
              <Users className="h-5 w-5 text-ink" strokeWidth={1.75} />
            </span>
            <p className="tt-h3 mt-3">No profiles yet</p>
            <p className="tt-sub mt-1">Invite someone by email to get them into the system.</p>
          </div>
        ) : (
          /* The TABLE scrolls sideways here — never the page. */
          <div className="scrollbar-slim overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="[&_tr]:border-0">
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="tt-mono h-auto px-3 pb-2 pt-0 text-muted-ink">Email</TableHead>
                  <TableHead className="tt-mono h-auto px-3 pb-2 pt-0 text-muted-ink">Role</TableHead>
                  <TableHead className="tt-mono h-auto px-3 pb-2 pt-0 text-right text-muted-ink">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {profiles?.map((profile) => (
                  <TableRow key={profile.id} className="border-0 hover:bg-glass-lite">
                    <TableCell className="tt-body max-w-[280px] truncate rounded-l-tile px-3 py-2.5 text-ink">
                      {profile.email}
                    </TableCell>

                    <TableCell className="px-3 py-2.5">{renderBadge(profile)}</TableCell>

                    <TableCell className="rounded-r-tile px-3 py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        {profile.role !== "ADMIN" && ( // Check if profile role is not ADMIN
                          <>
                            {profile.role === "GUEST" ? (
                              <button
                                type="button"
                                aria-label="Accept profile"
                                title="Accept"
                                className="iconbtn iconbtn-sm"
                                onClick={() => acceptProfile(profile.id, profile.userId)}
                              >
                                <Check className="h-4 w-4" strokeWidth={1.75} />
                              </button>
                            ) : (
                              <span
                                aria-label="Already a member"
                                title="Already a member"
                                className="iconbtn iconbtn-sm iconbtn-on cursor-default"
                              >
                                <Check className="h-4 w-4" strokeWidth={2} />
                              </span>
                            )}

                            <button
                              type="button"
                              aria-label="Reject profile"
                              title="Reject"
                              className={`iconbtn iconbtn-sm ${profile.role === "GUEST" ? "iconbtn-on" : ""}`}
                              onClick={() => rejectProfile(profile.id, profile.userId)}
                            >
                              <Ban className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </>
                        )}

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span aria-label="Show reference" className="iconbtn iconbtn-sm cursor-default">
                                <Eye className="h-4 w-4" strokeWidth={1.75} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="plate border-0 shadow-e2">
                              <p className="tt-mono">{profile.id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {profile.role !== "ADMIN" && ( // Check if profile role is not ADMIN
                          <button
                            type="button"
                            aria-label="Delete profile"
                            title="Delete"
                            className="iconbtn iconbtn-sm"
                            onClick={() => deleteProfile(profile.id)}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
