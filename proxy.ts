import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getPublicTools } from "@/lib/tools/registry";

const PUBLIC_ROUTES = [
    "/",
    "/sitemap.xml",
    "/robots.txt",
    "/ads.txt",
    "/icon.svg",
    "/about",
    "/contact",
    "/blog",
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
    "/tools",
];

function isPublicPath(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname)) return true;
    if (pathname.startsWith("/blog/")) return true;
    // Public tool landing pages derived from the central registry.
    const publicToolPaths = getPublicTools().map((t) => t.canonicalPath);
    if (publicToolPaths.includes(pathname)) return true;
    return false;
}

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const isPublic = isPublicPath(pathname);
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    if (!token && !isPublic) {
        const loginUrl = new URL("/login", req.url);
        if (pathname.startsWith("/") && !pathname.startsWith("//")) {
            loginUrl.searchParams.set("next", pathname);
        }
        return NextResponse.redirect(loginUrl);
    }
    if (token && isAuthPage) {
        const next = req.nextUrl.searchParams.get("next");
        const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
        return NextResponse.redirect(new URL(dest, req.url));
    }
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            await jwtVerify(token, secret);
        } catch {
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("token");
            return response;
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api).*)"],
};