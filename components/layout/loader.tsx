import React from "react";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  const existingClasses = "glass pad-lg my-6 w-full";
  const mergedClasses = className ? `${existingClasses} ${className}` : existingClasses;

  return (
    <div className={mergedClasses} role="status" aria-live="polite">
      <span className="tt-mono inline-flex items-center gap-2">
        <span className="pin" /> Loading
      </span>

      <div className="mt-5 grid gap-2.5" aria-hidden="true">
        <div className="glass-lite shimmer h-9 w-2/3 rounded-tile" />
        <div className="glass-lite shimmer h-4 w-1/2 rounded-xs" />
      </div>

      <hr className="rule my-6" />

      <div className="grid gap-2" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-lite shimmer h-[68px] rounded-tile" />
        ))}
      </div>
    </div>
  );
};

export default Loader;
