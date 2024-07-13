/**
 * An array of routes that are accessible to the public
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
