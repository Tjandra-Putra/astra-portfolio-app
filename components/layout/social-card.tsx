"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { Button } from "../ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const SocialCard = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  // dynamic import of fontawesome icons
  const iconList: IconDefinition[] = Object.keys(SolidIcons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => (SolidIcons as any)[icon]);

  const brandList: IconDefinition[] = Object.keys(BrandIcons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => (BrandIcons as any)[icon]);

  library.add(...iconList, ...brandList);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/${userInfo.id}`);

      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchProfile();
    }
  }, [userInfo]);

  return (
    <div className="bg-ocean rounded-lg mt-4 p-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2 sm:mb-0 mb-2">
        {loading ? <Skeleton className="w-4 h-4 rounded-full" /> : <FontAwesomeIcon icon="circle" className="w-2 h-2" color="#ffffff" />}
        {loading ? <Skeleton className="h-6 w-24 rounded-md" /> : <div className="job-title font-medium text-white text-lg">Follow Me</div>}
      </div>

      <div className="socials flex gap-3 lg:mt-0">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={`social-skeleton-${i}`} className="rounded-full w-11 h-11" />)
          : profile?.socialLinks?.map((social: any) => {
              if (social.iconName !== "" && social.iconType !== "") {
                return (
                  <TooltipProvider delayDuration={100} key={social.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={social.url} target="_blank" rel="noopener noreferrer" key={social.id}>
                          <Button variant={"white"} className="font-semibold rounded-full w-11 h-11">
                            <FontAwesomeIcon icon={[social.iconType, social.iconName]} color="#000000" className="text-lg" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{social?.iconName.split("-")[1].charAt(0).toUpperCase() + social?.iconName.split("-")[1].slice(1)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
            })}
      </div>
    </div>
  );
};

export default SocialCard;
