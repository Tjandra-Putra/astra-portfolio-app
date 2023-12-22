import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ModifyPage = () => {
  return (
    <div className="">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Manage Platform</div>
      </div>
    </div>
  );
};

export default ModifyPage;
