"use client";

import React from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import Tiptap from "@/components/text-editors/tiptap-editor";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";
import QuillTextEditor from "@/components/text-editors/quill-editor";

const formSchema = z.object({
  thumbnailUrl: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  category: z
    .string()
    .min(1, {
      message: "Category is required",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(1000, {
      message: "Description must be at most 1000 characters long",
    }),
  company: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  visible: z.boolean().optional(),
  isWorkExperience: z.boolean().optional(),
  workExperienceTitle: z.string().optional(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  tags: z.string().optional(),
  content: z.string().optional(),
});

const AddProjectPage = () => {
  const router = useRouter();

  const [markDownContent, setMarkdownContent] = React.useState<string | undefined>("");
  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailUrl: "",
      projectUrl: "",
      githubUrl: "",
      company: "",
      workExperienceTitle: "",
      category: "",
      content: "",
      startDate: undefined,
      endDate: undefined,
      isWorkExperience: false,
      visible: true,
      tags: "",
    },
  });

  // get values from text editor child component
  const handleMarkdownChange = (markdown: string) => {
    setMarkdownContent(markdown);

    console.log(markdown);
  };

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAdding(true);

    values.content = markDownContent;

    try {
      await axios.post("/api/manage/projects", values);

      toast.success("Project added successfully!");

      // redirect to other page
      router.push("/manage/projects");

      // form.reset();
      // router.refresh();
      // window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">Add Project </div>
          </div>

          <div className="text-gray-800 font-normal">
            Add a project to your portfolio. This will be displayed on your profile page.
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Introduction
          </Badge>

          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <div className="grid grid-cols-12 items-center justify-center">
                <div className="col-span-6 col-start-1">
                  <div className="leading-7">
                    <Label htmlFor="picture">Project Thumbnail</Label>
                    <div className="font-light text-sm">Recommended size: any</div>
                  </div>
                </div>

                <div className="col-span-6 text-center">
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
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
                          <Input placeholder="E.g Enterprise Development" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Web Development" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g This project aims to ..."
                        className="resize-none whitespace-pre-line"
                        rows={10}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is a summary of what your project is about.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Project Details
          </Badge>

          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <div className="grid gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company <span className="text-sm text-gray-600 font-light">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Google" {...field} />
                        </FormControl>
                        <FormMessage />
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
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label htmlFor="is-work-experience">
                    Your project is visible to everyone{" "}
                    <span className="text-sm text-gray-600 font-light">(Optional)</span>
                  </Label>
                  <div className="text-sm text-gray-600 font-light">
                    Turning on this option will hide this project from your profile.
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label htmlFor="is-work-experience">Is this a work experience?</Label>
                  <div className="text-sm text-gray-600 font-light">
                    Turning on this option will consider this project as a work experience.
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="isWorkExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
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
                    name="workExperienceTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Title <span className="text-sm text-gray-600 font-light">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Software Developer" {...field} />
                        </FormControl>
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
            Project Links
          </Badge>

          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <div className="grid gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="projectUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Project Url <span className="text-sm text-gray-600 font-light">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
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
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Github Url <span className="text-sm text-gray-600 font-light">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.github.com/my-project" {...field} />
                        </FormControl>
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
            Project Tags
          </Badge>
          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tags <span className="text-sm text-gray-600 font-light">(Optional, Comma Separated)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="E.g This project aims to ..." className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>This is a summary of what your project is about.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Main Content
          </Badge>

          <div className="border bg-white p-0 rounded-lg">
            <section className="bg-white">
              {/* <Tiptap onMarkdownChange={handleMarkdownChange} /> */}
              <QuillTextEditor onMarkdownChange={handleMarkdownChange} />
            </section>
          </div>

          <Button variant={"diamond"} className="w-full font-semibold mt-5" type="submit" disabled={isAdding}>
            {isAdding ? "Adding Project..." : "Add Project"}
          </Button>
        </form>
      </Form>
    </React.Fragment>
  );
};

export default AddProjectPage;
