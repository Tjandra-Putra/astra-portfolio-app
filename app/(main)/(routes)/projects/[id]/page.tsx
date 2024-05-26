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
import { setUserInfo } from "@/app/redux/features/user-slice";
import { useDispatch } from "react-redux";
import { Editor } from "@/components/text-editors/blocknote-editor";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Project = () => {
  // get id from url
  const params = useParams();
  const projectId = params.id;

  const dispatch = useDispatch();

  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [project, setProject] = useState<any>();
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/project/${projectId}`);
      setProject(response.data);

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching data:", error.response.data);

      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/project/get-profile/${projectId}`);

      // redux
      dispatch(
        setUserInfo({
          id: response.data.id,
          role: response.data.role,
          name: response.data.name,
          domain: response.data.domain,
          email: response.data.email,
          workEmail: response.data.workEmail,
        })
      );
    } catch (error: any) {}
  };

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const endDay = end.getDate();

    let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

    if (endDay >= startDay) {
      totalMonths++;
    }

    if (totalMonths === 1) {
      return "1 month";
    }

    if (totalMonths < 12) {
      return `${totalMonths} months`;
    }

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    }

    return `${years} ${years === 1 ? "year" : "years"}, ${remainingMonths} ${
      remainingMonths === 1 ? "month" : "months"
    }`;
  };

  useEffect(() => {
    fetchProject();
    fetchUserProfile();
  }, []);

  return !project ? (
    <Loader />
  ) : (
    <React.Fragment>
      <Button className="sm:mb-6 mb-3" variant={"ghost"} size="sm" onClick={() => window.history.back()}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Go Back
      </Button>
      {/* Next Button */}

      <section className="bg-ash rounded-lg p-6">
        <div className="company">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold">Company</div>
            <div className="text-black w-full">{project?.company}</div>
          </div>
        </div>

        <div className="project-title">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold">Title</div>
            <div className="text-black w-full">{project?.name}</div>
          </div>
        </div>

        <div className="project-type">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold">Category</div>
            <div className="text-black w-full">{project?.category}</div>
          </div>
        </div>

        <div className="start-date">
          <div className="flex">
            <div className="text-[#000000] w-36 font-semibold">Date</div>
            <div className="text-black w-full">
              {new Date(project.startDate).toLocaleDateString("en-SG")} to{" "}
              {new Date(project.endDate).toLocaleDateString("en-SG")}
              <br />
              <Badge variant="navy" className="mt-2">
                {calculateDuration(project.startDate, project.endDate)}
              </Badge>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="thumbnail-wrapper my-6 rounded-lg shadow-paper">
          {project?.thumbnailUrl ? (
            <div className="image-wrapper overflow-y-scroll">
              <Image
                src={project?.thumbnailUrl}
                alt={project?.name}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }} // optional
                className="thumbnail-img w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <div className="image-wrapper overflow-y-scroll">
              <Image
                src="/assets/image/pexels-fauxels-3183186.jpg"
                alt={project?.name}
                width={500}
                height={500}
                className="thumbnail-img w-full h-full"
              />
            </div>
          )}
          {/* <div className="browser-bar bg-[#fbfbfb] w-full rounded-tl-lg rounded-tr-lg border-b border-gray-300 bg-opacity-60">
            <div className="flex justify-end items-center h-6 mr-3">
              <div>
                <div className="circle w-2 h-2 rounded-full mr-2 mt-1/2 bg-red-500"></div>
              </div>
              <div>
                <div className="circle w-2 h-2 rounded-full mr-2 mt-1/2 bg-orange-500"></div>
              </div>
              <div>
                <div className="circle w-2 h-2 rounded-full mr-2 mt-1/2 bg-green-500"></div>
              </div>
            </div>
          </div>
          {project?.thumbnailUrl ? (
            <div className="image-wrapper overflow-y-scroll sm:max-h-[50vh] max-h-[30vh]">
              <Image
                src={project?.thumbnailUrl}
                alt={project?.name}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }} // optional
                className="thumbnail-img w-full h-full rounded-bl-lg rounded-br-lg"
              />
            </div>
          ) : (
            <div className="image-wrapper overflow-y-scroll">
              <Image
                src="/assets/image/pexels-fauxels-3183186.jpg"
                alt={project?.name}
                width={500}
                height={500}
                className="thumbnail-img w-full h-full"
              />
            </div>
          )} */}
        </div>
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

        <Editor initialContent={project?.content} editable={false} />

        <div className="badges flex flex-row flex-wrap gap-3 my-6">
          {project.tags
            ? project.tags.split(",").map((tag: string, index: number) => (
                <Badge key={index} variant="navy">
                  {tag.trim()}
                </Badge>
              ))
            : null}
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
