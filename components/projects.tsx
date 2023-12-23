import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import ProjectCard from "./project-card";

const Projects = () => {
  // Dummy data for projects (replace it with your actual data)
  const projectsData = [
    { id: 1, title: "Project 1" },
    { id: 2, title: "Project 2" },
    { id: 3, title: "Project 3" },
    { id: 4, title: "Project 4" },
  ];

  // Slice the array to show only the first 3 items
  const visibleProjects = projectsData.slice(0, 3);

  return (
    <div className="projects bg-ash p-5 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
          <div className="font-medium text-gray-800 text-lg">Projects</div>
        </div>
        <Button variant="white">
          View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
        </Button>
      </div>

      {/* Use map to render only the first 3 ProjectCard components */}
      {visibleProjects.map((project) => (
        <ProjectCard key={project.id} />
      ))}
    </div>
  );
};

export default Projects;
