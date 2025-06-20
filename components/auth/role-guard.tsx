"use client";

import { useAuth } from "@/contexts/auth-context";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles, if false, user needs ANY role
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  requireAll = false,
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return null;
  }

  // No user or no role
  if (!user || !user.role) {
    return <>{fallback}</>;
  }

  // Check role access
  const hasAccess = requireAll
    ? allowedRoles.every((role) => role === user.role)
    : allowedRoles.includes(user.role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for specific roles
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function EmployerOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["EMPLOYER"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function StudentOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["STUDENT", "ALUMNI"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function UniversityOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["PROFESSOR", "UNIVERSITY_STAFF"]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
