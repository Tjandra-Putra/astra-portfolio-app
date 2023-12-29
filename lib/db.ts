import { PrismaClient } from "@prisma/client";

// Declare a global variable for PrismaClient to make it accessible throughout the application
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// If the environment is not production, assign the 'db' to the global 'prisma' variable
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
