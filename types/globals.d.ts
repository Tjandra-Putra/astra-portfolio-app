export {};

// Create a type for the roles
export type Roles = "ADMIN" | "GUEST" | "MEMBER";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
