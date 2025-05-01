import BottomGroup from "@/components/layout/bottom-group";
import Navbar from "@/components/layout/navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center p-3 bg-ash min-h-screen h-full dark:bg-[#0D0D0D]">
      <div className="w-full sm:w-[570px]">
        {/* static content */}
        <Navbar />

        <div className="min-h-[85vh] h-full shadow-paper bg-white dark:bg-[#0D0D0D] dark:border dark: border-[#333335] rounded-xl md:p-6 p-3 mt-3 pb-[0.1rem]">
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
