import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {} = await req.json();
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //create profile
    // const server  = await db.server.create({
    //     data: {
    //         pr
    //     }
    // })
  } catch (error) {
    console.log("[PROJECTS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
