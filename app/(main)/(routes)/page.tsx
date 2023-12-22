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

// default route for the app "https://localhost:3000/"
export default function Home() {
  return (
    <div className="min-h-screen h-full shadow-paper bg-white rounded-lg mt-4 pb-[0.1rem]">
      <section className="introduction p-4">
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
              <div className="name text-4xl font-medium">I'm Tjandra</div>
              <div className="description mt-3 text-gray-900 font-normal">
                I'm passionate about building products that make a positive impact on people's lives.
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

      <section className="collaborate mx-3 mt-3 p-6 text-center">
        <div className="title text-xl font-semibold text-gray-700">Let's collaborate on your next project!</div>
        <div className="description mt-3 text-gray-900 font-normal">
          I'm always open to discussing product design work or partnership opportunities.
        </div>

        <div className="buttons flex justify-center mt-5 space-x-3">
          <Button variant={"navy"}>
            <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
            Resume
          </Button>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faCopy} className="me-2" color="#000000" />
            Copy Email
          </Button>
        </div>
      </section>

      <SocialCard />

      <Footer />
    </div>
  );
}
