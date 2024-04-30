"use client";

import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { faAward, faCertificate, faChevronRight, faCircle, faKey, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import axios from "axios";
import Loader from "@/components/layout/loader";
import { useSelector } from "react-redux";
import Image from "next/image";

const CertificatePage = () => {
  const [certificates, setCertificates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/certificate/${userInfo.id}`);

      // show only visible certificates and sort in latest order
      const visibleCertificates = response.data.filter((certificate: any) => certificate.visible);
      visibleCertificates.sort((a: any, b: any) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime());

      setCertificates(visibleCertificates);
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
        {certificates && certificates.length > 0 ? (
          certificates?.map((certificate) => (
            <div className="certificate-container bg-white rounded-lg sm:p-6 p-3 sm:my-6 my-3" key={certificate.id}>
              <div className="header grid sm:grid-cols-[3fr,9fr] grid-cols-[3fr,9fr] gap-4 items-center">
                <div>
                  <div className="sm:w-[100px] sm:h-[100px] w-[70px] h-[70px] object-cover rounded-lg bg-navy flex items-center justify-center">
                    <FontAwesomeIcon icon={faAward} className="text-white w-10 h-10" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="certification-title font-semibold text-xs sm:text-base">{certificate.title}</div>
                  <div className="issuer text-gray-600 font-medium text-xs sm:text-base sm:mt-0">
                    {certificate.issueingOrganisation}
                  </div>
                  <div className="duration text-gray-500 font-normal text-xs sm:text-base">
                    Issued on {new Date(certificate.issuedDate).toLocaleDateString("en-SG")}
                  </div>
                </div>
              </div>

              <Separator className="sm:mt-6 mt-3" />

              <Image
                src={certificate.certificateImageUrl}
                alt="certificate"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }} // optional
                className="w-full sm:mt-6 mt-3 shadow-paper rounded-lg"
              />

              {certificate.certificateId && (
                <div className="certificate-id flex justify-end">
                  <Badge variant={"secondary"} className="text-xs text-black font-medium sm:mt-6 mt-3 text-end">
                    Credential ID: {certificate.certificateId}
                  </Badge>
                </div>
              )}

              {certificate.certificateUrl && (
                <Link href={certificate.certificateUrl} target="_blank">
                  <Button variant={"ash"} className="w-full sm:mt-6 mt-3 font-medium">
                    View Certificate <FontAwesomeIcon icon={faLink} className="ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="certificates bg-ash md:p-6 p-3 rounded-lg">No certificates available.</div>
        )}
      </div>
    </React.Fragment>
  );
};

export default CertificatePage;
