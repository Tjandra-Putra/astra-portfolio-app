"use client";

import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import "../app/globals.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative">
        <div className="avatar-border border-4 border-[#000000] p-2 rounded-lg">
          <Avatar className="rounded-lg">
            <AvatarImage src={value} className="object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-2 right-2 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
      className="bg-white"
      // className=" bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg p-2 text-[#1c3454]"
    />
  );
};
