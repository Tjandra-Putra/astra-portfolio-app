import React from "react";
import BarLoader from "react-spinners/BarLoader";
import PulseLoader from "react-spinners/PulseLoader";
import { useTheme } from "next-themes";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  const { resolvedTheme } = useTheme();
  const loaderColor = resolvedTheme === "dark" ? "#ffffff" : "#1d3455"; // white in dark mode, navy in light mode

  // Define the existing classes
  const existingClasses =
    "projects bg-ash p-6 my-6 rounded-lg w-full text-center flex justify-center items-center dark:bg-black/50 dark:backdrop-blur-md dark:border dark:border-white/10";

  // Merge the existing classes with the provided className, if any
  const mergedClasses = className ? `${existingClasses} ${className}` : existingClasses;

  return (
    <div className={mergedClasses}>
      <BarLoader loading={true} color={loaderColor} />
      {/* <PulseLoader loading={true} color={loaderColor} size={5} /> */}
    </div>
  );
};

export default Loader;
