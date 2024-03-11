"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Projects from "@/components/projects";
import { formatDate } from "@/lib/format-date";
import { useSelector } from "react-redux";

import Loader from "@/components/layout/loader";
import Experiences from "@/components/experiences";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Project = () => {
  // get id from url
  const params = useParams();
  const projectId = params.id;

  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [project, setProject] = useState<any>();
  const [loading, setLoading] = useState(true);

  console.log("paramsId: ", projectId);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/project/${projectId}`);
      setProject(response.data);

      console.log(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching data:", error.response.data);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return !project ? (
    <Loader />
  ) : (
    <React.Fragment>
      <section className="bg-ash rounded-lg p-6">
        <div className="company">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Company</div>
            <div className="text-black w-full">{project?.company}</div>
          </div>
        </div>

        <div className="project-title">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Title</div>
            <div className="text-black w-full">{project?.name}</div>
          </div>
        </div>

        <div className="project-type">
          <div className="flex mb-3">
            <div className="text-[#1c3454] w-36">Category</div>
            <div className="text-black w-full">{project?.category}</div>
          </div>
        </div>

        <div className="start-date">
          <div className="flex">
            <div className="text-[#1c3454] w-36">Date</div>
            <div className="text-black w-full">
              {project?.startDate ? `${formatDate(project.startDate)} to ${formatDate(project.endDate)}` : "N/A"}{" "}
            </div>
          </div>
        </div>
      </section>

      <section>
        {project?.thumbnailUrl ? (
          <Image
            src={project?.thumbnailUrl}
            alt={project?.name}
            width={500}
            height={500}
            className="thumbnail-img w-full h-full rounded-lg my-6 shadow-paper"
          />
        ) : (
          <Image
            src="/assets/image/pexels-fauxels-3183186.jpg"
            alt={project?.name}
            width={500}
            height={500}
            className="thumbnail-img w-full h-full rounded-lg my-6 shadow-paper"
          />
        )}

        <div className="title text-2xl font-semibold capitalize">{project?.name}</div>
        <div
          className="description my-3 leading-6 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: project?.description || "" }}
        />
        <div className="buttons flex flex-row justify-end">
          <Button className="mr-3" variant={"navy"} disabled={!project?.projectUrl}>
            <Link href={project ? project.projectUrl : ""} target="_blank">
              Visit Website
              <FontAwesomeIcon icon={faArrowAltCircleRight} className="ms-2" />
            </Link>
          </Button>
          <Button className="mr-3" variant={"ash"} disabled={!project?.githubUrl}>
            <Link href={project ? project.githubUrl : ""} target="_blank">
              Github
              <FontAwesomeIcon icon={faGithub} className="ms-2" />
            </Link>
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Render Markdown Content Here*/}
        <div className="markdown-content whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => {
                return <img {...props} className="w-full h-full rounded-lg my-6 shadow-paper" />;
              },
              ul: ({ node, ...props }) => {
                return <ul {...props} className="leading-tight space-y-[-10px] mt-[-20px]" />;
              },
              li: ({ node, ...props }) => {
                return <li {...props} className="list-inside" />;
              },
              ol: ({ node, ...props }) => {
                return <ol {...props} className="leading-tight space-y-[-10px] mt-[-20px]" />;
              },
              h3: ({ node, ...props }) => {
                return <h3 {...props} className="text-lg font-semibold mb-[-1rem]" />;
              },
              h4: ({ node, ...props }) => {
                return <h4 {...props} className="text-base font-semibold mb-[-1rem]" />;
              },
              h5: ({ node, ...props }) => {
                return <h5 {...props} className="text-sm font-semibold mb-[-1rem]" />;
              },
              a: ({ node, ...props }) => {
                return <a {...props} className="text-blue-500 hover:underline underline" />;
              },
            }}
          >
            {project?.content || ""}
          </ReactMarkdown>
        </div>

        <div className="badges flex flex-row flex-wrap gap-3 my-6">
          <div className="badges flex flex-row flex-wrap gap-3 my-6">
            {project?.tags
              ? project?.tags.split(",").map((tag: string, index: number) => (
                  <Badge key={index} variant={"diamond"}>
                    {tag.trim()}
                  </Badge>
                ))
              : null}
          </div>
        </div>
        <Separator className="my-6" />

        {project?.isWorkExperience ? (
          <Experiences title="Other Experiences" showAll={true} detailedPage={true} />
        ) : (
          <Projects title="Other Projects" showAll={true} detailedPage={true} />
        )}
      </section>
    </React.Fragment>
  );
};

export default Project;
4;
