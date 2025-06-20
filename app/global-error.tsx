"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error("Global error caught:", error);

    // You can also send this to your error tracking service
    // Example: Sentry.captureException(error);
  }, [error]);

  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const subject = `Critical Error Report: ${error.name}`;
    const body = `Critical Error Details:\n\n${JSON.stringify(errorReport, null, 2)}`;
    const mailtoLink = `mailto:support@careerbridge.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailtoLink, "_blank");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                Critical Application Error
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  A critical error has occurred that prevented the application
                  from loading properly.
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team has been automatically notified and is working to
                  resolve this issue.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <Bug className="w-4 h-4" />
                  <span className="font-medium">Error Details</span>
                </div>
                <p className="text-sm text-red-600 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={reset} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Homepage
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <p className="text-sm text-muted-foreground">
                  Still experiencing issues?
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleReportError}
                    className="text-blue-600"
                  >
                    Report This Error
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="text-blue-600"
                  >
                    <a href="mailto:support@careerbridge.ai">Contact Support</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
