"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UniversityEventsProps {
  partnership: any;
}

export function UniversityEvents({ partnership }: UniversityEventsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>University Events</CardTitle>
          <CardDescription>
            Events functionality is currently being updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Event management features will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
