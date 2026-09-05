"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import Link from "next/link";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getJSON } from "@/lib/data-client";

const SocialCard = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const iconList: IconDefinition[] = Object.keys(SolidIcons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => (SolidIcons as any)[icon]);

  const brandList: IconDefinition[] = Object.keys(BrandIcons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => (BrandIcons as any)[icon]);

  library.add(...iconList, ...brandList);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getJSON<any>(`/api/profile/${userInfo.id}`);
      setProfile(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) fetchProfile();
  }, [userInfo]);

  const links = (profile?.socialLinks || []).filter((s: any) => s?.iconName && s?.iconType);

  if (!loading && links.length === 0) return null;

  return (
    <section className="glass pad reveal mt-3.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="tt-mono">Elsewhere</p>
        <p className="tt-sub mt-1">Find me on the rest of the internet</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <span key={`social-skeleton-${i}`} className="glass-lite shimmer h-11 w-11 rounded-tile" />
            ))
          : links.map((social: any) => {
              const raw = social.iconName.split("-")[1];
              const label = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Link";
              return (
                <Link
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="iconbtn"
                >
                  <FontAwesomeIcon icon={[social.iconType, social.iconName] as any} className="h-[17px] w-[17px]" />
                </Link>
              );
            })}
      </div>
    </section>
  );
};

export default SocialCard;
