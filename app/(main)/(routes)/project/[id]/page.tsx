import React from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
// brands
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Badge } from "@/components/ui/badge";
import Projects from "@/components/projects";

const Project = () => {
  return (
    <React.Fragment>
      <section className="bg-ash rounded-lg p-6">
        <div className="company">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Company</div>
            <div className="text-black w-full">Personal</div>
          </div>
        </div>

        <div className="project-title">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Title</div>
            <div className="text-black w-full">Naimu Ecommerce</div>
          </div>
        </div>

        <div className="project-type">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Type</div>
            <div className="text-black w-full">Full Stack Web Development</div>
          </div>
        </div>

        <div className="start-date">
          <div className="flex">
            <div className="text-[#1c3454] w-36">Date</div>
            <div className="text-black w-full">12/20/2023 to 12/20/2024</div>
          </div>
        </div>
      </section>

      <section>
        <img
          src="https://cdna.artstation.com/p/assets/images/images/027/840/198/large/michael-black-a3.jpg?1592714533"
          alt=""
          className="thumbnail-img w-full h-full rounded-lg my-6"
        />
        <div className="title text-2xl font-semibold capitalize">Naimu Ecommerce</div>
        <div className="description capitalize my-3 leading-6">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit amet dignissimos inventore quisquam fugiat
          a accusantium odio nulla voluptas quas! Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus,
          labore?
        </div>
        <div className="buttons flex flex-row justify-end">
          <Button className="mr-3" variant={"navy"}>
            Visit Website
            <FontAwesomeIcon icon={faArrowAltCircleRight} className="ms-2" />
          </Button>
          <Button className="mr-3" variant={"ash"}>
            Github
            <FontAwesomeIcon icon={faGithub} className="ms-2" />
          </Button>
        </div>
        <hr className="my-6" />
        {/* Render Markdown Content Here*/}
        Markdown Content Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugiat reprehenderit unde
        facilis iste fugit quo itaque in sed minus.
        <div className="badges flex flex-row flex-wrap gap-3 my-6">
          <Badge variant={"diamond"}>React</Badge>
          <Badge variant={"diamond"}>Next.js</Badge>
          <Badge variant={"diamond"}>Typescript</Badge>
          <Badge variant={"diamond"}>Tailwindcss</Badge>
          <Badge variant={"diamond"}>Node.js</Badge>
          <Badge variant={"diamond"}>Express.js</Badge>
          <Badge variant={"diamond"}>MongoDB</Badge>
          <Badge variant={"diamond"}>Mongoose</Badge>
        </div>
        <hr className="my-6" />
        <Projects title="Other Projects" />
      </section>
    </React.Fragment>
  );
};

export default Project;
4;
