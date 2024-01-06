import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Projects from "@/components/projects";
import Experiences from "@/components/experiences";

const ExperiencesPage = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Experiences</div>
      </div>

      <div className="description mt-3 mb-10 text-gray-900 font-normal">
        These are some of the experiences that I have had. I have worked on many projects, but I only list the ones that
        I can show publicly.
      </div>

      <Experiences showAll={true} />
    </div>
  );
};

export default ExperiencesPage;
