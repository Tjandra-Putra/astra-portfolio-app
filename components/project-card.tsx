import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "./ui/badge";
import Link from "next/link";

const ProjectCard = () => {
  const projectTags = [
    "React.js",
    "Node.js",
    "MongoDB",
    "Redux",
    "TypeScript",
    "JavaScript",
    // Add more tags as needed
  ];

  // Limit the number of displayed badges to 4
  const displayedTags = projectTags.slice(0, 3);

  return (
    <div className=" bg-white rounded-lg my-5 p-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="avatar-border border-2 border-[#f0f1f3] p-2 rounded-full">
          <Avatar className="h-14 w-14">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="project-title text-gray-800 font-medium text-lg">Naimu Ecommerce</div>
          <div className="flex flex-wrap gap-2 mt-1 capitalize">
            {displayedTags.map((tag, index) => (
              <div key={index} className="project-tags">
                <Badge variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              </div>
            ))}
            {projectTags.length > 3 && (
              <div className="project-tags">
                <Badge variant="secondary" className="text-xs font-normal">
                  ...
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="view-more transition-transform transform hover:translate-x-1">
        <Link href="/project/1">
          <FontAwesomeIcon icon={faChevronRight} className="me-2" color="#000000" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
