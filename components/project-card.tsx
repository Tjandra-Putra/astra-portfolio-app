import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFolder } from "@fortawesome/free-solid-svg-icons";

import { Badge } from "./ui/badge";
import Link from "next/link";

interface ProjectCardComponentProps {
  data: { [key: string]: any };
}

const ProjectCard: React.FC<ProjectCardComponentProps> = ({ data }) => {
  // Limit the number of displayed badges to 3
  const displayedTags = data.tags.split(",").slice(0, 2);

  return (
    <div className="min-h-28 bg-white rounded-lg md:mt-5 mt-3 p-3 flex items-center justify-between ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:ring-[3px] hover:ring-[#74c0fc] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#171717] dark:border">
      <div className="flex items-center gap-4">
        <div className="avatar-border border-2 border-navy p-2 rounded-full dark:border-zinc-300">
          <div className="avatar sm:h-14 sm:w-14 h-10 w-10 flex items-center justify-center bg-[#183153] text-[#ffffff] font-semibold rounded-full capitalize">
            <FontAwesomeIcon icon={faFolder} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="project-title text-gray-800 font-medium sm:text-lg text-base leading-5 mb-1 dark:text-zinc-300">{data.name}</div>
          <div className="flex flex-wrap gap-2 mt-1 capitalize">
            <Badge variant="sky" className="text-xs font-semibold">
              {data.category}
            </Badge>
            {displayedTags.length > 0 &&
              displayedTags.some((tag: string) => tag.trim() !== "") &&
              displayedTags.map((tag: string, index: number) => (
                <div key={index} className="project-tags">
                  <Badge variant="secondary" className="text-xs font-semibold dark:text-zinc-300">
                    {tag}
                  </Badge>
                </div>
              ))}
            {data.tags.split(",").length > 3 && (
              <div className="project-tags">
                <Badge variant="secondary" className="text-xs font-semibold">
                  ...
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="view-more transition-transform transform hover:translate-x-1">
        <FontAwesomeIcon icon={faChevronRight} className="me-2 dark:text-white" />
      </div>
    </div>
  );
};

export default ProjectCard;
