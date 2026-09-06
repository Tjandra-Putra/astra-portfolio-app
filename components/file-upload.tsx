"use client";

import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UploadDropzone } from "@/lib/uploadthing";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  const isImage = fileType && fileType !== "pdf";

  if (isImage) {
    return (
      <div className="relative">
        <div className="avatar-border border-4 border-[#000000] p-2 rounded-lg">
          <Avatar className="rounded-lg">
            <AvatarImage src={value} className="object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-2 right-2 shadow-sm" type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // if pdf, preview pdf
  if (value && fileType === "pdf") {
    return (
      <div className="relative">
        <div className="avatar-border rounded-sm">
          <Link href={value} target="_blank">
            <div className="btn btn-glass w-full">View PDF</div>
          </Link>
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-[-10px] right-[-10px] shadow-sm"
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
        toast.error(`Upload failed: ${error.message}`);
      }}
      className="glass-well rounded-tile p-5 text-ink"
      appearance={{
        button: "btn btn-acc", // matches the design system's primary action
      }}
      content={{
        button({ isUploading }) {
          return isUploading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            "Upload File"
          );
        },
      }}
    />
  );
};
