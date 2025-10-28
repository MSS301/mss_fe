// JWT Utility Functions

export type UserRole =
  | "ROLE_USER"
  | "ROLE_ADMIN"
  | "ROLE_TEACHER"
  | "ROLE_STUDENT";

export interface DecodedToken {
  sub: string; // User ID
  email: string;
  emailVerified: boolean;
  scope: UserRole;
  iss: string; // Issuer
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  jti: string; // JWT ID
}

/**
 * Decode JWT token payload
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as DecodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

/**
 * Get time until token expires (in seconds)
 */
export function getTimeUntilExpiry(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - now);
}

/**
 * Check if user has specific role
 */
export function hasRole(token: string, role: UserRole): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.scope === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(token: string): boolean {
  return hasRole(token, "ROLE_ADMIN");
}

/**
 * Check if user is regular user
 */
export function isUser(token: string): boolean {
  return hasRole(token, "ROLE_USER");
}

/**
 * Get user info from token
 */
export function getUserInfo(token: string): {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
} | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.scope,
    emailVerified: decoded.emailVerified,
  };
}
