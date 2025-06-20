"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Menu,
  Bell,
  Search,
  User,
  MessageCircle,
  Settings,
  LogOut,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/actions/auth";
import { User as UserType } from "@/utils/types/user";

interface TabItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  content: React.ReactNode;
}

interface TabbedDashboardLayoutProps {
  children?: React.ReactNode;
  tabs: TabItem[];
  userRole: string;
  userName: string;
  defaultTab?: string;
  user?: UserType;
}

export function TabbedDashboardLayout({
  children,
  tabs,
  userRole,
  userName,
  defaultTab,
  user,
}: TabbedDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if the API call fails, we should still clear local data
      // The logout function already handles this
    } finally {
      // Don't reset loading state here since we're redirecting
      // The page will be unmounted anyway
    }
  };

  const handleMenuItemClick = (targetTabId: string) => {
    // Find the tab that matches the menu item
    const targetTab = tabs.find(
      (tab) =>
        tab.id === targetTabId ||
        tab.label.toLowerCase().includes(targetTabId.toLowerCase()) ||
        (targetTabId === "profile" &&
          (tab.id.includes("profile") ||
            tab.label.toLowerCase().includes("profile"))) ||
        (targetTabId === "messages" &&
          (tab.id.includes("messages") ||
            tab.label.toLowerCase().includes("messages"))) ||
        (targetTabId === "settings" &&
          (tab.id.includes("settings") ||
            tab.label.toLowerCase().includes("settings")))
    );

    if (targetTab && !isLoggingOut) {
      setActiveTab(targetTab.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Logging out...
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait while we securely log you out
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen && !isLoggingOut} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="font-bold text-lg">CareerBridgeAI</span>
            </Link>
          </div>

          <div className="px-4">
            <Tabs
              value={activeTab}
              onValueChange={isLoggingOut ? undefined : setActiveTab}
              orientation="vertical"
            >
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0 space-y-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    disabled={isLoggingOut}
                    className={`w-full justify-start gap-3 px-3 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
                      isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <tab.icon className="w-5 h-5" />
                    )}
                    <span className="font-medium">{tab.label}</span>
                    {tab.badge && !isLoggingOut && (
                      <Badge variant="secondary" className="ml-auto">
                        {tab.badge}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header
          className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 ${
            isLoggingOut ? "opacity-75" : ""
          }`}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <GraduationCap className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="font-bold text-lg">CareerBridgeAI</span>
                </Link>
              </div>

              <div className="px-4">
                <Tabs
                  value={activeTab}
                  onValueChange={isLoggingOut ? undefined : setActiveTab}
                  orientation="vertical"
                >
                  <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0 space-y-1">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        disabled={isLoggingOut}
                        className={`w-full justify-start gap-3 px-3 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
                          isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoggingOut ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <tab.icon className="w-5 h-5" />
                        )}
                        <span className="font-medium">{tab.label}</span>
                        {tab.badge && !isLoggingOut && (
                          <Badge variant="secondary" className="ml-auto">
                            {tab.badge}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isLoggingOut ? "Logging out..." : "Search..."}
                className="pl-10 bg-slate-50 border-0 focus-visible:ring-1"
                disabled={isLoggingOut}
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    disabled={isLoggingOut}
                  >
                    <Avatar className="h-8 w-8">
                      {isLoggingOut ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        <>
                          {user?.avatar ? (
                            <AvatarImage src={user.avatar} alt={userName} />
                          ) : (
                            <AvatarFallback>
                              {userName.charAt(0)}
                            </AvatarFallback>
                          )}
                        </>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isLoggingOut ? "Logging out..." : userRole}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    onClick={() => handleMenuItemClick("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    onClick={() => handleMenuItemClick("messages")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    onClick={() => handleMenuItemClick("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={
                      isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    {isLoggingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Desktop Tabs */}
        <div
          className={`hidden lg:block border-b bg-white ${isLoggingOut ? "opacity-75" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs
              value={activeTab}
              onValueChange={isLoggingOut ? undefined : setActiveTab}
            >
              <TabsList className="h-12 bg-transparent border-0 p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    disabled={isLoggingOut}
                    className={`relative h-12 rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none ${
                      isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <tab.icon className="w-4 h-4" />
                      )}
                      <span>{tab.label}</span>
                      {tab.badge && !isLoggingOut && (
                        <Badge variant="secondary" className="ml-1">
                          {tab.badge}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Page Content */}
        <main
          className={`flex-1 ${isLoggingOut ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {isLoggingOut ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">Preparing to log out...</p>
                </div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            )}
            {!isLoggingOut && children}
          </div>
        </main>
      </div>
    </div>
  );
}
