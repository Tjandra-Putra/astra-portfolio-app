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

  // if (profile) {
  //   // Check if the profile has existing social media links
  //   const existingSocialLinks = await db.userSocialLink.findMany({
  //     where: {
  //       profileId: profile.id,
  //     },
  //   });

  //   if (existingSocialLinks.length === 0) {
  //     //  create 4 social links
  //     const newSocialLinks = [
  //       {
  //         iconName: "",
  //         iconType: "",
  //         url: "",
  //       },
  //       {
  //         iconName: "",
  //         iconType: "",
  //         url: "",
  //       },
  //       {
  //         iconName: "",
  //         iconType: "",
  //         url: "",
  //       },
  //       {
  //         iconName: "",
  //         iconType: "",
  //         url: "",
  //       },
  //     ];

  //     await Promise.all(
  //       newSocialLinks.map(async (socialLink) => {
  //         await db.userSocialLink.create({
  //           data: {
  //             profileId: profile.id,
  //             iconName: socialLink.iconName,
  //             iconType: socialLink.iconType,
  //             url: socialLink.url,
  //           },
  //         });
  //       })
  //     );
  //   }
  // }

  // If user already has a profile, return it
  if (profile) {
    return profile;
  }

  // // Create a new profile
  // const newProfile = await db.profile.create({
  //   data: {
  //     userId: user.id,
  //     name: `${user.firstName} ${user.lastName}`,
  //     imageUrl: user.imageUrl,
  //     email: user.emailAddresses[0].emailAddress,
  //     domain: user.id,
  //     workEmail: user.emailAddresses[0].emailAddress,
  //     role: "GUEST",
  //   },
  // });

  // return newProfile;
};
