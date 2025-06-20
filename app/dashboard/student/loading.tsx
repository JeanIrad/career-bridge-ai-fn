import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, BookOpen, Briefcase, Target } from "lucide-react";

export default function StudentDashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Main loading spinner */}
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading Student Dashboard
            </h2>
            <p className="text-sm text-gray-600">
              Setting up your career development workspace...
            </p>
          </div>

          {/* Student-specific feature icons */}
          <div className="grid grid-cols-3 gap-4 opacity-60">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Courses</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Jobs</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div
                className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.4s" }}
              >
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Goals</span>
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
          <div className="text-center">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Loading your profile...</div>
              <div>Fetching career opportunities...</div>
              <div>Preparing recommendations...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
