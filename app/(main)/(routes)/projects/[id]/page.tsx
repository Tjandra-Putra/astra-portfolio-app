"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { ArrowLeft, ArrowUpRight, FileText, Github } from "lucide-react";

import Projects from "@/components/projects";
import Experiences from "@/components/experiences";
import Loader from "@/components/layout/loader";
import { Editor } from "@/components/text-editors/blocknote-editor";
import { ProjectGallery } from "@/components/project-gallery";
import { ExpandOnScroll } from "@/components/fx/expand-on-scroll";
import { calculateDuration } from "@/lib/format-date";
import { extractImageUrls } from "@/utils/image-processor";
import { setUserInfo } from "@/app/redux/features/user-slice";
import { rememberProfileId } from "@/lib/viewed-profile";
import { getJSON } from "@/lib/data-client";

const Meta = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-4 py-3">
    <dt className="tt-mono shrink-0">{label}</dt>
    <dd className="text-right text-[0.875rem] font-medium tracking-tight text-ink">{children}</dd>
  </div>
);

const Project = () => {
  const params = useParams();
  const projectId = params.id;
  const dispatch = useDispatch();

  const [project, setProject] = useState<any>();

  const fetchProject = async () => {
    try {
      const response = await getJSON<any>(`/api/project/${projectId}`);
      setProject(response);
    } catch (error: any) {
      console.error("Error fetching data:", error.response?.data);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getJSON<any>(`/api/project/get-profile/${projectId}`);
      rememberProfileId(response.id);
      dispatch(
        setUserInfo({
          id: response.id,
          role: response.role,
          name: response.name,
          domain: response.domain,
          email: response.email,
          workEmail: response.workEmail,
        })
      );
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchProject();
    fetchUserProfile();
  }, []);

  if (!project) return <Loader />;

  const imageSrc = project?.thumbnailUrl || "/assets/image/pexels-fauxels-3183186.jpg";
  const hasEnd = !!project?.endDate && !Number.isNaN(new Date(project.endDate).getTime()) && new Date(project.endDate).getFullYear() > 1970;

  const tags: string[] = project?.tags
    ? project.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  const metaRows: { label: string; value: React.ReactNode }[] = [
    ...(project?.company ? [{ label: "Company", value: project.company }] : []),
    { label: "Category", value: project?.category || "—" },
    {
      label: "Dates",
      value: (
        <>
          {new Date(project.startDate).toLocaleDateString("en-SG")} —{" "}
          {hasEnd ? new Date(project.endDate).toLocaleDateString("en-SG") : <span className="acc">Present</span>}
        </>
      ),
    },
    { label: "Duration", value: calculateDuration(project.startDate, project.endDate) },
  ];

  return (
    <React.Fragment>
      {/* ══ Masthead of the case study ═════════════════════ */}
      <div className="rise">
        <div>
          <button onClick={() => window.history.back()} className="btn btn-glass btn-sm">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back
          </button>
        </div>

        <p className="tt-mono mt-7 flex w-fit items-center gap-2">
          <span className="pin" />
          {project?.category || "Project"}
        </p>
        <h1 className="tt-h1 mt-3 max-w-3xl">{project?.name}</h1>
      </div>

      {/* ══ Hero media ═════════════════════════════════════ */}
      {/* Scroll into the media: it pins and grows to fill the screen, then
          releases into the write-up below. */}
      <div className="mt-8 sm:mt-10">
        <ExpandOnScroll>
          <ProjectGallery
            images={[imageSrc, ...extractImageUrls(project?.content)]}
            title={project?.name}
            siteUrl={project?.projectUrl}
          />
        </ExpandOnScroll>
      </div>

      {/* ══ Body ═══════════════════════════════════════════ */}
      <div className="bento mt-12 items-start sm:mt-14">
        <aside className="glass pad reveal sm:col-span-6 lg:col-span-4">
          <div className="flex items-center justify-between gap-3">
            <p className="tt-h3">Details</p>
            <span className="tt-mono">{project?.isWorkExperience ? "Role" : "Project"}</span>
          </div>

          <hr className="rule my-4" />

          <dl>
            {metaRows.map((row, i) => (
              <React.Fragment key={row.label}>
                {i > 0 && <hr className="rule" />}
                <Meta label={row.label}>{row.value}</Meta>
              </React.Fragment>
            ))}
          </dl>

          {(project?.projectUrl || project?.githubUrl) && (
            <React.Fragment>
              <hr className="rule mt-4" />
              <div className="mt-5 flex flex-wrap gap-2">
                {project?.projectUrl && (
                  <Link href={project.projectUrl} target="_blank" className="btn btn-glass btn-sm">
                    Live demo
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                )}
                {project?.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" className="btn btn-glass btn-sm">
                    <Github className="h-4 w-4" strokeWidth={1.75} />
                    GitHub
                  </Link>
                )}
              </div>
            </React.Fragment>
          )}

          {tags.length > 0 && (
            <React.Fragment>
              <hr className="rule mt-5" />
              <p className="tt-mono mt-5">Stack</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </React.Fragment>
          )}
        </aside>

        <div className="glass pad-lg reveal sm:col-span-6 lg:col-span-8">
          <p className="tt-mono">Overview</p>
          <hr className="rule mt-4" />

          {project?.description ? (
            <div
              className="tt-lead mt-6 whitespace-pre-wrap [&_a]:text-[var(--acc-text)] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: project?.description || "" }}
            />
          ) : project?.content?.length > 351 ? null : (
            <div className="glass-well pad-lg mt-6 grid place-items-center text-center">
              <span className="glass-bright mb-4 grid h-12 w-12 place-items-center rounded-tile">
                <FileText className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
              </span>
              <p className="tt-h3">No write-up yet</p>
              <p className="tt-sub mt-1">This entry has no description added.</p>
            </div>
          )}

          {project?.content?.length > 351 ? (
            <div className="mt-8">
              <hr className="rule" />
              <div className="mt-8 [&_a]:text-[var(--acc-text)] [&_a]:underline">
                <Editor initialContent={project?.content} editable={false} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        {project?.isWorkExperience ? (
          <Experiences title="Other Experiences" showAll={true} detailedPage={false} currentExperienceId={projectId} />
        ) : (
          <Projects title="Other Projects" showAll={true} detailedPage={false} currentProjectId={projectId} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Project;
