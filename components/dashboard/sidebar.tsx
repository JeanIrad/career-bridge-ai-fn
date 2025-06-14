"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Brain } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getNavigationForRole } from "../../config/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const roleColors = {
  STUDENT: "from-blue-600 to-purple-600",
  ADMIN: "from-red-600 to-pink-600",
  EMPLOYER: "from-green-600 to-teal-600",
  PROFESSOR: "from-purple-600 to-indigo-600",
};

export function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const { user } = useAuth();

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);
  const gradientClass = roleColors[user.role];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-gray-900/80"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-lg font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                >
                  Career Bridge AI
                </span>
                <Badge variant="outline" className="text-xs w-fit">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}{" "}
                  Portal
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Button
                          variant={
                            activeTab === item.id ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-start gap-x-3 text-left font-medium",
                            activeTab === item.id
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                          )}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsOpen(false);
                          }}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
