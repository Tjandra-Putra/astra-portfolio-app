// clerk authentication middleware

import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    // nextjs routes
    "/",
    "/home",
    "/about",
    "/projects",
    "/projects/(.*)",
    "/experiences",
    "/contact",
    "/certificate",
    "/education",
    "/profile/(.*)",

    // api routes
    "/api/uploadthing",
    "/api/profile",
    "/api/profile/(.*)",
    "/api/projects/(.*)",
    "/api/project/(.*)",
    "/api/certificate/(.*)",
    "/api/education/(.*)",

    // error pages
    "/404",
    "/unverified",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
