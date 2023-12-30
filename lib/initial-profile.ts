import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  // Check if user already has a profile
  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  // If user already has a profile, return it
  if (profile) {
    return profile;
  }

  // Create a new profile
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      domain: user.id,
    },
  });

  return newProfile;
};
