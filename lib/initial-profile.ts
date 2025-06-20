import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export const initialProfile = async () => {
  const user = await currentUser();

  // if (!user) {
  //   return redirectToSignIn();
  // }

  if (user) {
    // Check if user already has a profile
    const profile = await db.profile.findFirst({
      where: { email: user?.emailAddresses[0].emailAddress },
    });

    // check profile userId has login_pending_user in login_pending_user@d1e8v8
    if (profile && profile.userId.includes("login_pending_user")) {
      // update userId with user.id

      await db.profile.update({
        where: { id: profile.id },
        data: { userId: user?.id },
      });
    }

    // Sync Clerk metadata.role if not already set
    const clerkUser = await clerkClient.users.getUser(user.id);
    const currentRole = clerkUser.publicMetadata?.role;

    clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: profile?.role,
      },
    });

    // If user already has a profile, return it
    if (profile) {
      return profile;
    }
  }
};
