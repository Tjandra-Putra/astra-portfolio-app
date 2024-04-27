"use client";

import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { faAward, faCertificate, faChevronRight, faCircle, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import axios from "axios";
import Loader from "@/components/layout/loader";
import { useSelector } from "react-redux";

const CertificatePage = () => {
  const [certificates, setCertificates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/certificate/${userInfo.id}`);
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Licenses and Certificates</div>
      </div>

      <div className="text-gray-800 mb-6 font-normal">
        Here are some of the licenses and certificates that I have acquired over the years.
      </div>

      <div className="bg-ash sm:px-6 sm:py-[0.1rem] py-[0.1rem] px-3 rounded-lg">
        {certificates?.map((certificate) => (
          <div className="certificate-container bg-white rounded-lg sm:p-6 p-3 sm:my-6 my-3" key={certificate.id}>
            <div className="header grid sm:grid-cols-[3fr,9fr] grid-cols-[3fr,9fr] gap-4 items-center">
              <div>
                <div className="sm:w-[100px] sm:h-[100px] w-[70px] h-[70px] object-cover rounded-lg bg-navy flex items-center justify-center">
                  <FontAwesomeIcon icon={faAward} className="text-white w-10 h-10" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="certification-title font-semibold text-xs sm:text-base leading-4">
                  {certificate.title}
                </div>
                <div className="issuer text-gray-600 font-medium text-xs sm:text-base sm:mt-0 mt-1">Microsoft</div>
                <div className="duration text-gray-500 font-normal text-xs sm:text-base">Issued Jul 2023</div>
              </div>
            </div>

            <Separator className="sm:mt-6 mt-3" />

            <img
              src={certificate.certificateImageUrl}
              alt="certificate"
              className="w-full sm:mt-6 mt-3 shadow-paper rounded-lg"
            />

            <div className="certificate-id flex justify-end">
              <Badge variant={"sky"} className="text-xs text-gray-900 font-medium sm:mt-6 mt-3 text-end">
                Certificate ID: {certificate.certificateId}
              </Badge>
            </div>

            <Link href={certificate.certificateUrl} target="_blank">
              <Button variant={"navy"} className="w-full sm:mt-6 mt-3 font-medium">
                View Certificate <FontAwesomeIcon icon={faLink} className="ml-2" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default CertificatePage;
