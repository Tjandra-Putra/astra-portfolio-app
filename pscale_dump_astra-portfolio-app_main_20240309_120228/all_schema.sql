CREATE TABLE "Profile" (
  "id" VARCHAR(191) NOT NULL,
  "userId" VARCHAR(191) NOT NULL,
  "role" VARCHAR(191) NOT NULL DEFAULT 'GUEST',
  "name" VARCHAR(191),
  "jobTitle" VARCHAR(191),
  "bio" TEXT,
  "about" TEXT,
  "imageUrl" TEXT,
  "resumeUrl" TEXT,
  "email" TEXT NOT NULL,
  "workEmail" TEXT,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  "domain" VARCHAR(191),
  PRIMARY KEY ("id"),
  UNIQUE ("userId"),
  UNIQUE ("domain")
);


CREATE TABLE "Certificate" (
  "id" VARCHAR(191) NOT NULL,
  "name" VARCHAR(191) NOT NULL,
  "description" VARCHAR(191) NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "certificateUrl" TEXT NOT NULL,
  "issuedBy" VARCHAR(191) NOT NULL,
  "issueDate" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  "expirationDate" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT NULL,
  "profileId" VARCHAR(191) NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_profile_id" FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
);


CREATE TABLE "Project" (
  "id" VARCHAR(191) NOT NULL,
  "name" VARCHAR(191),
  "description" TEXT,
  "thumbnailUrl" TEXT,
  "projectUrl" TEXT,
  "githubUrl" TEXT,
  "featured" BOOLEAN DEFAULT FALSE,
  "company" VARCHAR(191),
  "category" VARCHAR(191),
  "visible" BOOLEAN DEFAULT TRUE,
  "content" TEXT,
  "startDate" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT NULL,
  "endDate" TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT NULL,
  "isWorkExperience" BOOLEAN DEFAULT FALSE,
  "workExperienceTitle" VARCHAR(191),
  "profileId" VARCHAR(191) NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  "tags" TEXT,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_project_profile_id" FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
);


CREATE TABLE "UserSocialLink" (
  "id" VARCHAR(191) NOT NULL,
  "url" TEXT NOT NULL,
  "profileId" VARCHAR(191) NOT NULL,
  "createdAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  "iconName" VARCHAR(191) NOT NULL,
  "iconType" VARCHAR(191) NOT NULL,
  "visible" BOOLEAN DEFAULT TRUE,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_user_social_link_profile_id" FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
);
