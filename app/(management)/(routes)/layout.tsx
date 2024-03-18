"use client";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// This is the layout for the management page
// It is for user to manage the content of the website
const ManagementLayout = ({ children }: { children: any }) => {
  const router = useRouter();

  useEffect(() => {
    // check if user is verified base on the role of the user (GUEST or MEMBER)
    axios.get("/api/auth/role").then((res) => {
      console.log(res);

      if (!res.data.isVerified) {
        // redirect to unverified page
        router.push("/unverified");
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-3 bg-ash min-h-screen h-full">
      <div className="w-full sm:w-[570px]">
        {/* static content */}
        <Navbar />

        <div className="min-h-[85vh] h-full shadow-paper bg-white rounded-xl md:p-6 p-3 mt-4 pb-[0.1rem]">
          {/* dynamic content */}
          {children}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ManagementLayout;
