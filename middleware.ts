// clerk authentication middleware

import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { currentProfile } from "./lib/current-profile";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    // nextjs routes
    "/",
    "/about",
    "/projects",
    "/projects/(.*)",
    "/experiences",
    "/contact",
    "/profile/(.*)",

    // api routes
    "/api/uploadthing",
    "/api/profile/(.*)",
    "/api/projects/(.*)",
    "/api/project/(.*)",

    // error pages
    "/404",
    "/unverified",
  ],

  afterAuth(auth, req, evt) {
    console.log("afterAuth: ", auth);

    console.log("========================");
    const profile = currentProfile();
    console.log(profile);
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
