import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// get project by id for this user profile
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await db.project.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// update project by id for this user profile
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  console.log("======================= PUT ====================", context.params.id);

  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the existing project
    const existingProject = await db.project.findFirst({
      where: {
        id: context.params.id,
        profileId: profile.id,
      },
    });

    if (!existingProject) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Extract the updated project data from the request body
    const updatedProjectData = await req.json();

    console.log(updatedProjectData.content);

    // Update the project with the new data
    const updatedProject = await db.project.update({
      where: {
        id: existingProject.id,
      },
      data: {
        thumbnailUrl: updatedProjectData.thumbnailUrl,
        name: updatedProjectData.name,
        category: updatedProjectData.category,
        description: updatedProjectData.description,
        company: updatedProjectData.company,
        startDate: updatedProjectData.startDate,
        endDate: updatedProjectData.endDate,
        visible: updatedProjectData.visible,
        isWorkExperience: updatedProjectData.isWorkExperience,
        workExperienceTitle: updatedProjectData.workExperienceTitle,
        projectUrl: updatedProjectData.projectUrl,
        githubUrl: updatedProjectData.githubUrl,
        tags: updatedProjectData.tags,
        content: updatedProjectData.content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("[PROJECTS_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
