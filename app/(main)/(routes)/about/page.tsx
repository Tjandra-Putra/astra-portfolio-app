import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  return (
    <div className="">
      <div className="flex items-center gap-2 mb-7">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="font-medium text-gray-800 text-lg">About</div>
      </div>
      <div className="flex flex-row flex-wrap gap-2 justify">
        <Badge variant={"navy"} className="text-3xl">
          👋
        </Badge>
        <Badge variant={"cheese"} className="text-xl  font-normal">
          Hello
        </Badge>
        <Badge variant={"ocean"} className="text-xl  font-normal">
          Hola
        </Badge>
        <Badge variant={"diamond"} className="text-xl  font-normal">
          Bonjour
        </Badge>
        <Badge variant={"strawberry"} className="text-xl  font-normal">
          Ciao
        </Badge>
        <Badge variant={"secondary"} className="text-xl  font-normal">
          你好
        </Badge>
      </div>
      <div className="text-gray-800 text-lg leading-8 my-7">
        My name is Tjandra and I am a student at Singapore Management University studying Information Systems. I'm
        passionate in learning new technologies and software development. I'm also interested in UI/UX design and
        product management.
      </div>
      <div className="avatar-border border-4 border-[#000000] p-3 rounded-lg my-4">
        <img src="https://github.com/shadcn.png" alt="profile-img" className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
};

export default AboutPage;
