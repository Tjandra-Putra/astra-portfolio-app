// clerk authentication middleware

import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    // nextjs routes
    "/",
    "/about",
    "/projects",
    "/experiences",
    "/contact",
    "/profile/(.*)",

    // api routes
    "/api/uploadthing",
    "/api/profile/(.*)",
    "/api/projects",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
