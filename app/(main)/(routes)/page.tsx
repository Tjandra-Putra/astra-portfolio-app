import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFile, faCopy } from "@fortawesome/free-regular-svg-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectCard from "@/components/project-card";
import ExperienceCard from "@/components/experience-card";
import SocialCard from "@/components/social-card";
import Footer from "@/components/footer";
import Collaborate from "@/components/collaborate";
import BottomGroup from "@/components/bottom-group";
import Projects from "@/components/projects";
import Experiences from "@/components/experiences";

// default route for the app "https://localhost:3000/"
export default function Home() {
  return (
    <div className="">
      <section className="introduction">
        <div className="flex justify-between mb-5">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800 text-lg">Software Engineer</div>
          </div>
          <Link href="/contact" className="status uppercase tracking-wider text-end">
            <Badge variant={"ocean"} className="font-semibold">
              Available for Hire
            </Badge>
          </Link>
        </div>

        <div className="grid md:grid-cols-12 gap-6 mb-5 text-center sm:text-left">
          <div className="md:col-span-8">
            <div className="w-full">
              <div className="name text-4xl font-medium">
                Hello, I'm <span className="text-primary">Tjandra</span>
              </div>
              <div className="description mt-3 text-gray-900 font-normal">
                I'm passionate about building products that make a positive impact on people's lives. apple apple apple
                apple apple apple apple.
              </div>
              <div className="buttons mt-5 space-x-3">
                <Button variant={"navy"}>
                  <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
                  Resume
                </Button>
                <Button variant="secondary" className="bg-cheese">
                  <FontAwesomeIcon icon={faCopy} className="me-2" color="#000000" />
                  Copy Email
                </Button>
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="w-full">
              <div className="avatar-border border-4 border-[#000000] p-2 rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Projects />

      <Experiences />
    </div>
  );
}
