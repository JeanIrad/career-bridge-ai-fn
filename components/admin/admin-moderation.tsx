"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
} from "lucide-react";

export function AdminModeration() {
  const moderationQueue = [
    {
      id: 1,
      type: "Job Posting",
      title: "Senior Developer Position - TechCorp",
      reporter: "Anonymous",
      reason: "Misleading salary information",
      status: "Pending",
      priority: "Medium",
      reportedAt: "2 hours ago",
    },
    {
      id: 2,
      type: "User Message",
      title: "Inappropriate language in chat",
      reporter: "Sarah Williams",
      reason: "Offensive content",
      status: "Under Review",
      priority: "High",
      reportedAt: "4 hours ago",
    },
    {
      id: 3,
      type: "Profile Content",
      title: "Fake credentials claimed",
      reporter: "System Auto-Detection",
      reason: "Suspicious qualifications",
      status: "Pending",
      priority: "High",
      reportedAt: "6 hours ago",
    },
  ];

  const moderationStats = [
    { label: "Pending Reviews", value: "15", icon: Flag },
    { label: "Resolved Today", value: "28", icon: CheckCircle },
    { label: "Auto-Flagged", value: "7", icon: AlertTriangle },
    { label: "Appeals", value: "3", icon: MessageCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">
            Review and moderate platform content and user reports
          </p>
        </div>
        <Button>
          <Eye className="w-4 h-4 mr-2" />
          Review All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {moderationStats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Moderation Queue
          </CardTitle>
          <CardDescription>Content reports awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderationQueue.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge
                        variant={
                          item.priority === "High"
                            ? "destructive"
                            : item.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Reported by: {item.reporter} • {item.reason}
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.status === "Pending" ? "default" : "secondary"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.reportedAt}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
