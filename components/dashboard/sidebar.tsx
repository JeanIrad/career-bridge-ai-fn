"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  Calendar,
  BookOpen,
  TrendingUp,
  Settings,
  X,
  Brain
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { name: 'Job Opportunities', id: 'jobs', icon: Briefcase },
  { name: 'Internships', id: 'internships', icon: GraduationCap },
  { name: 'Alumni Network', id: 'alumni', icon: Users },
  { name: 'Messages', id: 'messages', icon: MessageSquare },
  { name: 'Events', id: 'events', icon: Calendar },
  { name: 'Learning Hub', id: 'learning', icon: BookOpen },
  { name: 'Career Analytics', id: 'analytics', icon: TrendingUp },
  { name: 'AI Assistant', id: 'ai-assistant', icon: Brain },
  { name: 'Settings', id: 'settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
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
      <div className={cn(
        "fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Career Bridge AI
              </span>
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
                          variant={activeTab === item.id ? "secondary" : "ghost"}
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