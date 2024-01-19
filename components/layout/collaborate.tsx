"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFile, faCopy } from "@fortawesome/free-regular-svg-icons";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "./loader";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";

const Collaborate = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/${userInfo.id}`);
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userInfo.id]);

  return (
    <section className="collaborate my-12 text-center">
      <div className="title text-xl font-semibold text-gray-700">Let&apos;s collaborate on your next project!</div>
      <div className="description mt-3 text-gray-900 font-normal px-6">
        I&apos;m always open to discussing product design work or partnership opportunities.
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="buttons flex justify-center mt-5 space-x-3">
          {profile?.resumeUrl ? (
            <Link href={profile.resumeUrl} target="_blank">
              <Button variant={"navy"}>
                <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
                Resume
              </Button>
            </Link>
          ) : (
            <Button variant={"navy"} disabled>
              <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
              Resume
            </Button>
          )}

          {profile?.workEmail ? (
            // color="#183153"
            <CopyToClipboard
              text={profile?.workEmail}
              onCopy={() => {
                toast.success("Copied to clipboard!");
              }}
            >
              <Button variant={"secondary"}>
                <FontAwesomeIcon icon={faCopy} className="me-2" color="#000000" />
                Copy Email
              </Button>
            </CopyToClipboard>
          ) : (
            <CopyToClipboard text={profile?.email} onCopy={() => {}}>
              <Button variant={"secondary"}>
                <FontAwesomeIcon icon={faCopy} className="me-2" color="#000000" />
                Copy Email
              </Button>
            </CopyToClipboard>
          )}
        </div>
      )}
    </section>
  );
};

export default Collaborate;
