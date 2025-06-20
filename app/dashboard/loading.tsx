import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Settings, User, Building, Users } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Main loading spinner */}
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            {/* Outer ring animation */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading Dashboard
            </h2>
            <p className="text-sm text-gray-600">
              Preparing your personalized workspace...
            </p>
          </div>

          {/* Role icons animation */}
          <div className="flex space-x-4 opacity-60">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div
              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center animate-pulse"
              style={{ animationDelay: "0.2s" }}
            >
              <Building className="w-4 h-4 text-green-600" />
            </div>
            <div
              className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center animate-pulse"
              style={{ animationDelay: "0.4s" }}
            >
              <Settings className="w-4 h-4 text-purple-600" />
            </div>
            <div
              className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center animate-pulse"
              style={{ animationDelay: "0.6s" }}
            >
              <Users className="w-4 h-4 text-orange-600" />
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          {/* Loading steps */}
          <div className="text-center space-y-1">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                <span>Authenticating user</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Loading dashboard content</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Finalizing setup</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
