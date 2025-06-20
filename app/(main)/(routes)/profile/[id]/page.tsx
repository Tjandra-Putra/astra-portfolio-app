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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import confetti from "canvas-confetti"; // Import canvas-confetti
import { Skeleton } from "@/components/ui/skeleton";

// default route for the app "https://localhost:3000/"
export default function Profile() {
  const params = useParams();
  const id = params.id;

  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const defaultProfileImage = "https://vutz38vdur.ufs.sh/f/O8iVoUnKSnAlP7J3LDxbvrzVStD23fJj4xZMB9eRcLgWuknX";

  // redux
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/${id}`);

      if (!response?.data?.id) {
        throw new Error("Invalid profile data: missing user ID");
      }

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
      console.error("Error fetching data:", error?.response || error.message);
      toast.error("Unable to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile().then(() => {
        // Automatically trigger confetti for demonstration
        triggerConfetti();
      });
    }
  }, [id]);

  const triggerConfetti = () => {
    var end = Date.now() + 1 * 300;
    // go Buckeyes!
    // var colors = ["#bb0000", "#ffffff"];
    var colors = ["#38251e", "#f3b74d", "#e47a54", "#a4422c"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        colors: colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
    // confetti({
    //   particleCount: 400,
    //   spread: 150,
    //   origin: { y: 0.3 },
    // });
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 },
    //   colors: colors,
    // });
  };

  const stopConfetti = () => {
    confetti.reset();
  };

  return (
    <>
      <section className="introduction sm:pb-6 pb-3">
        <div className="flex justify-between mb-5">
          <div className="flex items-center gap-2 mb-4">
            {loading ? (
              <Skeleton className="h-[26px] w-[100px] rounded-full mx-auto" />
            ) : (
              <>
                <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#9b9ca5] dark:text-sky" />
                <div className="job-title font-medium text-gray-800 dark:text-sky">{profile?.jobTitle ? profile.jobTitle : "Self Employed"}</div>
              </>
            )}
          </div>
          <Link href={process.env.NODE_ENV === "production" ? "https://astra-portfolio.vercel.app" : "/"}>
            <div className="status uppercase tracking-wider text-end">
              <Badge variant={"diamond"} className="font-semibold">
                <FontAwesomeIcon
                  // icon={faSeedling}
                  icon={faRocket}
                  className="sm:me-2" // Hide on screens larger than sm (small)
                  color="#183153"
                />
                <Tippy content={"Redirect to Home"} placement="bottom">
                  <span className="hidden sm:block">
                    {/* Available for Hire */}
                    Astra Portfolio
                  </span>
                </Tippy>
              </Badge>
            </div>
          </Link>
        </div>

        {
          <div className="grid md:grid-cols-12 gap-6 sm:mb-0 mb-4 text-center sm:text-left">
            <div className="md:col-span-8 sm:order-first order-last">
              <div className="w-full">
                {loading ? (
                  <div>
                    <Skeleton className="h-8 max-w-52 rounded-full mx-auto sm:mx-0" />
                  </div>
                ) : (
                  <div className="name sm:text-4xl text-2xl font-medium dark:text-zinc-200">
                    Hi, I&apos;m <span className="text-primary">{profile?.name ? profile.name.split(" ")[0] : "..."}</span>
                  </div>
                )}
                {loading ? (
                  <div className="flex flex-col items-center sm:items-start justify-start">
                    <Skeleton className="h-4 w-64 rounded-lg sm:text-base text-base mt-3 dark:text-zinc-300" />
                    <Skeleton className="h-4 w-72 rounded-lg sm:text-base text-base mt-3 dark:text-zinc-300" />
                    <Skeleton className="h-4 w-80 rounded-lg sm:text-base text-base mt-3 dark:text-zinc-300" />
                    <Skeleton className="h-4 w-72 rounded-lg sm:text-base text-base mt-3 dark:text-zinc-300" />
                    <Skeleton className="h-4 w-64 rounded-lg sm:text-base text-base mt-3 dark:text-zinc-300" />
                  </div>
                ) : (
                  <div className="description mt-3 text-gray-900 font-normal sm:text-base text-base dark:text-zinc-300">
                    {profile?.bio
                      ? profile.bio
                      : "Welcome to my creative space! I thrive on turning ideas into reality and bringing concepts to life."}
                  </div>
                )}
                <div className="buttons mt-6 space-x-3">
                  {loading ? (
                    <>
                      <Skeleton className="inline-block w-28 h-10 rounded-md" />
                      <Skeleton className="inline-block w-28 h-10 rounded-md" />
                    </>
                  ) : (
                    <>
                      {profile?.resumeUrl ? (
                        <Link href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
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
                        <CopyToClipboard
                          text={profile?.workEmail}
                          onCopy={() => {
                            toast.success("Copied to clipboard!");
                          }}
                        >
                          <Button variant={"secondary"}>
                            <FontAwesomeIcon icon={faCopy} className="me-2 dark:text-white" color="#000000" />
                            Copy Email
                          </Button>
                        </CopyToClipboard>
                      ) : (
                        <CopyToClipboard text={profile?.email} onCopy={() => {}}>
                          <Button variant={"secondary"}>
                            <FontAwesomeIcon icon={faCopy} className="me-2 dark:text-white" color="#000000" />
                            Copy Email
                          </Button>
                        </CopyToClipboard>
                      )}
                    </>
                  )}
                </div>

                <div className="text-sm mt-6 text-blue-500 dark:text-zinc-400">
                  {loading ? (
                    <div className="flex items-center justify-center sm:justify-start">
                      <Skeleton className="h-4 w-52 rounded-lg sm:text-base text-base dark:text-zinc-300" />
                    </div>
                  ) : (
                    `Last updated on: ${new Date(profile?.updatedAt).toLocaleDateString("en-SG")}`
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="w-36 h-36">
                {loading ? (
                  <Skeleton className="w-full h-full rounded-full" />
                ) : (
                  <div className="border-4 border-navy dark:border-zinc-300 p-2 rounded-full w-full h-full">
                    <Avatar className="w-full h-full rounded-full overflow-hidden">
                      <AvatarImage src={profile?.imageUrl || defaultProfileImage} alt={profile?.name} className="object-cover w-full h-full" />
                      <AvatarFallback>{profile?.name}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      </section>

      <Experiences />
      <Projects />
    </>
  );
}
