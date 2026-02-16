import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/signup",
    "/disclaimer",
    "/docs",
    "/privacy",
    "/terms",
    "/use-cases",
    "/pricing",
    "/changelog",
    "/developer",
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/guest",
];

const IGNORED_ROUTES = [
    "/_next",
    "/favicon.ico",
    "/icon.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/images",
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Skip ignored routes
    if (IGNORED_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2. Check token
    const token = req.cookies.get("token")?.value;

    // 3. Define route types
    const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/"));
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // 4. Verify token if present
    let isValidToken = false;
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
            await jwtVerify(token, secret);
            isValidToken = true;
        } catch (err) {
            console.log("Token verification failed:", err);
        }
    }

    // 5. Redirect logic
    // Case A: Accessing protected route without valid token -> Redirect to Login
    if (!isValidToken && !isPublic) {
        console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
        const loginUrl = new URL("/login", req.url);
        // loginUrl.searchParams.set("callbackUrl", pathname); // Optional: remember where they were going
        return NextResponse.redirect(loginUrl);
    }

    // Case B: Accessing Auth page (Login/Signup) WITH valid token -> Redirect to Dashboard
    if (isValidToken && isAuthPage) {
        console.log(`[Middleware] Redirecting authenticated user from ${pathname} to /dashboard`);
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Case C: Allow
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
