import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExperienceCardSkeleton: React.FC = () => {
  return (
    <div className="min-h-28 bg-white rounded-lg md:mt-5 mt-3 p-3 flex items-center justify-between ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:ring-[3px] hover:ring-[#74c0fc] dark:bg-[#171717] dark:border">
      <div className="flex items-center gap-4">
        <div className="avatar-border border-2 border-navy p-2 rounded-full dark:border-zinc-300">
          <Skeleton className="sm:h-14 sm:w-14 h-10 w-10 rounded-full" />
        </div>

        <div className="flex flex-col flex-grow">
          <Skeleton className="w-48 h-5 rounded mb-1" />
          <div className="flex flex-wrap gap-2 mt-1">
            <Skeleton className="w-16 h-5 rounded" />
            <Skeleton className="w-24 h-5 rounded" />
            <Skeleton className="w-24 h-5 rounded" />
          </div>
        </div>
      </div>

      <Skeleton className="w-6 h-6 rounded" />
    </div>
  );
};

export default ExperienceCardSkeleton;
