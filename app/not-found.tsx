"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-blue-600">404</div>
            <CardTitle className="text-3xl">Page Not Found</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              This might happen if you've followed an outdated link or typed the
              URL incorrectly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Or try one of these popular pages:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="w-full">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <a href="mailto:support@careerbridge.ai">Support</a>
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Still can't find what you're looking for?
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="link" size="sm" asChild>
                <a href="mailto:support@careerbridge.ai">Contact Support</a>
              </Button>
              <Button variant="link" size="sm" asChild>
                <a href="tel:+1-800-CAREER">Call Us</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
