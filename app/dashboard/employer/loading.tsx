import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Building, Users, FileText, BarChart } from "lucide-react";

export default function EmployerDashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Main loading spinner */}
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Building className="w-10 h-10 text-green-600" />
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading Employer Dashboard
            </h2>
            <p className="text-sm text-gray-600">
              Preparing your recruitment workspace...
            </p>
          </div>

          {/* Employer-specific feature icons */}
          <div className="grid grid-cols-3 gap-4 opacity-60">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center animate-pulse">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Jobs</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Candidates</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.4s" }}
              >
                <BarChart className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Analytics</span>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          {/* Loading steps */}
          <div className="text-center">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Loading company profile...</div>
              <div>Fetching job postings...</div>
              <div>Preparing candidate matches...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
