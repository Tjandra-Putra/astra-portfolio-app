CREATE TABLE `Certificate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificateUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuedBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issueDate` datetime(3) NOT NULL,
  `expirationDate` datetime(3) DEFAULT NULL,
  `profileId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Certificate_profileId_idx` (`profileId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
