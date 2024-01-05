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
      <div className="flex flex-row flex-wrap gap-2 justify">
        <Badge variant={"navy"} className="text-3xl">
          👋
        </Badge>
        <Badge variant={"cheese"} className="text-xl  font-normal">
          Hello
        </Badge>
        <Badge variant={"ocean"} className="text-xl  font-normal">
          Hola
        </Badge>
        <Badge variant={"diamond"} className="text-xl  font-normal">
          Bonjour
        </Badge>
        <Badge variant={"tomato"} className="text-xl  font-normal">
          Ciao
        </Badge>
        <Badge variant={"secondary"} className="text-xl  font-normal">
          你好
        </Badge>
      </div>

      <div
        className="text-gray-800 my-7 font-normal whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: profile?.about || "" }}
      />

      <div className="avatar-border border-4 border-[#000000] p-3 rounded-lg my-4">
        <img src={profile?.imageUrl} alt={profile?.imageUrl} className="w-full h-full rounded-lg" />
      </div>
    </>
  );
};

export default AboutPage;
