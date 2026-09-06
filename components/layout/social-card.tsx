"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import { Link2 } from "lucide-react";

import Link from "next/link";
import { useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";
import { getJSON } from "@/lib/data-client";
import { resolveProfileId } from "@/lib/viewed-profile";

/**
 * Resolve a stored icon ("fa-brands" + "fa-github") to its definition.
 *
 * This used to call `library.add(...)` with EVERY Font Awesome icon — 2,497
 * arguments spread into a global mutation on every render of a component that
 * sits in the footer of every page. That was both a performance drain and a
 * race: icons could be looked up before registration finished, so some links
 * rendered blank until a refresh.
 *
 * Looking the definition up directly touches only the handful of icons a
 * profile actually uses, needs no global registry, and cannot race.
 */
function resolveIcon(iconType?: string, iconName?: string): IconDefinition | null {
  if (!iconType || !iconName) return null;

  // "fa-github" -> "faGithub", "fa-c" -> "faC"
  const key = iconName
    .split("-")
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");

  const pack: Record<string, unknown> = iconType.includes("brand") ? BrandIcons : SolidIcons;
  const def = pack[key];

  // Guard: the module also exports non-icon values (prefix, fas, …).
  return def && typeof def === "object" && "iconName" in (def as object) ? (def as IconDefinition) : null;
}

const SocialCard = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const profileId = resolveProfileId(userInfo?.id);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getJSON<any>(`/api/profile/${profileId}`);
      setProfile(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileId) return;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  // Rows with blank iconType/iconName exist in the data and are not renderable.
  const links = useMemo(
    () =>
      ((profile?.socialLinks || []) as any[])
        .filter((s) => s?.url && s?.iconName && s?.iconType)
        .map((s) => {
          const raw = String(s.iconName).split("-")[1];
          return {
            id: s.id,
            url: s.url,
            label: raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Link",
            icon: resolveIcon(s.iconType, s.iconName),
          };
        }),
    [profile]
  );

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
              <span key={`social-skeleton-${i}`} className="glass-lite shimmer h-10 w-10 rounded-tile" />
            ))
          : links.map((s) => (
              <Link
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="iconbtn"
              >
                {s.icon ? (
                  <FontAwesomeIcon icon={s.icon} className="h-[17px] w-[17px]" />
                ) : (
                  // Unknown icon name — still link out rather than render nothing.
                  <Link2 className="h-[17px] w-[17px]" strokeWidth={1.75} />
                )}
              </Link>
            ))}
      </div>
    </section>
  );
};

export default SocialCard;
