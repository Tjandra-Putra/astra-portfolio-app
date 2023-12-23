import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFile, faCopy } from "@fortawesome/free-regular-svg-icons";
import { Button } from "../ui/button";

const Collaborate = () => {
  return (
    <section className="collaborate mt-3 p-6 text-center">
      <div className="title text-xl font-semibold text-gray-700">Let's collaborate on your next project!</div>
      <div className="description mt-3 text-gray-900 font-normal">
        I'm always open to discussing product design work or partnership opportunities.
      </div>

      <div className="buttons flex justify-center mt-5 space-x-3">
        <Button variant={"navy"}>
          <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
          Resume
        </Button>
        <Button variant="secondary">
          <FontAwesomeIcon icon={faCopy} className="me-2" color="#000000" />
          Copy Email
        </Button>
      </div>
    </section>
  );
};

export default Collaborate;
