import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { currentProfile } from "@/lib/current-profile";
import { initialProfile } from "@/lib/initial-profile";
import Image from "next/image";
import React from "react";

// This is the layout for the management page
// It is for user to manage the content of the website
const ManagementLayout = ({ children }: { children: any }) => {
  const profile = initialProfile();
  const currentUser = currentProfile();

  const unverifiedComponent = (
    <div
      id="oopss"
      className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen text-center flex items-center flex-col p-6 absolute top-0 right-0 bottom-0 left-0  z-50"
    >
      <Image src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404" width={400} height={400} />
      <div className="flex flex-col gap-8">
        <span className="sm:text-3xl text-2xl font-bold">You are not authorized to access this page</span>
        {/* <p className="text-xl">The page you were looking for could not be found</p> */}
        <Button variant="white">Please wait for the admin to verify your account</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4 bg-ash min-h-screen h-full">
      <div className="w-full sm:w-[570px]">
        {/* static content */}
        <Navbar />

        <div className="min-h-[85vh] h-full shadow-paper bg-white rounded-xl p-6 mt-4 pb-[0.1rem]">
          {/* dynamic content */}

          {/* for users that are not verified by ADMIN */}
          {currentUser.then((user) => {
            if (user?.role === "GUEST") {
              console.log("You are not authorized to access this page");

              return unverifiedComponent;
            }
          })}

          {/* only users with role other than GUEST can access this page */}
          {currentUser.then((user) => {
            if (user?.role !== "GUEST") {
              return children;
            }
          })}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ManagementLayout;
