"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/file-upload";
import { useSelector } from "react-redux";
import axios from "axios";
import { Camera, Check, FileText, Link2, Loader2, Mail, Plus, Trash2, User } from "lucide-react";

/* Shared field styling. The shadcn primitives ship their own bridge utilities
   (bg-background, border-input, h-10, focus rings) which sit in Tailwind's
   utilities layer and would otherwise win over `.field` — these neutralise them
   with tokens so the glass treatment shows through in both themes. */
const FIELD =
  "field h-[42px] rounded-md border-0 bg-glass-deep px-3.5 text-[0.9375rem] focus-visible:ring-0 focus-visible:ring-offset-0";
const FIELD_AREA =
  "field h-auto min-h-0 rounded-md border-0 bg-glass-deep px-3.5 py-3 text-[0.9375rem] focus-visible:ring-0 focus-visible:ring-offset-0 resize-none whitespace-pre-line";
const LABEL = "tt-sub text-[0.78125rem]";
const ERROR = "text-[0.78125rem] text-[color:var(--acc-text)]";

const socialMediaPlatforms = [
  { value: "fa-linkedin, fa-brands", label: "LinkedIn" },
  { value: "fa-github, fa-brands", label: "GitHub" },
  { value: "fa-c, fa-solid", label: "Credly" },
  { value: "fa-at, fa-solid", label: "Email" },
  { value: "fa-dribbble, fa-brands", label: "Dribbble" },
  { value: "fa-twitter, fa-brands", label: "Twitter" },
  { value: "fa-facebook, fa-brands", label: "Facebook" },
  { value: "fa-instagram, fa-brands", label: "Instagram" },
  { value: "fa-youtube, fa-brands", label: "YouTube" },
  { value: "fa-twitch, fa-brands", label: "Twitch" },
  { value: "fa-tiktok, fa-brands", label: "TikTok" },
  { value: "fa-snapchat-ghost, fa-brands", label: "Snapchat" },
  { value: "fa-reddit, fa-brands", label: "Reddit" },
  { value: "fa-pinterest, fa-brands", label: "Pinterest" },
  { value: "fa-medium-m, fa-brands", label: "Medium" },
  { value: "fa-link, fa-solid", label: "Website" },
  { value: "fa-behance, fa-brands", label: "Behance" },
  { value: "fa-bitbucket, fa-brands", label: "Bitbucket" },
  { value: "fa-codepen, fa-brands", label: "CodePen" },
  { value: "fa-dev, fa-brands", label: "Dev.to" },
];

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  workEmail: z
    .string()
    .max(50, {
      message: "Name must be at most 50 characters long",
    })
    .optional(),
  bio: z
    .string()
    .max(5000, {
      message: "Bio must be at most 5000 characters long",
    })
    .optional(),
  about: z
    .string()
    .max(5000, {
      message: "About must be at most 5000 characters long",
    })
    .optional(),
  imageUrl: z.string(),
  resumeUrl: z.string().optional(),
  jobTitle: z.string().optional(), // profession
  socialMedia: z.array(
    z.object({
      id: z.string(),
      platform: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
});

const EditProfilePage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>({});
  const userInfo = useSelector((state: any) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      workEmail: "",
      bio: "",
      about: "",
      imageUrl: "",
      resumeUrl: "",
      jobTitle: "",
      socialMedia: [
        { id: "", platform: "", url: "" },
        { id: "", platform: "", url: "" },
        { id: "", platform: "", url: "" },
        { id: "", platform: "", url: "" },
      ],
    },
  });

  /* Renders the same `socialMedia.${index}` paths the payload already used —
     `keyName` is moved off "id" so the row's real database id survives. */
  const { fields: socialFields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMedia",
    keyName: "_key",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/manage/profile/${userInfo?.id}`);
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userInfo?.id]);

  // ensures the form is only populated when the project is fetched
  useEffect(() => {
    if (profile?.name !== undefined) {
      const formattedSocialLinks = profile.socialLinks?.map((link: any) => {
        const combined = `${link.iconName}, ${link.iconType}`;
        const matchedPlatform = socialMediaPlatforms.find((p) => p.value === combined)?.value || "";
        return {
          id: link.id,
          platform: matchedPlatform,
          url: link.url,
        };
      }) || [
        { id: "", platform: "", url: "" },
        { id: "", platform: "", url: "" },
        { id: "", platform: "", url: "" },
        { id: "", platform: "", url: "" },
      ];

      form.reset({
        name: profile.name || "",
        workEmail: profile.workEmail || profile.email || "",
        bio: profile.bio || "",
        about: profile.about || "",
        imageUrl: profile.imageUrl || "",
        resumeUrl: profile.resumeUrl || "",
        jobTitle: profile.jobTitle || "",
        socialMedia: formattedSocialLinks,
      });

      setIsProfileLoaded(true);
    }
  }, [profile]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      setIsEditing(true);
      await axios.put(`/api/manage/profile/${userInfo?.id}`, {
        ...values,
        about: values.about,
        bio: values.bio,
      });

      fetchProfile();

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.log(error);
      toast.error("Profile update failed!");
    } finally {
      setIsEditing(false);
    }
  };

  if (loading || !isProfileLoaded) {
    return (
      <div className="grid gap-3">
        <div className="glass pad rise">
          <div className="glass-lite shimmer h-3 w-24 rounded-xs" />
          <div className="glass-lite shimmer mt-3 h-6 w-52 rounded-xs" />
        </div>
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="grid gap-3 lg:col-span-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass pad rise" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="glass-lite shimmer h-3 w-20 rounded-xs" />
                <hr className="rule my-3" />
                <div className="grid gap-3">
                  <div className="glass-lite shimmer h-[42px] rounded-md" />
                  <div className="glass-lite shimmer h-[42px] rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 lg:col-span-4">
            <div className="glass pad rise">
              <div className="glass-lite shimmer h-3 w-20 rounded-xs" />
              <hr className="rule my-3" />
              <div className="glass-lite shimmer h-28 rounded-tile" />
            </div>
            <div className="glass pad rise">
              <div className="glass-lite shimmer h-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        {/* ══ Section header ═══════════════════════════════════ */}
        <header className="glass pad rise flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="tt-mono">Account</p>
            <h1 className="tt-h2 mt-1.5 truncate">Profile</h1>
          </div>
          <p className="tt-sub max-w-sm shrink-0">
            Blank fields are left untouched. Fill in only what you want to change.
          </p>
        </header>

        <div className="grid gap-3 lg:grid-cols-12">
          {/* ══ Main column ════════════════════════════════════ */}
          <div className="grid gap-3 lg:col-span-8">
            {/* ── Identity ── */}
            <section className="glass pad rise">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-ink" strokeWidth={1.75} />
                <p className="tt-mono">Identity</p>
              </div>
              <hr className="rule my-3" />

              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" className={FIELD} {...field} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Profession</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g Software Engineer" className={FIELD} {...field} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-3">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Introduce yourself in a few words." rows={3} className={FIELD_AREA} {...field} />
                      </FormControl>
                      <FormDescription className="tt-sub text-[0.78125rem]">
                        Introduce yourself in a few words for the main page
                      </FormDescription>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* ── About ── */}
            <section className="glass pad rise" style={{ animationDelay: "50ms" }}>
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-ink" strokeWidth={1.75} />
                <p className="tt-mono">About</p>
              </div>
              <hr className="rule my-3" />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Long form</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Introduce yourself in detail." rows={12} className={FIELD_AREA} {...field} />
                    </FormControl>
                    <FormDescription className="tt-sub text-[0.78125rem]">
                      Introduce yourself in details for the about page.
                    </FormDescription>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </section>

            {/* ── Contact ── */}
            <section className="glass pad rise" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-ink" strokeWidth={1.75} />
                <p className="tt-mono">Contact</p>
              </div>
              <hr className="rule my-3" />

              <div className="grid gap-3">
                <div className="glass-lite pad-sm rounded-tile">
                  <p className="tt-mono">Account email</p>
                  <p className="mt-1 truncate text-[0.8125rem] font-medium text-ink">{profile?.email || "—"}</p>
                  <p className="tt-sub mt-1">The address you signed up with. It is not editable here.</p>
                </div>

                <FormField
                  control={form.control}
                  name="workEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Contact email (optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="E.g tjandrap.work@gmail.com" className={FIELD} {...field} />
                      </FormControl>
                      <FormDescription className="tt-sub text-[0.78125rem]">
                        If no email is provided, the email used to sign up will be used.
                      </FormDescription>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />

                <hr className="rule" />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={LABEL}>Résumé</p>
                    <span className={`chip ${profile?.resumeUrl ? "chip-acc" : ""}`}>
                      {profile?.resumeUrl ? (
                        <>
                          <Check className="h-3 w-3" strokeWidth={2.5} /> Uploaded
                        </>
                      ) : (
                        "Not uploaded"
                      )}
                    </span>
                  </div>
                  <p className="tt-sub mt-1">PDF only, under 5MB.</p>

                  <div className="glass-well pad-sm mt-2 grid place-items-center rounded-tile">
                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload endpoint="messageFile" value={field.value || ""} onChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Social links ── */}
            <section className="glass pad rise" style={{ animationDelay: "150ms" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-muted-ink" strokeWidth={1.75} />
                  <p className="tt-mono">Social links</p>
                </div>
                <span className="tt-sub">{socialFields.length} row{socialFields.length === 1 ? "" : "s"}</span>
              </div>
              <hr className="rule my-3" />

              <div className="grid gap-2">
                {socialFields.map((row, index) => (
                  <div key={row._key} className="glass-lite pad-sm rounded-tile">
                    <div className="flex items-start gap-2">
                      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`socialMedia.${index}.platform`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LABEL}>Platform</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger
                                    className={`${FIELD} justify-between focus:ring-0 focus:ring-offset-0`}
                                  >
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {socialMediaPlatforms.map((platform) => (
                                    <SelectItem key={platform.value} value={platform.value}>
                                      {platform.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className={ERROR} />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`socialMedia.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LABEL}>Link</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="E.g https://www.example.com"
                                  className={`${FIELD} text-[color:var(--acc-text)]`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className={ERROR} />
                            </FormItem>
                          )}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label={`Remove social link ${index + 1}`}
                        className="iconbtn iconbtn-sm mt-[1.375rem] shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => append({ id: "", platform: "", url: "" })}
                className="btn btn-glass btn-sm mt-3"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add link
              </button>
            </section>
          </div>

          {/* ══ Sidebar ════════════════════════════════════════ */}
          <aside className="grid gap-3 self-start lg:col-span-4 lg:sticky lg:top-0">
            {/* ── Photo / media ── */}
            <section className="glass pad rise" style={{ animationDelay: "50ms" }}>
              <div className="flex items-center gap-2">
                <Camera className="h-3.5 w-3.5 text-muted-ink" strokeWidth={1.75} />
                <p className="tt-mono">Photo</p>
              </div>
              <hr className="rule my-3" />

              <div className="glass-well pad-sm grid place-items-center rounded-tile">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />
              </div>

              <p className="tt-sub mt-3">Recommended size: 300×300px.</p>
            </section>

            {/* ── Actions ── */}
            <section className="glass pad rise" style={{ animationDelay: "100ms" }}>
              <p className="tt-mono">Actions</p>
              <hr className="rule my-3" />

              <div className="grid gap-2">
                <button type="submit" className="btn btn-acc w-full" disabled={isEditing}>
                  {isEditing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>

                <Link href="/manage" className="btn btn-glass w-full">
                  Cancel
                </Link>
              </div>

              <p className="tt-sub mt-3">Changes go live on your public page as soon as they save.</p>
            </section>
          </aside>
        </div>
      </form>
    </Form>
  );
};

export default EditProfilePage;
