import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export interface TokenPayload {
  userId: string;
}

/**
 * Get user ID from JWT token in cookies
 */
export async function getUserFromToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Support both old 'id' and new 'userId' formats
    return (payload.userId || payload.id) as string;
  } catch {
    return null;
  }
}

/**
 * Create a JWT token for a user
 */
export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Get user ID with fallback to DEV_USER_ID for development
 */
export async function getUserIdWithFallback(): Promise<string | null> {
  const userId = await getUserFromToken();
  return userId || process.env.DEV_USER_ID || null;
}
