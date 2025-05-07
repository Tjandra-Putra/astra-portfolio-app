import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Projects from "@/components/projects";

const ProjectsPage = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg dark:text-zinc-300">Projects</div>
      </div>

      <div className="description mt-3 mb-6 text-gray-900 font-normal text-sm sm:text-base dark:text-zinc-400">
        This is a list of projects that I have worked on. I have worked on many projects, but I only list the ones that I can show publicly.
      </div>

      <Projects showAll={true} />
    </div>
  );
};

export default ProjectsPage;
