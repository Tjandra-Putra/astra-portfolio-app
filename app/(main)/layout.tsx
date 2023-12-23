import BottomGroup from "@/components/layout/bottom-group";
import Navbar from "@/components/layout/navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-ash min-h-screen h-full">
      <div className="w-full sm:w-[570px]">
        {/* static content */}
        <Navbar />

        <div className="h-full shadow-paper bg-white rounded-lg p-6 mt-4 pb-[0.1rem]">
          {/* dynamic content */}
          {children}

          {/* static content */}
          <BottomGroup />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
