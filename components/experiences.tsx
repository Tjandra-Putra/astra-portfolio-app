import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import ExperienceCard from "./experience-card";

const Experiences = () => {
  return (
    <section className="experiences bg-ash mt-4 p-5 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
          <div className="font-medium text-gray-800 text-lg">Experiences</div>
        </div>
        <Button variant="white">
          View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
        </Button>
      </div>

      <ExperienceCard />
      <ExperienceCard />
      <ExperienceCard />
    </section>
  );
};

export default Experiences;
