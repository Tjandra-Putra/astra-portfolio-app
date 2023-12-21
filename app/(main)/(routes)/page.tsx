import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { TextEditor } from "@/components/text-editor";
import { Badge } from "@/components/ui/badge";

// default route for the app "https://localhost:3000/"
export default function Home() {
  return (
    <div className="min-h-screen h-full shadow-paper bg-white rounded-lg mt-4 p-6">
      <div className="flex justify-between">
        <div className="job-title font-normal">Software Engineer</div>
        <div className="status uppercase">
          <Badge variant={"success"}>Available for work</Badge>
        </div>
      </div>
    </div>
  );
}
