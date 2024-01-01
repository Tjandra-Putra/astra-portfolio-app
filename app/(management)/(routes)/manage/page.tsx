import React from "react";
import {
  faDiagramProject,
  faCircle,
  faChevronRight,
  faBriefcase,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const ManagePage = () => {
  return (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Manage Platform</div>
      </div>

      <div className="text-gray-800 mb-7 font-normal">
        This page allows you to effortlessly manage your projects, profile, and work experiences. Update, showcase, and
        organize your professional journey with ease.
      </div>

      <div className="bg-ash p-6 rounded-lg">
        <div className=" bg-white rounded-lg my-5 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar-border border-4 border-[#74c0fc] p-2 rounded-full">
              <div className="avatar h-14 w-14 flex items-center justify-center bg-[#183153] text-[#eecd4e] font-bold rounded-full">
                <FontAwesomeIcon icon={faUser} color="#ffffff" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="project-title text-gray-800 font-medium text-lg">My Profile</div>
            </div>
          </div>
          <div className="view-more transition-transform transform hover:translate-x-1">
            <Link href={`/manage/profile`}>
              <FontAwesomeIcon icon={faChevronRight} className="me-2" color="#000000" />
            </Link>
          </div>
        </div>

        <div className=" bg-white rounded-lg my-5 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar-border border-4 border-[#63e6be] p-2 rounded-full">
              <div className="avatar h-14 w-14 flex items-center justify-center bg-[#183153] text-[#eecd4e] font-bold rounded-full">
                <FontAwesomeIcon icon={faDiagramProject} color="#ffffff" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="project-title text-gray-800 font-medium text-lg">My Projects</div>
            </div>
          </div>
          <div className="view-more transition-transform transform hover:translate-x-1">
            <Link href={`/manage/projects`}>
              <FontAwesomeIcon icon={faChevronRight} className="me-2" color="#000000" />
            </Link>
          </div>
        </div>

        <div className=" bg-white rounded-lg my-5 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar-border  border-4 border-[#e599f7] p-2 rounded-full">
              <div className="avatar h-14 w-14 flex items-center justify-center bg-[#183153] text-[#eecd4e] font-bold rounded-full">
                <FontAwesomeIcon icon={faCertificate} color="#ffffff" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="project-title text-gray-800 font-medium text-lg">My Certificates</div>
            </div>
          </div>
          <div className="view-more transition-transform transform hover:translate-x-1">
            <Link href={`/manage/experiences`}>
              <FontAwesomeIcon icon={faChevronRight} className="me-2" color="#000000" />
            </Link>
          </div>
        </div>
        {/* 
        <div className=" bg-white rounded-lg my-5 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar-border  border-4 border-[#ffd43b] p-2 rounded-full">
              <div className="avatar h-14 w-14 flex items-center justify-center bg-[#183153] text-[#eecd4e] font-bold rounded-full">
                <FontAwesomeIcon icon={faBriefcase} color="#ffffff" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="project-title text-gray-800 font-medium text-lg">My Work Experience</div>
            </div>
          </div>
          <div className="view-more transition-transform transform hover:translate-x-1">
            <Link href={`/manage/experiences`}>
              <FontAwesomeIcon icon={faChevronRight} className="me-2" color="#000000" />
            </Link>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};

export default ManagePage;
