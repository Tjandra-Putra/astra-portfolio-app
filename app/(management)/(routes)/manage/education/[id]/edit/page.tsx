"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";

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

import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Loader from "@/components/layout/loader";

const formSchema = z.object({
  schoolName: z.string().min(1, {
    message: "Institution is required",
  }),
  degree: z.string().min(1, {
    message: "Degree is required",
  }),
  fieldOfStudy: z.string().min(1, {
    message: "Field of Study is required",
  }), // Bachelor of Science
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  visible: z.boolean().optional(),
  skills: z.string().optional(),
});

const EditEducationPage = () => {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [education, setEducation] = React.useState<any>(null);

  // get id from url
  const params = useParams();
  const id = params.id;

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: undefined,
      endDate: undefined,
      grade: "",
      description: "",
      visible: true,
      skills: "",
    },
  });

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/manage/education/${id}`);
      setEducation(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  useEffect(() => {
    if (education) {
      form.reset({
        schoolName: education.schoolName,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: new Date(education.startDate),
        endDate: new Date(education.endDate),
        grade: education.grade,
        description: education.description,
        visible: education.visible,
        skills: education.skills,
      });
    }
  }, [education, form]);

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Convert date strings to Date objects
    values.startDate = values.startDate ? new Date(values.startDate) : new Date();
    values.endDate = values.endDate ? new Date(values.endDate) : new Date();

    try {
      await axios.put(`/api/manage/education/${id}`, values);

      toast.success("Education updated successfully");

      setEducation(values);

      // reset form
      form.reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">Edit Education</div>
          </div>

          <div className="text-gray-800 font-normal">
            Edit your education to showcase your academic achievements. You can add multiple education entries.
          </div>

          <Badge variant="navy" className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none">
            Basic Information
          </Badge>

          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Institution<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Singapore Management University" {...field} />
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
                    name="fieldOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Field of Study<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Bachelor of Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Degree<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Singapore Management University" {...field} />
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
                      <FormItem className="flex flex-col gap-1 mt-[6px]">
                        <FormLabel>
                          Start Date<span className="text-red-600">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("text-left font-normal", !field.value && "text-muted-foreground")}>
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
                      <FormItem className="flex flex-col gap-1 mt-[6px]">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("text-left font-normal", !field.value && "text-muted-foreground")}>
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
                  <Label htmlFor="is-work-experience">Your education is visible to everyone</Label>
                  <div className="text-sm text-gray-600 font-light">Turning on this option will hide this education from your profile.</div>
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
          </div>

          <Badge variant="navy" className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none">
            Additional Information
          </Badge>

          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description
                          <span className="text-sm text-gray-600 font-light">(Comma Separated)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} rows={12} />
                        </FormControl>
                        <FormDescription>This is a summary of what you achieved during your education such as CCA and competition.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Skills <span className="text-sm text-gray-600 font-light">(Optional, Comma Separated)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>State what you have learned during your education.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g 3.74/4.00, A+, First Class" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>
          </div>

          <Button variant={"diamond"} className="w-full font-semibold sm:mt-6 mt-3" type="submit" disabled={isAdding}>
            {isAdding ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </React.Fragment>
  );
};

export default EditEducationPage;
