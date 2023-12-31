import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {
      thumbnailUrl,
      name,
      category,
      description,
      company,
      startDate,
      endDate,
      visible,
      isWorkExperience,
      workExperienceTitle,
      projectUrl,
      githubUrl,
      tags,
      content,
    } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // create a new project
    const newProject = await db.project.create({
      data: {
        profileId: profile.id,
        thumbnailUrl,
        name,
        category,
        description,
        company,
        startDate,
        endDate,
        visible,
        isWorkExperience,
        workExperienceTitle,
        projectUrl,
        githubUrl,
        tags,
        content,
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("[PROJECTS_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// get all projects for this user profile
export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await db.project.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
