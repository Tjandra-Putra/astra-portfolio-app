"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faFaceSmile, faSeedling } from "@fortawesome/free-solid-svg-icons";
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
import { useDispatch, useSelector } from "react-redux";

// default route for the app "https://localhost:3000/"
export default function Profile() {
  const params = useParams();
  const id = params.id;

  const userInfo = useSelector((state: any) => state.userReducer);
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

      if (id != userInfo.id) {
        // refresh
        window.location.reload();
      }
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
            <div className="job-title font-medium text-gray-800 text-lg">
              {profile?.jobTitle ? profile.jobTitle : "Self Employed"}
            </div>
          </div>
          <Link href="/contact" className="status uppercase tracking-wider text-end">
            <Badge variant={"diamond"} className="font-semibold">
              <FontAwesomeIcon icon={faSeedling} className="me-2" color="#183153" />
              Available for Hire
            </Badge>
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-12 gap-6 mb-5 text-center sm:text-left">
            <div className="md:col-span-8">
              <div className="w-full">
                <div className="name text-4xl font-medium">
                  Hi, I'm <span className="text-primary">{profile?.name ? profile.name.split(" ")[0] : "..."}</span>
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
                      <Button variant={"navy"}>
                        <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
                        Copy Email
                      </Button>
                    </CopyToClipboard>
                  ) : (
                    <CopyToClipboard text={profile?.email} onCopy={() => {}}>
                      <Button variant={"navy"}>
                        <FontAwesomeIcon icon={faFile} className="me-2" color="#ffffff" />
                        Copy Email
                      </Button>
                    </CopyToClipboard>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex items-center">
              <div className="w-full">
                <div className="avatar-border border-4 border-[#000000] p-2 rounded-full">
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
