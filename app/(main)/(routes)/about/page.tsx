import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import BottomGroup from "@/components/bottom-group";

const AboutPage = () => {
  return (
    <div className="">
      <div className="flex items-center gap-2 mb-7">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="font-medium text-gray-800 text-lg">About</div>
      </div>

      <div className="font-medium text-gray-800 text-4xl">
        Hello, I'm <span className="text-primary">Tjandra</span>
      </div>

      <div className="text-gray-800 text-lg mt-2">
        I am a student at Singapore Management University studying Information Systems. I'm passionate in learning new
        technologies and software development. I'm also interested in UI/UX design and product management.
      </div>
    </div>
  );
};

export default AboutPage;
