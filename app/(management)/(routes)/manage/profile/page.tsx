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

const EditProfilePage = () => {
  return (
    <React.Fragment>
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
          <div className="grid grid-cols-12 items-center justify-center">
            <div className="col-span-6 col-start-1">
              <div className="leading-7">
                <Label htmlFor="picture">Profile Photo</Label>
                <div className="font-light text-sm">Recommended size: 300x300px</div>
                <Input id="picture" type="file" className="mt-3" />
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
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" type="text" />
            </div>

            <div className="col-span-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" type="text" />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" />
              <p className="text-sm text-muted-foreground">This is not your login email.</p>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="bio">Introduction</Label>
              <Textarea placeholder="Introduce yourself in a few words." />
              <p className="text-sm text-muted-foreground">Introduce yourself in a few words for the main page.</p>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="bio">About</Label>
              <Textarea placeholder="Introduce yourself in detail." />
              <p className="text-sm text-muted-foreground">Introduce yourself in details for the about page.</p>
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
          <div className="grid gap-4">
            <div className="col-span-1">
              <Label htmlFor="firstName">
                Current Resume: <Badge variant={"secondary"}> Tjandra_Putra_Resume.pdf</Badge>
              </Label>
              <Input id="picture" type="file" className="mt-3" />
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
        <section className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="lastName">Social Media (1)</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="GitHub">GitHub</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Label htmlFor="firstName">Link</Label>
              <Input id="firstName" type="text" placeholder="https://www.example.com" />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="lastName">Social Media (2)</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="GitHub">GitHub</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Label htmlFor="firstName">Link</Label>
              <Input id="firstName" type="text" placeholder="https://www.example.com" />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="lastName">Social Media (3)</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="GitHub">GitHub</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Label htmlFor="firstName">Link</Label>
              <Input id="firstName" type="text" placeholder="https://www.example.com" />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="lastName">Social Media (4)</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="GitHub">GitHub</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Label htmlFor="firstName">Link</Label>
              <Input id="firstName" type="text" placeholder="https://www.example.com" />
            </div>
          </div>
        </section>
      </div>

      <Button variant={"diamond"} className="w-full font-semibold mt-5">
        Save Changes
      </Button>
    </React.Fragment>
  );
};

export default EditProfilePage;
