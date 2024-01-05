import BarLoader from "react-spinners/BarLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
  return (
    <div className="projects bg-ash p-6 my-6 rounded-lg w-full text-center flex justify-center items-center">
      {/* <p>Loading...</p> */}
      <BarLoader loading={true} color="#1d3455" />
    </div>
  );
};

export default Loader;
