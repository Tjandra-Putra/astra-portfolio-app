import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { TAGS } from "@/lib/cache-tags";

/**
 * Server-side cached database readers.
 *
 * Each reader is wrapped in `unstable_cache` and tagged, so a repeat request
 * is served without touching Postgres, and a write to the corresponding table
 * drops exactly the affected entries via `revalidateTag` (see lib/revalidate).
 *
 * `revalidate` is a backstop only — correctness comes from the tags. It exists
 * so a missed invalidation self-heals within a few minutes instead of serving
 * stale data forever.
 *
 * IMPORTANT: nothing inside these functions may read `cookies()`/`headers()`
 * or call Clerk. `unstable_cache` forbids request-scoped data, and a cache key
 * that ignores the current user would leak one user's view to another. Do
 * per-user branching in the route handler, around these calls.
 */
const TTL = 300; // seconds

export const getProfiles = unstable_cache(
  () => db.profile.findMany({ orderBy: { createdAt: "asc" } }),
  ["profiles:all"],
  { tags: [TAGS.profiles], revalidate: TTL }
);

export const getProfileById = (profileId: string) =>
  unstable_cache(
    () => db.profile.findUnique({ where: { id: profileId }, include: { socialLinks: true } }),
    ["profile:byId", profileId],
    { tags: [TAGS.profile(profileId)], revalidate: TTL }
  )();

export const getProfileByUserId = (userId: string) =>
  unstable_cache(
    () => db.profile.findFirst({ where: { userId } }),
    ["profile:byUserId", userId],
    { tags: [TAGS.profiles], revalidate: TTL }
  )();

export const getProjectsByProfileId = (profileId: string) =>
  unstable_cache(
    () => db.project.findMany({ where: { profileId }, orderBy: { startDate: "desc" } }),
    ["projects:byProfile", profileId],
    { tags: [TAGS.projects(profileId)], revalidate: TTL }
  )();

export const getProjectById = (projectId: string) =>
  unstable_cache(
    () => db.project.findUnique({ where: { id: projectId } }),
    ["project:byId", projectId],
    { tags: [TAGS.project(projectId)], revalidate: TTL }
  )();

export const getEducationByProfileId = (profileId: string) =>
  unstable_cache(
    () => db.education.findMany({ where: { profileId }, orderBy: { startDate: "desc" } }),
    ["education:byProfile", profileId],
    { tags: [TAGS.education(profileId)], revalidate: TTL }
  )();

export const getCertificatesByProfileId = (profileId: string) =>
  unstable_cache(
    () => db.certificate.findMany({ where: { profileId }, orderBy: { issuedDate: "desc" } }),
    ["certificates:byProfile", profileId],
    { tags: [TAGS.certificates(profileId)], revalidate: TTL }
  )();

/**
 * A cheap fingerprint of everything the client caches for one profile.
 *
 * Four indexed `max(updatedAt)` aggregates instead of four full table reads —
 * the client polls this to decide whether to throw away its own cache, so it
 * has to stay small. Tagged too, so in the common case it costs nothing.
 */
export const getProfileVersion = (profileId: string) =>
  unstable_cache(
    async () => {
      const [profile, project, education, certificate] = await Promise.all([
        db.profile.findUnique({ where: { id: profileId }, select: { updatedAt: true } }),
        db.project.aggregate({ where: { profileId }, _max: { updatedAt: true }, _count: true }),
        db.education.aggregate({ where: { profileId }, _max: { updatedAt: true }, _count: true }),
        db.certificate.aggregate({ where: { profileId }, _max: { updatedAt: true }, _count: true }),
      ]);

      const stamp = (d?: Date | null) => (d ? d.getTime() : 0);
      // Counts are included so a deletion changes the version even though it
      // can only ever lower the max(updatedAt).
      return [
        stamp(profile?.updatedAt),
        stamp(project._max.updatedAt),
        project._count,
        stamp(education._max.updatedAt),
        education._count,
        stamp(certificate._max.updatedAt),
        certificate._count,
      ].join("-");
    },
    ["version:byProfile", profileId],
    { tags: [TAGS.version(profileId)], revalidate: 60 }
  )();
