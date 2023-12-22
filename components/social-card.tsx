import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faAt, faC } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const SocialCard = () => {
  return (
    <div className="bg-sky rounded-lg mx-4 mt-4 p-5 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#183153" />
        <div className="job-title font-medium text-gray-800 text-lg">Follow Me</div>
      </div>
      <div className="socials flex gap-3">
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
