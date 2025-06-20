"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, redirectToLogin } from "@/lib/auth-utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  }, [router]);

  // Don't render anything if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
