import React from "react";
import BarLoader from "react-spinners/BarLoader";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  // Define the existing classes
  const existingClasses = "projects bg-ash p-6 my-6 rounded-lg w-full text-center flex justify-center items-center";

  // Merge the existing classes with the provided className, if any
  const mergedClasses = className ? `${existingClasses} ${className}` : existingClasses;

  return (
    <div className={mergedClasses}>
      <BarLoader loading={true} color="#1d3455" />
    </div>
  );
};

export default Loader;
