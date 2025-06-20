// Authentication utility functions

export const TOKEN_KEY = "careerBridgeAIToken";
export const USER_KEY = "user";

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

// Get token from cookies
export const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === TOKEN_KEY) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Set token in localStorage and cookies
export const setToken = (token: string, rememberMe: boolean = false): void => {
  if (typeof window === "undefined") return;

  // Set in localStorage
  localStorage.setItem(TOKEN_KEY, token);

  // Set in cookies for middleware access
  const days = rememberMe ? 7 : 1; // 7 days if remember me, 1 day otherwise
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = window.location.protocol === "https:";

  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;SameSite=Strict${secure ? ";Secure" : ""}`;
};

// Remove token from localStorage and cookies
export const removeToken = (): void => {
  if (typeof window === "undefined") return;

  // Remove from localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Remove from cookies
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${USER_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Get user from localStorage
export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Store user in localStorage and cookies
export const setStoredUser = (user: any): void => {
  if (typeof window === "undefined") return;

  const userString = JSON.stringify(user);

  // Set in localStorage
  localStorage.setItem(USER_KEY, userString);

  // Set in cookies for middleware access
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 1 day
  const secure = window.location.protocol === "https:";

  document.cookie = `${USER_KEY}=${encodeURIComponent(userString)};expires=${expires.toUTCString()};path=/;SameSite=Strict${secure ? ";Secure" : ""}`;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken() || getTokenFromCookie();
  return !!token;
};

// Get role-based dashboard route
export const getRoleDashboardRoute = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    STUDENT: "/dashboard/student",
    ALUMNI: "/dashboard/student",
    EMPLOYER: "/dashboard/employer",
    ADMIN: "/dashboard/admin",
    SUPER_ADMIN: "/dashboard/admin",
    PROFESSOR: "/dashboard/university",
    UNIVERSITY_STAFF: "/dashboard/university",
    MENTOR: "/dashboard/mentor",
  };

  return roleRoutes[role] || "/dashboard";
};

// Check if user has access to a specific route
export const hasRouteAccess = (route: string, userRole: string): boolean => {
  const roleBasedAccess: Record<string, string[]> = {
    "/dashboard/student": ["STUDENT", "ALUMNI"],
    "/dashboard/employer": ["EMPLOYER"],
    "/dashboard/admin": ["ADMIN", "SUPER_ADMIN"],
    "/dashboard/university": ["PROFESSOR", "UNIVERSITY_STAFF"],
  };

  // Check if the route requires specific roles
  for (const [routePath, allowedRoles] of Object.entries(roleBasedAccess)) {
    if (route.startsWith(routePath)) {
      return allowedRoles.includes(userRole);
    }
  }

  return true; // Allow access if no specific role restriction
};

// Redirect to login with current path
export const redirectToLogin = (currentPath?: string): void => {
  if (typeof window === "undefined") return;

  const path = currentPath || window.location.pathname;
  const loginUrl = `/login${path !== "/" ? `?redirect=${encodeURIComponent(path)}` : ""}`;
  window.location.href = loginUrl;
};

// Get redirect URL from query params
export const getRedirectUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("redirect");
};

// Validate user role and redirect if necessary
export const validateAndRedirect = (user: any, currentPath: string): void => {
  if (!user || !user.role) {
    redirectToLogin(currentPath);
    return;
  }

  // Check if user has access to current route
  if (!hasRouteAccess(currentPath, user.role)) {
    // Redirect to unauthorized page
    window.location.href = `/unauthorized?attempted=${encodeURIComponent(currentPath)}&role=${user.role}`;
    return;
  }

  // If accessing generic dashboard, redirect to role-specific dashboard
  if (currentPath === "/dashboard") {
    const roleDashboard = getRoleDashboardRoute(user.role);
    if (roleDashboard !== "/dashboard") {
      window.location.href = roleDashboard;
    }
  }
};
