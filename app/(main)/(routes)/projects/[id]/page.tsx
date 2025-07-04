"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
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
import { calculateDuration } from "@/lib/format-date";
import { Skeleton } from "@/components/ui/skeleton";

const Project = () => {
  // get id from url
  const params = useParams();
  const projectId = params.id;

  const dispatch = useDispatch();

  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [project, setProject] = useState<any>();
  const [loading, setLoading] = useState(true);

  // Improved image loading/error state
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/project/${projectId}`);
      setProject(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching data:", error.response?.data);
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

  // Image source logic
  const imageSrc = project?.thumbnailUrl || "/assets/image/pexels-fauxels-3183186.jpg";
  const isFallback = !project?.thumbnailUrl;

  // Handle image error: if main fails, try fallback; if fallback fails, show message
  const handleImageError = () => {
    if (isFallback) {
      setImageError(true);
      setLoadingImage(false);
    } else {
      setLoadingImage(true);
      setImageError(false);
      // Switch to fallback image by clearing thumbnailUrl
      setProject((prev: any) => ({ ...prev, thumbnailUrl: null }));
    }
  };

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

      <section className="bg-ash rounded-lg p-6 dark:bg-[#0c0c0c] dark:border dark:border-white/10">
        <div className="company">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-200">Company</div>
            <div className="text-black w-full dark:text-zinc-300">{project?.company}</div>
          </div>
        </div>

        <div className="project-title">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-200">Title</div>
            <div className="text-black w-full dark:text-zinc-300">{project?.name}</div>
          </div>
        </div>

        <div className="project-type">
          <div className="flex mb-3">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-200">Category</div>
            <div className="text-black w-full dark:text-zinc-300">{project?.category}</div>
          </div>
        </div>

        <div className="start-date">
          <div className="flex">
            <div className="text-[#000000] w-36 font-semibold dark:text-zinc-200">Date</div>
            <div className="text-black w-full dark:text-zinc-300">
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
          {loadingImage && !imageError && (
            <div className="flex items-center justify-center w-full h-64 bg-ash rounded-lg dark:bg-[#171717]">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          )}
          {!imageError ? (
            <div className="image-wrapper overflow-y-hidden">
              <Image
                src={imageSrc}
                alt={project?.name}
                width={800}
                height={450}
                layout="responsive"
                priority={true}
                onLoad={() => setLoadingImage(false)}
                onError={handleImageError}
                className={`thumbnail-img w-full h-full rounded-lg ${loadingImage ? "hidden" : ""}`}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-64 bg-ash rounded-lg dark:bg-[#171717] text-zinc-500">
              <span>No image available</span>
            </div>
          )}
        </div>

        <div className="title text-2xl font-semibold capitalize dark:text-zinc-200">{project?.name}</div>
        <div
          className="description my-3 leading-6 whitespace-pre-wrap dark:text-zinc-300"
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
                <Badge key={index} variant="navy" className="text-xs font-normal">
                  {tag.trim()}
                </Badge>
              ))
            : null}
        </div>

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
