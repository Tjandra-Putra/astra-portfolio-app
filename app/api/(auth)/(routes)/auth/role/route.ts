import { NextRequest, NextResponse } from "next/server";
import { initialProfile } from "@/lib/initial-profile";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

// check if user's role is GUEST or MEMBER
export async function POST(req: NextRequest) {
  const user = await currentUser();

  const { dbId, dbRole } = await req.json();

  if (user) {
    clerkClient.users.updateUserMetadata(dbId, {
      publicMetadata: {
        role: dbRole,
      },
    });
  }

  return NextResponse.json({
    message: "User role updated successfully to " + dbRole,
  });
}
