"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UniversityOverviewProps {
  partnership: any;
}

export function UniversityOverview({ partnership }: UniversityOverviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partnership Overview</CardTitle>
          <CardDescription>
            Overview functionality is currently being updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Partnership overview features will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
