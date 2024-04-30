"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/layout/loader";

const AboutPage = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

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

  return !profile ? (
    <Loader />
  ) : (
    <>
      <div className="flex items-center gap-2 mb-7">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="font-medium text-gray-800 text-lg">About</div>
      </div>
      <div className="flex flex-row flex-wrap gap-3 ">
        <Badge variant={"navy"} className="sm:text-xl text-sm">
          👋
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          Hello.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          Hola.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          Bonjour.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          Ciao.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          你好.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          안녕하세요.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          こんにちは.
        </Badge>
        <Badge variant={"navy"} className="sm:text-xl text-sm font-semi-bold">
          Olá.
        </Badge>
      </div>

      <div
        className="text-gray-800 sm:my-6 my-3 font-normal whitespace-pre-line sm:text-base text-sm"
        dangerouslySetInnerHTML={{ __html: profile?.about || "" }}
      />

      {/* avatar-border border-4 border-[#1c3454] p-3  */}
      <div className="rounded-lg my-4">
        <img src={profile?.imageUrl} alt={profile?.imageUrl} className="w-full h-full rounded-lg" />
      </div>
    </>
  );
};

export default AboutPage;
