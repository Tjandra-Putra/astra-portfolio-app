import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faFaceSmile, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { faFile, faCopy } from "@fortawesome/free-regular-svg-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Projects from "@/components/projects";
import Experiences from "@/components/experiences";
import { currentProfile } from "@/lib/current-profile";

// default route for the app "https://localhost:3000/"
export default async function Home() {
  const profile = await currentProfile();

  return (
    <div className="">
      <section className="introduction pb-5">
        <div className="flex justify-between mb-5">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">
              {profile?.jobTitle ? profile.jobTitle : "[Job Title]"}
            </div>
          </div>
          <Link href="/contact" className="status uppercase tracking-wider text-end">
            <Badge variant={"diamond"} className="font-semibold">
              <FontAwesomeIcon icon={faSeedling} className="me-2" color="#183153" />
              Available for Hire
            </Badge>
          </Link>
        </div>

        <div className="grid md:grid-cols-12 gap-6 mb-5 text-center sm:text-left">
          <div className="md:col-span-8">
            <div className="w-full">
              <div className="name text-4xl font-medium">
                Hi, I'm{" "}
                <span className="text-primary">{profile?.name ? profile.name.split(" ")[0] : "[First Name]"}</span>
              </div>
              <div className="description mt-3 text-gray-900 font-normal">{profile?.bio ? profile.bio : "[Bio]"}</div>
              <div className="buttons mt-5 space-x-3">
                <Button variant={"navy"}>
                  <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
                  Resume
                </Button>
                <Button variant="ocean">
                  <FontAwesomeIcon icon={faCopy} className="me-2" color="#183153" />
                  Copy Email
                </Button>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex items-center">
            <div className="w-full">
              <div className="avatar-border border-4 border-[#000000] p-2 rounded-full">
                <Avatar>
                  {profile?.imageUrl ? (
                    <AvatarImage src={profile.imageUrl} />
                  ) : (
                    <AvatarImage src="https://github.com/shadcn.png" />
                  )}
                  <AvatarFallback>{profile?.name}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Projects showAll={false} />

      <Experiences />
    </div>
  );
}
