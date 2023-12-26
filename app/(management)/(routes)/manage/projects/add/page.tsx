"use client";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { TextEditor } from "@/components/text-editor";

const AddProjectPage = () => {
  return (
    <React.Fragment>
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

      <div className="bg-zinc-50 p-5 rounded-lg">
        <section className="mb-5">
          <div className="grid grid-cols-12 items-center justify-center">
            <div className="col-span-6 col-start-1">
              <div className="leading-7">
                <Label htmlFor="picture">Project Thumbnail</Label>
                <div className="font-light text-sm">Recommended size: any</div>
                <Input id="project-thumbnail" type="file" className="mt-3" />
              </div>
            </div>

            <div className="col-span-6 px-12">
              <div className="avatar-border border-4 border-[#000000] p-2 rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="E.g Enterprise Development" />
            </div>

            <div className="col-span-1">
              <Label htmlFor="category">Category</Label>
              <Input id="category" type="text" placeholder="E.g Web Application" />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="E.g This project aims to ..." />
        </section>
      </div>

      <Badge
        variant="navy"
        className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
      >
        Project Details
      </Badge>

      <div className="bg-zinc-50 p-5 rounded-lg">
        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="name">Company</Label>
              <Input id="name" type="text" placeholder="E.g Enterprise Development" />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker />
            </div>

            <div className="col-span-1">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <Label htmlFor="is-work-experience">
                Hide this project from your profile?{" "}
                <span className="text-sm text-gray-600 font-light">(Optional)</span>
              </Label>
              <div className="text-sm text-gray-600 font-light">
                Turning on this option will hide this project from your profile.
              </div>
            </div>
            <div>
              <Switch />
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
              <Switch />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              {/* This component is rendered base on work experience toggle */}
              <Label htmlFor="work-experience-title">Job Title</Label>
              <Input id="work-experience-title" type="text" placeholder="E.g Software Developer" />
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

      <div className="bg-zinc-50 p-5 rounded-lg">
        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="name">
                Project URL <span className="text-sm text-gray-600 font-light">(Optional)</span>
              </Label>
              <Input
                id="project-url"
                type="text"
                placeholder="
                https://www.example.com"
              />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="name">
                Github URL <span className="text-sm text-gray-600 font-light">(Optional)</span>
              </Label>
              <Input
                id="project-url"
                type="text"
                placeholder="
                https://www.example.com"
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
      <div className="border bg-zinc-50 p-5 rounded-lg">
        <section className="mb-5">
          <Label htmlFor="description">Tags (Comma Separated)</Label>
          <Textarea id="description" placeholder="ReactJs, NextJs, MySQL" />
        </section>
      </div>

      <Badge
        variant="navy"
        className="text-lg font-semibold w-full justify-start mt-7 rounded-lg rounded-bl-none rounded-br-none"
      >
        Main Content
      </Badge>

      <div className="border bg-white p-0 rounded-lg">
        <section className="mb-5 bg-white">
          <TextEditor />
        </section>
      </div>

      <Button variant={"diamond"} className="w-full font-semibold mt-5">
        Save
      </Button>
    </React.Fragment>
  );
};

export default AddProjectPage;
