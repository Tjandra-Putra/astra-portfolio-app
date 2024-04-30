import Navbar from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faArrowRight, faCircle, faRocket, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center p-3 bg-ash min-h-screen h-full">
      <div className="w-full sm:w-[570px]">
        <div className="min-h-[100vh] h-full shadow-paper bg-white rounded-xl sm:p-6 p-3">
          <Badge variant="sky" className="text-base flex justify-center w-full rounded-lg sm:mb-6 mb-3 h-10 p-6">
            <FontAwesomeIcon icon={faRocket} className="w-4 h-4 me-2" color="#183153" />
            Astra Portfolio
          </Badge>

          <div className="bg-ash shadow-paper sm:p-6 p-3 sm:mb-6 mb-3 rounded-lg">
            <div className="flex flex-col justify-center">
              <div className="sm:text-3xl text-xl text-center font-semibold text-[#1d3554]">
                Discover inspiration and connect with exception <span className="text-[#fab306]">talent.</span>
              </div>

              <div className="sm:text-base text-sm text-center text-[#1d3554] sm:mt-6 mt-3 sm:mb-8 mb-5">
                <span className="font-semibold">Astra Portfolio</span> offers a platform to showcase your projects,
                experiences, and skills, enabling connections with like-minded individuals and sharing your journey
                globally.
              </div>

              <div className="flex flex-col gap-4">
                <Input placeholder="Search for individuals" className="w-full h-[6.5vh] rounded-full text-center" />
                <Button variant="navy" className="w-full rounded-full" size="lg">
                  <FontAwesomeIcon icon={faSearch} className="w-4 h-4 me-2" color="#ffffff" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-ash shadow-paper sm:p-6 p-3 rounded-lg">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#1d3554]" />
                <div className="font-medium text-gray-800 sm:text-lg text-base">Individuals</div>
              </div>
            </div>

            <div className="individual-container rounded-lg bg-white sm:p-6 p-6 sm:mt-6 mt-3">
              <div className="flex sm:flex-row flex-col justify-between items-center sm:text-start text-center">
                <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-base text-[#1d3554]">John Doe</div>
                    <div className="text-base text-[#9b9ca5]">Software Engineer</div>
                  </div>
                </div>
                <Button variant={"navy"} className="sm:mt-0 mt-3">
                  View Profile
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ms-2" />
                </Button>
              </div>
            </div>

            <div className="individual-container rounded-lg bg-white sm:p-6 p-6 sm:mt-6 mt-3">
              <div className="flex sm:flex-row flex-col justify-between items-center sm:text-start text-center">
                <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-base text-[#1d3554]">John Doe</div>
                    <div className="text-base text-[#9b9ca5]">Software Engineer</div>
                  </div>
                </div>
                <Button variant={"navy"} className="sm:mt-0 mt-3">
                  View Profile
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ms-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
