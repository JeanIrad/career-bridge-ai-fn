"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, Shield, Building, Users } from "lucide-react";

const roleConfig = {
  student: { label: "Student", icon: User, color: "bg-blue-100 text-blue-800" },
  admin: { label: "Admin", icon: Shield, color: "bg-red-100 text-red-800" },
  employer: {
    label: "Employer",
    icon: Building,
    color: "bg-green-100 text-green-800",
  },
  staff: {
    label: "Staff",
    icon: Users,
    color: "bg-purple-100 text-purple-800",
  },
};

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const currentRole = roleConfig[user.role];
  const CurrentIcon = currentRole.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <Badge className={currentRole.color}>{currentRole.label}</Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role as any)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {config.label}
              {user.role === role && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
