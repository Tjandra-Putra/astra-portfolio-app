"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Badge } from "@/components/ui/badge";
import Projects from "@/components/projects";
import { TextEditor } from "@/components/text-editor";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import Link from "next/link";
import { stateToHTML } from "draft-js-export-html";
import ReactMarkdown from "react-markdown";

import projectsData from "@/data/data";

interface InlineStyleFnOptions {
  element: string;
  style: Record<string, string>;
}

interface InlineStyleFn {
  (styles: string[]): InlineStyleFnOptions | undefined;
}

// this is to allow for custom inline styles when rendering the HTML from the editor
let options: { inlineStyleFn?: InlineStyleFn } = {
  inlineStyleFn: (styles) => {
    let key = "color-";
    let color = styles.find((value) => value.startsWith(key));

    if (color) {
      return {
        element: "span",
        style: {
          color: color.replace(key, ""),
        },
      };
    }
  },
};

const Project = () => {
  // get id from url
  const params = useParams();
  const id = params.id;

  // get project data by id
  const data = projectsData.find((project) => project.id === id);

  return (
    <React.Fragment>
      <section className="bg-ash rounded-lg p-6">
        <div className="company">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Company</div>
            <div className="text-black w-full">{data?.company}</div>
          </div>
        </div>

        <div className="project-title">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Title</div>
            <div className="text-black w-full">{data?.name}</div>
          </div>
        </div>

        <div className="project-type">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Type</div>
            <div className="text-black w-full">{data?.projectType}</div>
          </div>
        </div>

        <div className="start-date">
          <div className="flex">
            <div className="text-[#1c3454] w-36">Date</div>
            <div className="text-black w-full">
              {/* {data?.startDate.toLocaleDateString()} to {data?.endDate.toLocaleDateString()} */}
            </div>
          </div>
        </div>
      </section>

      <section>
        <img
          src={data?.thumbnailUrl}
          alt={data?.name}
          className="thumbnail-img w-full h-full rounded-lg my-6 shadow-paper"
        />
        <div className="title text-2xl font-semibold capitalize">{data?.name}</div>
        <div className="description capitalize my-3 leading-6">{data?.description}</div>
        <div className="buttons flex flex-row justify-end">
          <Button className="mr-3" variant={"navy"} disabled={!data?.projectUrl}>
            <Link href={data ? data.projectUrl : ""} target="_blank">
              Visit Website
              <FontAwesomeIcon icon={faArrowAltCircleRight} className="ms-2" />
            </Link>
          </Button>
          <Button className="mr-3" variant={"ash"} disabled={!data?.githubUrl}>
            <Link href={data ? data.githubUrl : ""} target="_blank">
              Github
              <FontAwesomeIcon icon={faGithub} className="ms-2" />
            </Link>
          </Button>
        </div>
        <Separator className="my-6" />

        {/* Render Markdown Content Here*/}
        <div className="markdown-content">
          <ReactMarkdown>{data?.markdown || ""}</ReactMarkdown>
        </div>

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
        <Separator className="my-6" />
        <Projects title="Other Projects" />
      </section>
    </React.Fragment>
  );
};

export default Project;
4;
