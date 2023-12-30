// lib/setProfileIdCookie.ts
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

// When user enters the url www.astra/profile/[id] we want to set the profile ID in a cookie
export const setProfileDomain = (profileId: any, res: NextApiResponse) => {
  // Set the profile ID in a cookie in the response
  const cookie = serialize("domain", profileId, {
    path: "/",
    maxAge: 3600, // Set the desired expiration time in seconds
  });

  res.setHeader("Set-Cookie", cookie);
};
