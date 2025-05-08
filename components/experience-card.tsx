import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFolder } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { calculateDuration, formatDate, formatDateRange } from "@/lib/format-date";

interface ProjectCardComponentProps {
  data: { [key: string]: any };
}

const ExperienceCard: React.FC<ProjectCardComponentProps> = ({ data }) => {
  return (
    <div className="min-h-28 bg-white rounded-lg md:mt-5 mt-3 p-3 flex items-center justify-between ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:ring-[3px] hover:ring-[#74c0fc] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#171717] dark:border">
      <div className="flex items-center gap-4">
        <div className="avatar-border border-2 border-navy p-2 rounded-full dark:border-zinc-300">
          <div className="avatar sm:h-14 sm:w-14 h-10 w-10 flex items-center justify-center bg-[#183153] text-white font-semibold rounded-full capitalize">
            <FontAwesomeIcon icon={faFolder} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="project-title text-gray-800 font-medium sm:text-lg text-base leading-5 mb-1 dark:text-zinc-200">
            {data.workExperienceTitle}
          </div>
          <div className="flex flex-wrap gap-2 mt-1 capitalize">
            {data.company && (
              <Badge variant="navy" className="text-xs font-semibold dark:text-zinc-300">
                {data.company}
              </Badge>
            )}
            {/* work duration in months */}
            {/* <Badge variant="sky" className="text-xs font-semibold">
              {calculateDuration(data.startDate, data.endDate)}
            </Badge> */}
            <Badge variant="secondary" className="text-xs font-semibold dark:text-zinc-300">
              {`${formatDateRange(data.startDate, data.endDate)}`}
            </Badge>
          </div>
        </div>
      </div>
      <div className="view-more transition-transform transform hover:translate-x-1">
        <FontAwesomeIcon icon={faChevronRight} className="me-2 dark:text-white" />
      </div>
    </div>
  );
};

export default ExperienceCard;
