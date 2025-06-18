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
import { Input } from "@/components/ui/input";
import { CreateUserModal } from "@/components/admin/create-user-modal";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Building2,
  GraduationCap,
  Users,
  Activity,
  Shield,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminUsers() {
  const users = [
    {
      id: 1,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@stanford.edu",
      role: "Student",
      university: "Stanford University",
      status: "Active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@techcorp.com",
      role: "Employer",
      company: "TechCorp Solutions",
      status: "Active",
      joinDate: "2024-02-03",
      lastActive: "1 day ago",
      verified: true,
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      email: "sarah.williams@mit.edu",
      role: "University Staff",
      university: "MIT",
      status: "Active",
      joinDate: "2023-09-12",
      lastActive: "3 hours ago",
      verified: true,
    },
    {
      id: 4,
      name: "James Thompson",
      email: "james.thompson@berkeley.edu",
      role: "Alumni",
      university: "UC Berkeley",
      status: "Pending",
      joinDate: "2024-03-01",
      lastActive: "1 week ago",
      verified: false,
    },
    {
      id: 5,
      name: "Lisa Park",
      email: "lisa.park@innovationlabs.com",
      role: "Employer",
      company: "Innovation Labs",
      status: "Active",
      joinDate: "2024-01-28",
      lastActive: "5 hours ago",
      verified: true,
    },
    {
      id: 6,
      name: "David Kumar",
      email: "david.kumar@caltech.edu",
      role: "Student",
      university: "Caltech",
      status: "Inactive",
      joinDate: "2023-11-20",
      lastActive: "2 weeks ago",
      verified: true,
    },
  ];

  const userStats = [
    {
      label: "Total Users",
      value: "2,547",
      change: "+127 this month",
      icon: Users,
    },
    {
      label: "Active Today",
      value: "1,856",
      change: "+89 vs yesterday",
      icon: Activity,
    },
    {
      label: "Pending Verification",
      value: "23",
      change: "-5 this week",
      icon: UserCheck,
    },
    {
      label: "Suspended Users",
      value: "8",
      change: "+2 this month",
      icon: UserX,
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Student":
      case "Alumni":
        return GraduationCap;
      case "Employer":
        return Building2;
      case "University Staff":
        return Shield;
      default:
        return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all platform users across different roles
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <CreateUserModal />
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-emerald-600">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Complete list of platform users with management options
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-10 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.verified && (
                              <UserCheck className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{user.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.university || user.company || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {user.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.lastActive}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Verify User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
