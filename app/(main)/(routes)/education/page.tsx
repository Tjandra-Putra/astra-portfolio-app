"use client";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EducationPage = () => {
  return (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Education</div>
      </div>

      <div className="text-gray-800 mb-7 font-normal">
        Here are some of the educational qualifications that I have acquired over the years.
      </div>

      <div className="bg-ash md:p-6 p-3 rounded-lg">
        <div className=" bg-white rounded-lg md:p-6 p-3 flex items-center justify-between ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:ring-[3px] hover:ring-[#74c0fc] disabled:pointer-events-none disabled:opacity-50">
          <div className="flex items-center gap-4">
            <div className="avatar-border border-4 border-[#74c0fc] p-2 rounded-full">
              <div className="avatar h-14 w-14 flex items-center justify-center bg-[#183153] text-[#eecd4e] font-bold rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="project-title text-gray-800 font-medium text-base">User Profile</div>
            </div>
          </div>
          <div className="view-more transition-transform transform hover:translate-x-1"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EducationPage;
