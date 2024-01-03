import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "./ui/badge";
import Link from "next/link";

interface ProjectCardComponentProps {
  data: { [key: string]: any };
}

const ExperienceCard: React.FC<ProjectCardComponentProps> = ({ data }) => {
  return (
    <div className=" bg-white rounded-lg my-5 p-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="avatar-border border-2 border-[#f0f1f3] p-2 rounded-full">
          <div className="avatar h-14 w-14 flex items-center justify-center bg-[#183153] text-[#eecd4e] font-bold rounded-full capitalize">
            {data.name[0]}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="project-title text-gray-800 font-medium text-lg">{data.workExperienceTitle}</div>
          <div className="flex flex-wrap gap-2 mt-1 capitalize">
            <Badge variant="secondary" className="text-xs font-normal">
              {data.company}
            </Badge>
          </div>
        </div>
      </div>
      <div className="view-more transition-transform transform hover:translate-x-1">
        <Link href={`/experience/${data.id}`}>
          <FontAwesomeIcon icon={faChevronRight} className="me-2" color="#000000" />
        </Link>
      </div>
    </div>
  );
};

export default ExperienceCard;
