import Navbar from "@/components/navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-ash min-h-screen h-full">
      <div className="w-full sm:w-[550px]">
        {/* static content */}
        <Navbar />

        {/* dynamic content */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
