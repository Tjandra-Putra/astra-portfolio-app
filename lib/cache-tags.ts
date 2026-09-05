/**
 * Cache tag vocabulary, shared by the cached readers and the mutation routes.
 *
 * Every tag names exactly one slice of data so a write invalidates the minimum
 * necessary. Keeping the strings in one place is what stops a reader and a
 * writer from silently disagreeing about a tag name — the failure mode there is
 * a cache that never invalidates, which is invisible until someone's edit
 * "doesn't save".
 */
export const TAGS = {
  /** The public directory listing on the landing page. */
  profiles: "profiles",
  profile: (profileId: string) => `profile:${profileId}`,
  projects: (profileId: string) => `projects:${profileId}`,
  project: (projectId: string) => `project:${projectId}`,
  education: (profileId: string) => `education:${profileId}`,
  certificates: (profileId: string) => `certificates:${profileId}`,
  /** Cheap aggregate the client polls to detect a DB change. */
  version: (profileId: string) => `version:${profileId}`,
} as const;

/** Tags to drop when anything belonging to a profile changes. */
export function profileScopedTags(profileId: string): string[] {
  return [
    TAGS.profiles,
    TAGS.profile(profileId),
    TAGS.projects(profileId),
    TAGS.education(profileId),
    TAGS.certificates(profileId),
    TAGS.version(profileId),
  ];
}
