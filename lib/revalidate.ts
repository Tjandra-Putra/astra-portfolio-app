import { revalidateTag } from "next/cache";
import { TAGS, profileScopedTags } from "@/lib/cache-tags";

/**
 * Call from a mutation route AFTER a successful write. This is the mechanism
 * that keeps the cache honest: without it, cached reads would serve pre-write
 * data until the TTL backstop expires.
 */
export function revalidateProfile(profileId?: string | null) {
  revalidateTag(TAGS.profiles);
  if (profileId) profileScopedTags(profileId).forEach(revalidateTag);
}

export function revalidateProjects(profileId?: string | null, projectId?: string | null) {
  if (projectId) revalidateTag(TAGS.project(projectId));
  if (profileId) {
    revalidateTag(TAGS.projects(profileId));
    revalidateTag(TAGS.version(profileId));
  }
}

export function revalidateEducation(profileId?: string | null) {
  if (!profileId) return;
  revalidateTag(TAGS.education(profileId));
  revalidateTag(TAGS.version(profileId));
}

export function revalidateCertificates(profileId?: string | null) {
  if (!profileId) return;
  revalidateTag(TAGS.certificates(profileId));
  revalidateTag(TAGS.version(profileId));
}
