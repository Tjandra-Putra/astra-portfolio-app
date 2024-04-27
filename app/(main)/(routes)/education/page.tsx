"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { faCircle, faDiamond, faGem, faGraduationCap, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <div className="bg-ash sm:px-6 sm:py-[0.1rem] py-[0.1rem] px-3 rounded-lg">
        <div className="certificate-container bg-white rounded-lg sm:p-6 p-3 sm:my-6 my-3">
          <div className="header grid sm:grid-cols-[3fr,9fr] grid-cols-[3fr,9fr] gap-4 items-center">
            <div>
              <div className="sm:w-[100px] sm:h-[100px] w-[70px] h-[70px] object-cover rounded-lg bg-navy flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white w-10 h-10" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="education font-semibold text-xs sm:text-base leading-4">
                Singapore Management University
              </div>
              <div className="degree text-gray-600 font-medium text-xs sm:text-base sm:mt-0 mt-1">
                Bachelor of Science, <span className="field-of-study">Information Systems</span>
              </div>
              <div className="duration text-gray-500 font-normal text-xs sm:text-base">Aug 2021 - Aug 2024</div>
              <div className="duration text-gray-500 font-normal text-xs sm:text-base">Grade: 3.74/4.00</div>
            </div>
          </div>

          <Separator className="sm:mt-6 mt-3" />

          <div className="education font-normal text-xs sm:text-base sm:mt-3 mt-3 leading-5">
            I aim to utilize my GIS skills and design to creating a convenient, safe, and nurturing environment for
            people of all ages to live in. Whether it is enhancing the sustainability of quality of life, improving the
            environment, or mitigating the impact of natural disasters, I want to assist people including myself in
            achieving greater comfort and well-being.
          </div>

          <div className="badges flex flex-row flex-wrap sm:gap-3 gap-2 sm:mt-6 mt-3">
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              <FontAwesomeIcon icon={faGem} className="w-3 h-3 mr-2" color="#ffffff" />
              GIS
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Design
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Sustainability
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Quality of Life
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Environment
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Natural Disasters
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Comfort
            </Badge>
            <Badge variant="ocean" className="text-xs sm:text-normal font-medium">
              Well-being
            </Badge>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EducationPage;
