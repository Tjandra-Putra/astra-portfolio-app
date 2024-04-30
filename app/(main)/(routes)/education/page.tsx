"use client";

import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { faCircle, faDiamond, faGem, faGraduationCap, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "@/components/layout/loader";

const EducationPage = () => {
  const [educations, setEducations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchEducations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/education/${userInfo.id}`);

      // show only visible certificates and sort in latest order
      const visibleEducations = response.data.filter((education: any) => education.visible);
      visibleEducations.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      setEducations(visibleEducations);
    } catch (error) {
      console.error("Error fetching educations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Education</div>
      </div>

      <div className="text-gray-800 mb-7 font-normal">
        Here are some of the educational qualifications that I have acquired over the years.
      </div>

      <div className="bg-ash sm:px-6 sm:py-[0.1rem] py-[0.1rem] px-3 rounded-lg">
        {educations && educations.length > 0 ? (
          educations?.map((education) => (
            <div className="certificate-container bg-white rounded-lg sm:p-6 p-3 sm:my-6 my-3" key={education.id}>
              <div className="header grid sm:grid-cols-[3fr,9fr] grid-cols-[3fr,9fr] gap-4 items-center">
                <div>
                  <div className="sm:w-[100px] sm:h-[100px] w-[70px] h-[70px] object-cover rounded-lg bg-navy flex items-center justify-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-white w-10 h-10" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="education font-semibold text-xs sm:text-base leading-4">{education.schoolName}</div>
                  <div className="degree text-gray-600 font-medium text-xs sm:text-base sm:mt-0 mt-1">
                    {education.degree}, <span className="field-of-study">{education.fieldOfStudy}</span>
                  </div>
                  <div className="duration text-gray-500 font-normal text-xs sm:text-base">
                    {new Date(education.startDate).toLocaleDateString("en-SG")} -{" "}
                    {education.endDate ? new Date(education.endDate).toLocaleDateString("en-SG") : "Current"}
                  </div>
                  {education.grade && (
                    <div className="duration text-gray-900 font-normal text-xs sm:text-base">
                      Grade: {education.grade}
                    </div>
                  )}
                </div>
              </div>

              {education?.description || (education?.skills && <Separator className="sm:mt-6 mt-3" />)}

              {education?.description && (
                <div
                  className="education font-normal text-xs sm:text-base sm:mt-3 mt-3 leading-5 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: education.description }}
                />
              )}

              {education?.skills && (
                <div className="badges flex flex-row flex-wrap sm:gap-3 gap-2 sm:mt-6 mt-3">
                  {education.skills?.split(",").map((skill: any) => (
                    <Badge key={education.id} variant="secondary" className="text-xs sm:text-xs font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="certificates bg-ash md:p-6 p-3 rounded-lg">No educations available.</div>
        )}
      </div>
    </React.Fragment>
  );
};

export default EducationPage;
