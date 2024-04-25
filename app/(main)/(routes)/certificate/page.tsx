"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { faChevronRight, faCircle, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const CertificatePage = () => {
  return (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Licenses and Certificates</div>
      </div>

      <div className="text-gray-800 mb-6 font-normal">
        Here are some of the licenses and certificates that I have acquired over the years.
      </div>

      <div className="bg-ash sm:px-6 sm:py-[0.1rem] py-[0.1rem] px-3 rounded-lg">
        <div className="certificate-container bg-white rounded-lg sm:p-6 p-3 sm:my-6 my-3">
          <div className="header grid sm:grid-cols-[3fr,9fr] grid-cols-[3fr,9fr] gap-4 items-center">
            <div>
              <img
                src="https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
                alt="AWS"
                className="sm:w-[100px] sm:h-[100px] w-[70px] h-[70px] object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <div className="certification-title font-semibold text-xs sm:text-base leading-4">
                Microsoft Azure Fundamentals (AZ-900)
              </div>
              <div className="certification-title text-gray-600 font-medium text-xs sm:text-base sm:mt-0 mt-1">
                Microsoft
              </div>
              <div className="certification-title text-gray-500 font-normal text-xs sm:text-base">Issued Jul 2023</div>
            </div>
          </div>

          <Separator className="sm:mt-6 mt-3" />

          <img
            src="https://miro.medium.com/v2/resize:fit:1128/1*EWttqrihTanNGjRlorbpZg.png"
            alt="certificate"
            className="w-full sm:mt-6 mt-3 shadow-paper rounded-lg"
          />

          <Link href="/certificate/1" target="_blank">
            <Button variant={"navy"} size={"sm"} className="w-full sm:mt-6 mt-3">
              View Certificate <FontAwesomeIcon icon={faLink} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="certificate-container bg-white rounded-lg sm:p-6 p-3 sm:my-6 my-3">
          <div className="header grid sm:grid-cols-[3fr,9fr] grid-cols-[3fr,9fr] gap-4 items-center">
            <div>
              <img
                src="https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
                alt="AWS"
                className="sm:w-[100px] sm:h-[100px] w-[70px] h-[70px] object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <div className="certification-title font-semibold text-xs sm:text-base leading-4">
                Microsoft Azure Fundamentals (AZ-900)
              </div>
              <div className="certification-title text-gray-600 font-medium text-xs sm:text-base sm:mt-0 mt-1">
                Microsoft
              </div>
              <div className="certification-title text-gray-500 font-normal text-xs sm:text-base">Issued Jul 2023</div>
            </div>
          </div>

          <Separator className="sm:mt-6 mt-3" />

          <img
            src="https://miro.medium.com/v2/resize:fit:1128/1*EWttqrihTanNGjRlorbpZg.png"
            alt="certificate"
            className="w-full sm:mt-6 mt-3 shadow-paper rounded-lg"
          />

          <Button variant={"navy"} size={"sm"} className="w-full sm:mt-6 mt-3">
            View Certificate <FontAwesomeIcon icon={faLink} className="ml-2" />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CertificatePage;
