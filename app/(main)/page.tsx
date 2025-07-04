"use client";

import Footer from "@/components/layout/footer";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faArrowRight, faArrowRightToBracket, faCircle, faRocket, faSearch, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/layout/loader";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";

const LandingPage = () => {
  const [search, setSearch] = useState<string>("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const defaultImageUrl = "https://vutz38vdur.ufs.sh/f/O8iVoUnKSnAlP7J3LDxbvrzVStD23fJj4xZMB9eRcLgWuknX";

  const userInfo = useSelector((state: any) => state.userReducer);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    fetchProfiles().then(() => {
      triggerConfetti();
      setTimeout(() => stopConfetti(), 4000);
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filterProfiles = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter((profile) => profile.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filtered.length === 0) {
        toast.error("No profiles found with the given search term.");
      } else {
        toast.success("Profiles found with the given search term.");
      }
      setFilteredProfiles(filtered);
    }
  };

  const handleFormSubmit = () => {
    filterProfiles(search);
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfiles(data);
      setFilteredProfiles(data);
    } catch (error) {
      console.error("[PROFILE_GET_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 400,
      spread: 150,
      origin: { y: 0.3 },
    });
  };

  const stopConfetti = () => {
    confetti.reset();
  };

  return (
    <div className="flex flex-col items-center p-3 bg-ash min-h-screen h-full dark:bg-[#0c0c0c] dark:border dark:border-white/10">
      <div className="w-full sm:w-[570px]">
        <div className="min-h-[100vh] h-full shadow-paper bg-white rounded-xl sm:p-6 p-3 dark:bg-[#171717] dark:border dark: border-[#333335]">
          <Badge variant="sky" className="text-base flex justify-between w-full rounded-lg sm:mb-6 mb-3 h-15 p-6 hover:bg-[#74c0fc]">
            <div>
              <FontAwesomeIcon icon={faRocket} className="w-4 h-4 me-2" color="#183153" />
              Astra Portfolio
            </div>

            <div className="flex justify-end gap-2">
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="secondary" className="rounded-lg">
                    Sign In
                    <FontAwesomeIcon icon={faArrowRightToBracket} className="w-4 h-4 ms-2 dark:text-white" />
                  </Button>
                </Link>
              </SignedOut>

              <ModeToggle />
              <SignedIn>
                <Button
                  variant="navy"
                  className="rounded-lg"
                  onClick={() => {
                    if (userInfo?.id) {
                      router.push(`/manage`);
                    } else {
                      toast.error("User ID not found.");
                    }
                  }}
                >
                  Welcome Back
                  <FontAwesomeIcon icon={faSeedling} className="w-4 h-4 ms-2" color="#ffffff" />
                </Button>
              </SignedIn>
            </div>
          </Badge>

          <div className="shadow-paper sm:p-6 p-3 sm:mb-6 mb-3 rounded-lg">
            <div className="flex flex-col justify-center">
              <div className="sm:text-3xl text-xl text-center font-semibold text-[#1d3554] dark:text-zinc-200">
                Discover inspiration and connect with exceptional <span className="text-[#fab306]">talent.</span>
              </div>

              <div className="sm:text-base text-sm text-center text-[#1d3554] sm:mt-6 mt-3 sm:mb-8 mb-5 dark:text-zinc-300">
                <span className="font-semibold">Astra Portfolio</span> offers a platform to showcase your projects, experiences, and skills, enabling
                connections with like-minded individuals and sharing your journey globally.
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Search for profiles by name"
                  className="w-full h-[45px] rounded-full text-center border-2 border-[#1d3554] text-[#1d3554] dark:border-zinc-300 dark:text-zinc-200"
                  style={{ outline: "none" }}
                  onChange={(e) => handleSearch(e)}
                />

                <Button variant="navy" className="w-full h-[45px] rounded-full" size="lg" onClick={() => handleFormSubmit()}>
                  <FontAwesomeIcon icon={faSearch} className="w-4 h-4 me-2" color="#ffffff" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-ash shadow-paper sm:p-6 p-3 rounded-lg dark:bg-[#0c0c0c] dark:border dark:border-white/10">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-[#1d3554]" />
                <div className="font-medium text-gray-800 sm:text-lg text-base dark:text-zinc-200">Profiles</div>
              </div>
            </div>

            {Array.isArray(filteredProfiles) &&
              filteredProfiles.map((profile) => (
                <div
                  className={`individual-container rounded-lg bg-white sm:p-6 p-6 sm:mt-6 mt-3 dark:bg-[#171717] dark:border dark:border-white"}`}
                  key={profile.id}
                >
                  <div className="flex sm:flex-row flex-col justify-between items-center sm:text-start text-center">
                    <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-3">
                      <div className={`p-2 rounded-full ${loading ? "" : "border-2 border-zinc-300 dark:border-white"}`}>
                        <Avatar>
                          {loading ? (
                            <Skeleton className="w-12 h-12 rounded-full" />
                          ) : (
                            <AvatarImage
                              src={profile.imageUrl || (user && profile.id === user.publicMetadata.userId && user.imageUrl) || defaultImageUrl}
                              alt={profile?.name}
                              className="object-cover w-12 h-12"
                            />
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        {loading ? (
                          <>
                            <Skeleton className="w-32 h-4 mb-2 rounded" />
                            <Skeleton className="w-20 h-3 rounded" />
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-base text-[#1d3554] dark:text-zinc-200">{profile?.name}</div>
                            <div className="text-xs text-gray-500 dark:text-zinc-300">{profile.jobTitle}</div>
                          </>
                        )}
                      </div>
                    </div>

                    {loading ? (
                      <Skeleton className="w-20 h-10 rounded-full" />
                    ) : (
                      <Link href={`/profile/${profile.id}`}>
                        <Button variant={"navy"} className="sm:mt-0 mt-3 rounded-full">
                          View
                          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ms-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
