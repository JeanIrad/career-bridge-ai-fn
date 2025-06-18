// import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
// import { AuthContainer } from "@/components/auth/auth-container";

// export default function Home() {
//   return (
//     <div>
//       <AuthContainer />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Building2,
  Users,
  School,
  ArrowRight,
  Star,
  TrendingUp,
  MessageCircle,
  Calendar,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const userRoles = [
    {
      id: "student",
      title: "Student/Alumni",
      description:
        "Discover opportunities, connect with mentors, and build your career network",
      icon: GraduationCap,
      color: "bg-blue-500",
      features: ["Job Search", "Mentorship", "Networking", "Skill Development"],
      route: "/dashboard/student",
    },
    {
      id: "employer",
      title: "Employer",
      description:
        "Find talented candidates and build relationships with universities",
      icon: Building2,
      color: "bg-emerald-500",
      features: [
        "Talent Acquisition",
        "Campus Recruitment",
        "Brand Building",
        "Industry Connect",
      ],
      route: "/dashboard/employer",
    },
    {
      id: "admin",
      title: "Admin/SuperAdmin",
      description: "Manage platform operations and oversee all user activities",
      icon: Users,
      color: "bg-purple-500",
      features: [
        "User Management",
        "Analytics",
        "Content Moderation",
        "System Control",
      ],
      route: "/dashboard/admin",
    },
    {
      id: "university",
      title: "University Staff",
      description: "Support students and manage institutional partnerships",
      icon: School,
      color: "bg-orange-500",
      features: [
        "Student Support",
        "Partnership Management",
        "Event Coordination",
        "Career Services",
      ],
      route: "/dashboard/university",
    },
  ];

  const stats = [
    { label: "Active Students", value: "25,000+", icon: GraduationCap },
    { label: "Partner Companies", value: "500+", icon: Building2 },
    { label: "Job Placements", value: "10,000+", icon: Briefcase },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CareerBridgeAI
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connecting students, alumni, employers, and universities through
              AI-powered career development and opportunity matching
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>35,000+ Users</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>Real-time Chat</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role Selection */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Choose Your Dashboard
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userRoles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                    selectedRole === role.id
                      ? "ring-2 ring-primary shadow-lg"
                      : ""
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center mb-4`}
                    >
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {role.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Link href={role.route} className="w-full">
                      <Button className="w-full group">
                        Enter Dashboard
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <Briefcase className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Smart Job Matching</CardTitle>
                <CardDescription>
                  AI-powered job recommendations based on skills, interests, and
                  career goals
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>
                  Connect instantly with mentors, employers, and peers through
                  integrated chat
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Event Management</CardTitle>
                <CardDescription>
                  Discover and manage career fairs, workshops, and networking
                  events
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
