import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import ExperienceCard from "./experience-card";

const Experiences = () => {
  // Dummy data for experiences (replace it with your actual data)
  const experiencesData = [
    { id: 1, title: "Experience 1" },
    { id: 2, title: "Experience 2" },
    { id: 3, title: "Experience 3" },
    { id: 4, title: "Experience 4" },
  ];

  // Slice the array to show only the first 3 items
  const visibleExperiences = experiencesData.slice(0, 3);

  return (
    <section className="experiences bg-ash mt-4 p-6 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
          <div className="font-medium text-gray-800 text-lg">Experiences</div>
        </div>
        <Button variant="white">
          View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" color="#000000" />
        </Button>
      </div>

      {/* Use map to render only the first 3 ExperienceCard components */}
      {visibleExperiences.map((experience) => (
        <ExperienceCard key={experience.id} />
      ))}
    </section>
  );
};

export default Experiences;
