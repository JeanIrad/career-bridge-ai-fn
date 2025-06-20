import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define strict role-based route access
const roleBasedAccess: Record<string, string[]> = {
  "/dashboard/student": ["STUDENT", "ALUMNI"],
  "/dashboard/employer": ["EMPLOYER"],
  "/dashboard/admin": ["ADMIN", "SUPER_ADMIN"],
  "/dashboard/university": ["PROFESSOR", "UNIVERSITY_STAFF"],
};

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/student",
  "/dashboard/employer",
  "/dashboard/admin",
  "/dashboard/university",
];

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/auth",
  "/unauthorized",
  "/account-status",
  "/not-found",
];

// Simple token validation and role extraction
function parseTokenPayload(
  token: string | undefined
): { role?: string; userId?: string } | null {
  if (!token || token.length < 10) return null;

  try {
    // For development, we'll decode the user data from localStorage format
    // In production, you'd verify JWT signature here
    const userData = JSON.parse(atob(token.split(".")[1] || "{}"));
    return {
      role: userData.role,
      userId: userData.userId || userData.id,
    };
  } catch {
    // If it's not a JWT, check if it's a simple token
    // This is a fallback for development
    return { role: undefined, userId: undefined };
  }
}

// Get role-specific dashboard route
function getRoleDashboardRoute(role: string): string {
  const roleRoutes: Record<string, string> = {
    STUDENT: "/dashboard/student",
    ALUMNI: "/dashboard/student",
    EMPLOYER: "/dashboard/employer",
    ADMIN: "/dashboard/admin",
    SUPER_ADMIN: "/dashboard/admin",
    PROFESSOR: "/dashboard/university",
    UNIVERSITY_STAFF: "/dashboard/university",
  };

  return roleRoutes[role] || "/dashboard";
}

// Check if user has access to specific route based on role
function hasRouteAccess(pathname: string, userRole: string): boolean {
  // Check if the route requires specific roles
  for (const [route, allowedRoles] of Object.entries(roleBasedAccess)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }
  return true; // Allow access if no specific role restriction
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get the token from cookies or headers
  const token =
    request.cookies.get("careerBridgeAIToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // If accessing a protected route
  if (isProtectedRoute) {
    // No token - redirect to login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("error", "authentication_required");
      return NextResponse.redirect(url);
    }

    // Try to get user role from token
    const tokenPayload = parseTokenPayload(token);

    // If we can't parse the token or get user data, we'll let the frontend handle it
    // But we'll try to get user data from a cookie as fallback
    let userRole = tokenPayload?.role;

    // Fallback: try to get user data from cookies
    if (!userRole) {
      const userCookie = request.cookies.get("user")?.value;
      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie);
          userRole = userData.role;
        } catch {
          // Invalid user data, redirect to login
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("redirect", pathname);
          url.searchParams.set("error", "invalid_session");
          return NextResponse.redirect(url);
        }
      }
    }

    // If we still don't have user role, redirect to login
    if (!userRole) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("error", "session_expired");
      return NextResponse.redirect(url);
    }

    // Check role-based access for specific dashboard routes
    if (!hasRouteAccess(pathname, userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      url.searchParams.set("attempted", pathname);
      url.searchParams.set("role", userRole);
      return NextResponse.redirect(url);
    }

    // If accessing generic /dashboard, redirect to role-specific dashboard
    if (pathname === "/dashboard") {
      const url = request.nextUrl.clone();
      url.pathname = getRoleDashboardRoute(userRole);
      return NextResponse.redirect(url);
    }
  }

  // If accessing login page with a valid token, redirect to appropriate dashboard
  if (pathname === "/login" && token) {
    const tokenPayload = parseTokenPayload(token);
    let userRole = tokenPayload?.role;

    // Fallback: try to get user data from cookies
    if (!userRole) {
      const userCookie = request.cookies.get("user")?.value;
      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie);
          userRole = userData.role;
        } catch {
          // Invalid user data, continue to login
          return NextResponse.next();
        }
      }
    }

    if (userRole) {
      const url = request.nextUrl.clone();
      url.pathname = getRoleDashboardRoute(userRole);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
