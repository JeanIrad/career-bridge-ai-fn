import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthProvider } from "@/contexts/auth-context";
export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
