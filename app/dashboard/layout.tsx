import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
