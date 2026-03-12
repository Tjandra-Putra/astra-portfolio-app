import BottomGroup from "@/components/layout/bottom-group";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import React from "react";

// This is the layout for the management page
// It is for user to manage the content of the website
const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-ash min-h-screen h-full dark:bg-[#0c0c0c] dark:border dark:border-white/10">
      <div className="w-full sm:w-[570px]">
        {/* static content */}
        <Navbar />

        <div className="min-h-[85vh] h-full shadow-paper bg-white rounded-xl p-6 mt-4 pb-[0.1rem] dark:bg-[#171717] dark:border dark:border-[#333335]">
          {/* dynamic content */}
          {children}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ManagementLayout;
