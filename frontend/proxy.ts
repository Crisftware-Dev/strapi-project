import { type NextRequest, NextResponse } from "next/server";
import { strapiJson } from "./lib/api";

const protectedRoutes = ["/dashboard"];

function checkIsProtectedRoute(path: string) {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  const isProtectedRoute = checkIsProtectedRoute(currentPath);

  if (!isProtectedRoute) return NextResponse.next();

  try {
    const user = await strapiJson('/api/users/me');
    
    if(!user) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const userResponse = NextResponse.next();

    return userResponse;
  } catch (error) {
    console.error("Error verifying user authentication:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
  ],
};