import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFile, faCopy } from "@fortawesome/free-regular-svg-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectCard from "@/components/project-card";
import ExperienceCard from "@/components/experience-card";

// default route for the app "https://localhost:3000/"
export default function Home() {
  return (
    <div className="min-h-screen h-full shadow-paper bg-white rounded-lg mt-4">
      <section className="introduction p-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">Software Engineer</div>
          </div>
          <Link href="/contact" className="status uppercase tracking-wider">
            <Badge variant={"ocean"} className="font-semibold">
              Portfolio
            </Badge>
          </Link>
        </div>

        <div className="flex my-10 justify-between items-center">
          <div className="w-full md:w-7/12">
            <div className="name text-4xl font-medium">I'm Tjandra</div>

            <div className="description mt-3 text-gray-900 font-normal">
              I'm passionate about building products that make a positive impact on people's lives.
            </div>

            <div className="buttons mt-5">
              <Button className="me-3">
                <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
                Resume
              </Button>
              <Button variant="secondary" className="">
                <FontAwesomeIcon icon={faCopy} className="me-2" color="#000000" />
                Copy Email
              </Button>
            </div>
          </div>
          <div className="w-full md:w-4/12">
            <div className="avatar-border border-4 border-[#000000] p-2 rounded-full">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </section>

      <section className="projects bg-ash mx-3 p-6 rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 text-lg">Projects</div>
          </div>
          <Button variant="white">
            View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
          </Button>
        </div>

        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </section>

      <section className="experiences bg-ash mx-3 mt-3 p-6 rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="font-medium text-gray-800 text-lg">Experiences</div>
          </div>
          <Button variant="white">
            View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
          </Button>
        </div>

        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </section>
    </div>
  );
}
