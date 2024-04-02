"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faAt, faC } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub, faDribbble } from "@fortawesome/free-brands-svg-icons";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileUpload } from "@/components/file-upload";
import { useSelector } from "react-redux";
import axios from "axios";

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
    })
  ),
});

const EditProfilePage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>({});
  const userInfo = useSelector((state: any) => state.userReducer);

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

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/manage/profile/${userInfo?.id}`);
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userInfo?.id]);

  // ensures the form is only populated when the project is fetched
  useEffect(() => {
    if (profile) {
      // need to do this to match the format of the social media array
      let formattedSocialLinks: any = [];

      profile.socialLinks?.forEach((link: any) => {
        const platform = `${link.iconName}, ${link.iconType}`;
        const url = link.url;
        const id = link.id;

        formattedSocialLinks.push({ id, platform, url });
      });

      form.reset({
        name: profile?.name ? profile.name : "",
        workEmail: profile?.workEmail ? profile.workEmail : profile.email,
        bio: profile?.bio ? profile.bio : "",
        about: profile?.about ? profile.about : "",
        imageUrl: profile?.imageUrl ? profile.imageUrl : "",
        resumeUrl: profile?.resumeUrl ? profile.resumeUrl : "",
        jobTitle: profile?.jobTitle ? profile.jobTitle : "",
        socialMedia: profile?.socialLinks ? formattedSocialLinks : [],
      });
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

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">Manage Profile</div>
          </div>

          <div className="text-gray-800 font-normal">
            Leave the field blank if you do not want to update the information. If you want to update the information,
            please fill in the field.
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Basic Information
          </Badge>

          <div className="bg-zinc-50 p-5 rounded-lg">
            <section className="mb-5">
              <div className="grid grid-cols-12 items-center justify-center gap-4">
                <div className="col-span-6 col-start-1">
                  <div className="leading-7">
                    <Label htmlFor="picture">Profile Photo</Label>
                    <div className="font-light text-sm">Recommended size: 300x300px</div>
                  </div>
                </div>

                <div className="col-span-6 text-center">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="workEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contact Email <span className="text-sm text-gray-600 font-light">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="E.g tjandrap.work@gmail.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          If no email is provided, the email used to sign up will be used.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Introduce yourself in a few words."
                            className="resize-none whitespace-pre-line"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Introduce yourself in a few words for the main page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Introduce yourself in detail."
                            className="resize-none whitespace-pre-line"
                            rows={12}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Introduce yourself in details for the about page.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Files
          </Badge>

          <div className="bg-zinc-50 p-5 rounded-lg">
            <section className="mb-5">
              <div className="grid grid-cols-12 items-center justify-center gap-4">
                <div className="col-span-6 col-start-1">
                  <div className="leading-7">
                    <Label htmlFor="picture">
                      <p>Current Resume:</p>
                      {profile?.resumeUrl ? (
                        <Badge variant={"diamond"} className="text-xs mt-2">
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge variant={"ocean"} className="text-xs mt-2">
                          Not Uploaded
                        </Badge>
                      )}
                    </Label>
                    <div className="font-light text-sm mt-1">The file must be in PDF format and less than 5MB.</div>
                  </div>
                </div>

                <div className="col-span-6 text-center">
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
            </section>
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Social Media
          </Badge>

          <div className="bg-zinc-50 p-5 rounded-lg">
            {[0, 1, 2, 3].map((index) => (
              <section key={index} className="mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`socialMedia.${index}.platform`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{`Social Media (${index})`}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`socialMedia.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="E.g https://www.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>

          <Button variant={"diamond"} className="w-full font-semibold mt-5" type="submit" disabled={isEditing}>
            {isEditing ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </React.Fragment>
  );
};

export default EditProfilePage;
