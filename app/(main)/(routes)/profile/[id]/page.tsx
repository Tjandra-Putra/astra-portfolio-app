"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSeedling, faRocket } from "@fortawesome/free-solid-svg-icons";
import { faFile, faCopy } from "@fortawesome/free-regular-svg-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Projects from "@/components/projects";
import Experiences from "@/components/experiences";
import Loader from "@/components/layout/loader";
import CopyToClipboard from "react-copy-to-clipboard";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { setUserInfo } from "@/app/redux/features/user-slice";
import { useDispatch } from "react-redux";

// default route for the app "https://localhost:3000/"
export default function Profile() {
  const params = useParams();
  const id = params.id;

  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  // redux
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/profile/${id}`);
      setProfile(response.data);

      // redux
      dispatch(
        setUserInfo({
          id: id,
          role: response.data.role,
          name: response.data.name,
          domain: response.data.domain,
          email: response.data.email,
          workEmail: response.data.workEmail,
        })
      );
    } catch (error: any) {
      console.error("Error fetching data:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  return (
    <>
      <section className="introduction pb-5">
        <div className="flex justify-between mb-5">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
            <div className="job-title font-medium text-gray-800">
              {profile?.jobTitle ? profile.jobTitle : "Self Employed"}
            </div>
          </div>
          <div className="status uppercase tracking-wider text-end">
            <Badge variant={"diamond"} className="font-semibold">
              <FontAwesomeIcon
                // icon={faSeedling}
                icon={faRocket}
                className="sm:me-2" // Hide on screens larger than sm (small)
                color="#183153"
              />

              <span className="hidden sm:block">Available for Hire</span>
            </Badge>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-12 gap-6 mb-5 text-center sm:text-left">
            <div className="md:col-span-8 sm:order-first order-last">
              <div className="w-full">
                <div className="name text-4xl font-medium">
                  Hi, I&apos;m{" "}
                  <span className="text-primary">{profile?.name ? profile.name.split(" ")[0] : "..."}</span>
                </div>
                <div className="description mt-3 text-gray-900 font-normal">
                  {profile?.bio
                    ? profile.bio
                    : "Welcome to my creative space! I thrive on turning ideas into reality and bringing concepts to life."}
                </div>
                <div className="buttons mt-5 space-x-3">
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
              </div>
            </div>
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="w-36 sm:w-full">
                <div className="avatar-border border-4 border-[#1c3454] p-2 rounded-full">
                  <Avatar>
                    {profile?.imageUrl ? (
                      <AvatarImage src={profile.imageUrl} className="object-cover" />
                    ) : (
                      <AvatarImage src="https://github.com/shadcn.png" className="object-cover" />
                    )}
                    <AvatarFallback>{profile?.name}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Projects showAll={false} />

      <Experiences />
    </>
  );
}
