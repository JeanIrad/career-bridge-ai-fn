import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Settings, Shield, Database, Users } from "lucide-react";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Main loading spinner */}
          <div className="relative">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <Settings className="w-10 h-10 text-purple-600" />
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading Admin Dashboard
            </h2>
            <p className="text-sm text-gray-600">
              Initializing system management console...
            </p>
          </div>

          {/* Admin-specific feature icons */}
          <div className="grid grid-cols-3 gap-4 opacity-60">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center animate-pulse">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Users</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">Security</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.4s" }}
              >
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Data</span>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          {/* Loading steps */}
          <div className="text-center">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Verifying admin permissions...</div>
              <div>Loading system statistics...</div>
              <div>Preparing management tools...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
