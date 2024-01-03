import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faAt, faC } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const SocialCard = () => {
  return (
    <div className="bg-ocean rounded-lg mt-4 p-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#ffffff" />
        <div className="job-title font-medium text-white text-lg">Follow Me</div>
      </div>
      <div className="socials flex gap-3 lg:mt-0">
        <Link href="https://www.linkedin.com/in/nicholas-yeo-6b1b3b1b2/" target="_blank" rel="noopener noreferrer">
          <Button variant={"white"} className="font-semibold rounded-full w-11 h-11">
            <FontAwesomeIcon icon={faLinkedin} color="#000000" className="text-lg" />
          </Button>
        </Link>
        <Link href="https://www.linkedin.com/in/nicholas-yeo-6b1b3b1b2/" target="_blank" rel="noopener noreferrer">
          <Button variant={"white"} className="font-semibold rounded-full w-11 h-11">
            <FontAwesomeIcon icon={faGithub} color="#000000" className="text-lg" />
          </Button>
        </Link>
        <Link href="https://www.linkedin.com/in/nicholas-yeo-6b1b3b1b2/" target="_blank" rel="noopener noreferrer">
          <Button variant={"white"} className="font-semibold rounded-full w-11 h-11">
            <FontAwesomeIcon icon={faC} color="#000000" className="text-lg" />
          </Button>
        </Link>
        <Link href="https://www.linkedin.com/in/nicholas-yeo-6b1b3b1b2/" target="_blank" rel="noopener noreferrer">
          <Button variant={"white"} className="font-semibold rounded-full w-11 h-11">
            <FontAwesomeIcon icon={faAt} color="#000000" className="text-lg" />
          </Button>
        </Link>
      </div>
      {/* Add more content here if needed */}
    </div>
  );
};

export default SocialCard;
