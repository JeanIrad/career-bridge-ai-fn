import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define STRICT role-based route access - users can ONLY access their designated dashboard
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

// Valid user roles
const VALID_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "STUDENT",
  "ALUMNI",
  "EMPLOYER",
  "PROFESSOR",
  "UNIVERSITY_STAFF",
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

  return roleRoutes[role] || "/unauthorized";
}

// Check if user has STRICT access to specific route based on role
function hasStrictRouteAccess(pathname: string, userRole: string): boolean {
  // Validate that the role is valid
  if (!VALID_ROLES.includes(userRole)) {
    return false;
  }

  // For dashboard routes, enforce STRICT role-based access
  for (const [route, allowedRoles] of Object.entries(roleBasedAccess)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }

  // If it's not a role-specific dashboard route, allow access
  return true;
}

// Validate user session and role
function validateUserSession(request: NextRequest): {
  isValid: boolean;
  userRole?: string;
  error?: string;
} {
  // Get the token from cookies or headers
  const token =
    request.cookies.get("careerBridgeAIToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return { isValid: false, error: "no_token" };
  }

  // Try to get user role from token
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
        return { isValid: false, error: "invalid_user_data" };
      }
    }
  }

  if (!userRole) {
    return { isValid: false, error: "no_role" };
  }

  // Validate that the role is valid
  if (!VALID_ROLES.includes(userRole)) {
    return { isValid: false, error: "invalid_role" };
  }

  return { isValid: true, userRole };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and static assets
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    ) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessing a protected route
  if (isProtectedRoute) {
    const sessionValidation = validateUserSession(request);

    // Handle invalid sessions
    if (!sessionValidation.isValid) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);

      switch (sessionValidation.error) {
        case "no_token":
          url.searchParams.set("error", "authentication_required");
          break;
        case "invalid_user_data":
          url.searchParams.set("error", "invalid_session");
          break;
        case "no_role":
          url.searchParams.set("error", "session_expired");
          break;
        case "invalid_role":
          url.searchParams.set("error", "invalid_role");
          break;
        default:
          url.searchParams.set("error", "authentication_failed");
      }

      return NextResponse.redirect(url);
    }

    const userRole = sessionValidation.userRole!;

    // STRICT role-based access check for specific dashboard routes
    if (!hasStrictRouteAccess(pathname, userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      url.searchParams.set("attempted", pathname);
      url.searchParams.set("role", userRole);
      url.searchParams.set("reason", "insufficient_permissions");
      return NextResponse.redirect(url);
    }

    // If accessing generic /dashboard, redirect to role-specific dashboard
    if (pathname === "/dashboard") {
      const url = request.nextUrl.clone();
      const roleSpecificRoute = getRoleDashboardRoute(userRole);

      if (roleSpecificRoute === "/unauthorized") {
        url.pathname = "/unauthorized";
        url.searchParams.set("role", userRole);
        url.searchParams.set("reason", "unknown_role");
      } else {
        url.pathname = roleSpecificRoute;
      }

      return NextResponse.redirect(url);
    }

    // Additional security: Prevent cross-dashboard access attempts
    const userDashboard = getRoleDashboardRoute(userRole);
    if (
      userDashboard !== "/unauthorized" &&
      pathname.startsWith("/dashboard/") &&
      !pathname.startsWith(userDashboard)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      url.searchParams.set("attempted", pathname);
      url.searchParams.set("role", userRole);
      url.searchParams.set("authorized", userDashboard);
      url.searchParams.set("reason", "cross_dashboard_access");
      return NextResponse.redirect(url);
    }
  }

  // If accessing login page with a valid token, redirect to appropriate dashboard
  if (pathname === "/login") {
    const sessionValidation = validateUserSession(request);

    if (sessionValidation.isValid && sessionValidation.userRole) {
      const url = request.nextUrl.clone();
      const roleSpecificRoute = getRoleDashboardRoute(
        sessionValidation.userRole
      );

      if (roleSpecificRoute !== "/unauthorized") {
        url.pathname = roleSpecificRoute;
        return NextResponse.redirect(url);
      }
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
