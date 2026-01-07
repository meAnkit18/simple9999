import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
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
