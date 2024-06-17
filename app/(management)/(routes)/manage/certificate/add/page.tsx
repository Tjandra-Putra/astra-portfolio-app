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

import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  certificateId: z.string().optional(),
  certificateImageUrl: z.string().optional(),
  certificateUrl: z.string().optional(),
  issueingOrganisation: z.string().min(1, {
    message: "Issueing Organisation is required",
  }),
  issuedDate: z.date(),
  visible: z.boolean().optional(),
});

const AddCertificatePage = () => {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      certificateId: "",
      certificateImageUrl: "",
      certificateUrl: "",
      issueingOrganisation: "",
      issuedDate: new Date(),
      visible: true,
    },
  });

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/manage/certificate", values);

      toast.success("Certificate added successfully");

      // redirect to other page
      router.push("/manage/certificate");

      // reset form
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdding(false);
    }
    console.log("Form is invalid");
    console.log(values);
    console.log(form.formState.errors);
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">Add Certificate </div>
          </div>

          <div className="text-gray-800 font-normal">
            Fill in the details of the certificate you have achieved. This will be displayed on your profile.
          </div>

          <Badge
            variant="navy"
            className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
          >
            Details
          </Badge>

          <div className="border bg-zinc-50 p-5 rounded-bl-lg rounded-br-lg">
            <section className="mb-5">
              <div className="grid grid-cols-12 items-center justify-center">
                {/* For mobile view, set the column spans to occupy the full width */}
                <div className="col-span-12 sm:col-span-6">
                  <div className="leading-7 sm:text-start text-center mb-5">
                    <Label htmlFor="picture">Certificate File (.pdf)</Label>
                    <div className="font-light text-sm">Recommended size: any</div>
                  </div>
                </div>

                {/* For mobile view, set the column spans to occupy the full width */}
                <div className="col-span-12 sm:col-span-6 text-center">
                  <FormField
                    control={form.control}
                    name="certificateImageUrl"
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

            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Oracle Foundation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="issueingOrganisation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issueing Organisation</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g Microsoft" {...field} />
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
                    name="issuedDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1 mt-[6px]">
                        <FormLabel>Issued Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("text-left font-normal", !field.value && "text-muted-foreground")}
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
                    name="certificateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Certificate Code <span className="text-sm text-gray-600 font-light">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="E.g AZ-900" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="certificateUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Certificate URL <span className="text-sm text-gray-600 font-light">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="E.g microsoft.com" {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </div>

          <Button variant={"diamond"} className="w-full font-semibold sm:mt-6 mt-3" type="submit" disabled={isAdding}>
            {isAdding ? "Adding Certificate..." : "Add Certificate"}
          </Button>
        </form>
      </Form>
    </React.Fragment>
  );
};

export default AddCertificatePage;
