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
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { calculateDuration } from "@/lib/format-date";

const Project = () => {
  // get id from url
  const params = useParams();
  const projectId = params.id;

  const dispatch = useDispatch();

  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [project, setProject] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

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

  useEffect(() => {
    fetchProject();
    fetchUserProfile();
  }, []);

  return !project ? (
    <Loader />
  ) : (
    <React.Fragment>
      <div className="flex justify-between">
        <Button className="sm:mb-6 mb-3" variant={"ghost"} size="sm" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Previous
        </Button>
      </div>

      <section className="bg-ash rounded-lg p-6 dark:bg-black/50 dark:backdrop-blur-md dark:border dark:border-white/10">
        <div className="company">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-300">Company</div>
            <div className="text-black w-full dark:text-zinc-400">{project?.company}</div>
          </div>
        </div>

        <div className="project-title">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-300">Title</div>
            <div className="text-black w-full dark:text-zinc-400">{project?.name}</div>
          </div>
        </div>

        <div className="project-type">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-300">Category</div>
            <div className="text-black w-full dark:text-zinc-400">{project?.category}</div>
          </div>
        </div>

        <div className="start-date">
          <div className="flex">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-300">Date</div>
            <div className="text-black w-full dark:text-zinc-400">
              {new Date(project.startDate).toLocaleDateString("en-SG")} to {new Date(project.endDate).toLocaleDateString("en-SG")}
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
          {loadingImage && (
            <div className="flex items-center justify-center w-full h-64 bg-ash rounded-lg">
              <Loader />
            </div>
          )}
          {project?.thumbnailUrl ? (
            <div className="image-wrapper overflow-y-scroll">
              <Image
                src={project?.thumbnailUrl}
                alt={project?.name}
                width={800}
                height={450}
                layout="responsive"
                priority={true}
                onLoad={() => setLoadingImage(false)}
                onError={() => setLoadingImage(false)}
                className={`thumbnail-img w-full h-full rounded-lg ${loadingImage ? "hidden" : ""}`}
              />
            </div>
          ) : (
            <div className="image-wrapper overflow-y-scroll">
              <Image
                src="/assets/image/pexels-fauxels-3183186.jpg"
                alt={project?.name}
                width={800}
                height={450}
                layout="responsive"
                onLoad={() => setLoadingImage(false)}
                onError={() => setLoadingImage(false)}
                className={`thumbnail-img w-full h-full ${loadingImage ? "hidden" : ""}`}
              />
            </div>
          )}
        </div>

        <div className="title text-2xl font-semibold capitalize dark:text-zinc-300">{project?.name}</div>
        <div
          className="description my-3 leading-6 whitespace-pre-wrap dark:text-zinc-400"
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

        <Separator className="mt-6 mb-6" />

        {project?.content?.length > 351 ? <Editor initialContent={project?.content} editable={false} /> : null}

        <div className="badges flex flex-row flex-wrap gap-3 my-6">
          {project.tags
            ? project.tags.split(",").map((tag: string, index: number) => (
                <Badge key={index} variant="sky">
                  {tag.trim()}
                </Badge>
              ))
            : null}
        </div>

        {/* <Separator className="mt-6 mb-6" />

        <div className="badges flex flex-row flex-wrap gap-3 my-6">
          {project.tags
            ? project.tags.split(",").map((tag: string, index: number) => (
                <Badge key={index} variant="navy">
                  {tag.trim()}
                </Badge>
              ))
            : null}
        </div>

        <Separator className="my-6" /> */}

        {project?.isWorkExperience ? (
          <Experiences title="Other Experiences" showAll={true} detailedPage={false} currentExperienceId={projectId} />
        ) : (
          <Projects title="Other Projects" showAll={true} detailedPage={false} currentProjectId={projectId} />
        )}
      </section>
    </React.Fragment>
  );
};

export default Project;
