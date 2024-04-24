import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  // Check if user already has a profile
  const profile = await db.profile.findFirst({
    where: { email: user.emailAddresses[0].emailAddress },
  });

  // check profile userId has login_pending_user in login_pending_user@d1e8v8
  if (profile && profile.userId.includes("login_pending_user")) {
    // update userId with user.id

    await db.profile.update({
      where: { id: profile.id },
      data: { userId: user.id },
    });
  }

  // If user already has a profile, return it
  if (profile) {
    return profile;
  }
};
