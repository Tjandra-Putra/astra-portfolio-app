import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
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
    "/api/uploadthing",
    "/api/profile",
    "/api/profile/(.*)",
    "/api/projects/(.*)",
    "/api/project/(.*)",
    "/api/certificate/(.*)",
    "/api/education/(.*)",
    "/404",
    "/unverified",
  ],

  async afterAuth(auth, req) {
    const { pathname } = req.nextUrl;

    // If user is signed in but have no role
    if (pathname.startsWith("/manage")) {
      const role = auth.sessionClaims?.metadata?.role;

      // If not signed in or not an admin, redirect to home
      if (!auth.userId || (role !== "MEMBER" && role !== "ADMIN")) {
        const url = new URL("/unverified", req.url);
        return NextResponse.redirect(url);
      }
    }

    // If user is visiting an /admin route
    if (pathname.startsWith("/admin")) {
      const role = auth.sessionClaims?.metadata?.role;

      // If not signed in or not an admin, redirect to home
      if (!auth.userId || role !== "ADMIN") {
        const url = new URL("/unauthorised", req.url);
        return NextResponse.redirect(url);
      }
    }

    // Allow request to continue normally
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
