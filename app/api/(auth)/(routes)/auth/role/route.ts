import { NextRequest, NextResponse } from "next/server";
import { initialProfile } from "@/lib/initial-profile";

// check if user's role is GUEST or MEMBER
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const profile = await initialProfile();
  const role = profile?.role;

  // strangers do not have their profile stored in the db, hence role does not exist
  if (!role || role == "GUEST") {
    // Unauthorized 
    console.log(role);
    return NextResponse.json({ message: "Unauthorized", isVerified: false });
  }

  return NextResponse.json({ message: "Authorized", isVerified: true });
}
