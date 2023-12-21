import Navbar from "@/components/navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-[#f0f1f3] min-h-screen h-full">
      <div className="w-full sm:w-[550px]">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
