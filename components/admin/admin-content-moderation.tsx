"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  Flag,
  Ban,
  MessageSquare,
  FileText,
  Image,
  Video,
  User,
  Building,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Info,
  Zap,
  Target,
  Activity,
  Users,
  Globe,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import {
  useModerationRequests,
  useModerationStats,
  useModerationQueueSummary,
  useProcessModerationDecision,
  useBulkModerationAction,
  useAutoModerationRules,
  useUpdateAutoModerationRules,
  useTestAutoModeration,
  useExportModerationData,
  ContentType,
  ModerationStatus,
  ModerationAction,
  ViolationType,
  SeverityLevel,
  AutoModerationRule,
  ModerationFilters,
  ModerationDecision,
  BulkModerationAction as BulkAction,
  AutoModerationRuleConfig,
  getStatusColor,
  getSeverityColor,
  getViolationTypeLabel,
  getContentTypeLabel,
  getModerationActionLabel,
  formatTimeAgo,
} from "@/lib/actions/content-moderation";
import { cn } from "@/lib/utils";
import { ModerationAnalyticsTab } from "./moderation-analytics-tab";
import { AutoModerationTab } from "./auto-moderation-tab";

// Placeholder components for guidelines and settings tabs
function GuidelinesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation Guidelines</CardTitle>
          <CardDescription>
            Guidelines and policies for content moderation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Community Standards
              </h3>
              <p className="text-muted-foreground">
                Our platform maintains high standards for user-generated content
                to ensure a safe and professional environment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Violation Types</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Spam and promotional content</li>
                <li>Harassment and bullying</li>
                <li>Hate speech and discrimination</li>
                <li>Inappropriate or adult content</li>
                <li>Copyright violations</li>
                <li>Fake information and misinformation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moderation Settings</CardTitle>
          <CardDescription>
            Configure content moderation system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-moderation">Enable Auto-Moderation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically moderate content based on configured rules
                </p>
              </div>
              <Switch id="auto-moderation" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Moderation Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications for urgent moderation requests
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="escalation">Auto-Escalation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically escalate high-severity content
                </p>
              </div>
              <Switch id="escalation" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminContentModeration() {
  const [activeTab, setActiveTab] = useState("queue");
  const [filters, setFilters] = useState<ModerationFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  // API hooks
  const {
    data: requests,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useModerationRequests(filters);
  const { data: stats, isLoading: statsLoading } = useModerationStats();
  const { data: queueSummary, isLoading: queueLoading } =
    useModerationQueueSummary();
  const { data: autoRules, isLoading: rulesLoading } = useAutoModerationRules();

  const processDecisionMutation = useProcessModerationDecision();
  const bulkActionMutation = useBulkModerationAction();
  const updateRulesMutation = useUpdateAutoModerationRules();
  const testAutoModerationMutation = useTestAutoModeration();
  const exportDataMutation = useExportModerationData();

  // Filter handlers
  const updateFilters = (newFilters: Partial<ModerationFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setDateRange({});
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedRequests.length === requests?.data.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests?.data.map((req) => req.id) || []);
    }
  };

  const toggleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  // Moderation actions
  const handleModerationDecision = async (
    requestId: string,
    decision: ModerationDecision
  ) => {
    try {
      await processDecisionMutation.mutateAsync({ requestId, decision });
    } catch (error) {
      console.error("Failed to process moderation decision:", error);
    }
  };

  const handleBulkAction = async (
    action: ModerationAction,
    reason?: string
  ) => {
    if (selectedRequests.length === 0) {
      toast.error("Please select requests to perform bulk action");
      return;
    }

    try {
      const bulkData: BulkAction = {
        contentIds: selectedRequests,
        action,
        reason,
        notifyAuthors: true,
      };
      await bulkActionMutation.mutateAsync(bulkData);
      setSelectedRequests([]);
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
  };

  // Auto-moderation test
  const [testContent, setTestContent] = useState("");
  const [testContentType, setTestContentType] = useState<ContentType>(
    ContentType.POST
  );

  const handleTestAutoModeration = async () => {
    if (!testContent.trim()) {
      toast.error("Please enter content to test");
      return;
    }

    try {
      await testAutoModerationMutation.mutateAsync({
        content: testContent,
        contentType: testContentType,
      });
    } catch (error) {
      console.error("Failed to test auto-moderation:", error);
    }
  };

  // Export data
  const handleExportData = async (format: "csv" | "json" | "excel") => {
    try {
      await exportDataMutation.mutateAsync({
        format,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      });
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  // Computed values
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.contentType) count++;
    if (filters.status) count++;
    if (filters.severity) count++;
    if (filters.violationTypes?.length) count++;
    if (filters.search) count++;
    if (filters.flaggedOnly) count++;
    if (filters.autoModeratedOnly) count++;
    if (dateRange.startDate || dateRange.endDate) count++;
    return count;
  }, [filters, dateRange]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Content Moderation
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and moderate platform content to ensure community safety
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => refetchRequests()}
            disabled={requestsLoading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", requestsLoading && "animate-spin")}
            />
            Refresh
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleExportData("csv")}
                  disabled={exportDataMutation.isPending}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleExportData("excel")}
                  disabled={exportDataMutation.isPending}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleExportData("json")}
                  disabled={exportDataMutation.isPending}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Quick Stats */}
      {queueSummary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold">
                    {queueSummary.pendingCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flag className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Flagged
                  </p>
                  <p className="text-2xl font-bold">
                    {queueSummary.flaggedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Urgent
                  </p>
                  <p className="text-2xl font-bold">
                    {queueSummary.urgentCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Wait
                  </p>
                  <p className="text-2xl font-bold">
                    {queueSummary.averageWaitTime}m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Today
                  </p>
                  <p className="text-2xl font-bold">
                    {requests?.stats?.totalToday || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Moderation Queue
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="auto-moderation"
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Auto-Moderation
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Guidelines
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Moderation Queue Tab */}
        <TabsContent value="queue" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Moderation Queue</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      activeFiltersCount > 0 && "border-blue-500 text-blue-600"
                    )}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                  {selectedRequests.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          Bulk Actions ({selectedRequests.length})
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48">
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-green-600"
                            onClick={() =>
                              handleBulkAction(ModerationAction.APPROVE)
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve All
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600"
                            onClick={() =>
                              handleBulkAction(ModerationAction.REJECT)
                            }
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject All
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-orange-600"
                            onClick={() =>
                              handleBulkAction(ModerationAction.FLAG)
                            }
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            Flag All
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </CardHeader>

            {showFilters && (
              <CardContent className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label>Search Content</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search in content..."
                        value={filters.search || ""}
                        onChange={(e) =>
                          updateFilters({ search: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) =>
                        updateFilters({
                          status:
                            value === "all"
                              ? undefined
                              : (value as ModerationStatus),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {Object.values(ModerationStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content Type Filter */}
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select
                      value={filters.contentType || "all"}
                      onValueChange={(value) =>
                        updateFilters({
                          contentType:
                            value === "all"
                              ? undefined
                              : (value as ContentType),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {Object.values(ContentType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {getContentTypeLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Severity Filter */}
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select
                      value={filters.severity || "all"}
                      onValueChange={(value) =>
                        updateFilters({
                          severity:
                            value === "all"
                              ? undefined
                              : (value as SeverityLevel),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All severities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All severities</SelectItem>
                        {Object.values(SeverityLevel).map((severity) => (
                          <SelectItem key={severity} value={severity}>
                            {severity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flagged-only"
                        checked={filters.flaggedOnly || false}
                        onCheckedChange={(checked) =>
                          updateFilters({ flaggedOnly: checked as boolean })
                        }
                      />
                      <Label htmlFor="flagged-only">Flagged only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auto-moderated-only"
                        checked={filters.autoModeratedOnly || false}
                        onCheckedChange={(checked) =>
                          updateFilters({
                            autoModeratedOnly: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="auto-moderated-only">
                        Auto-moderated only
                      </Label>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Moderation Requests List */}
          <Card>
            <CardContent className="p-0">
              {requestsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : requests?.data.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No moderation requests
                  </h3>
                  <p className="text-muted-foreground">
                    All content is currently up to date with moderation.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {/* Header */}
                  <div className="flex items-center p-4 bg-muted/50">
                    <div className="flex items-center space-x-2 flex-1">
                      <Checkbox
                        checked={
                          selectedRequests.length === requests?.data.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                      <span className="text-sm font-medium">
                        {selectedRequests.length > 0
                          ? `${selectedRequests.length} selected`
                          : "Select all"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {requests?.pagination.total} total requests
                    </div>
                  </div>

                  {/* Requests */}
                  {requests?.data.map((request) => (
                    <ModerationRequestItem
                      key={request.id}
                      request={request}
                      isSelected={selectedRequests.includes(request.id)}
                      onSelect={() => toggleSelectRequest(request.id)}
                      onDecision={(decision) =>
                        handleModerationDecision(request.id, decision)
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {requests && requests.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {(requests.pagination.page - 1) * requests.pagination.limit + 1}{" "}
                to{" "}
                {Math.min(
                  requests.pagination.page * requests.pagination.limit,
                  requests.pagination.total
                )}{" "}
                of {requests.pagination.total} requests
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ page: filters.page! - 1 })}
                  disabled={!requests.pagination.hasPrev}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {requests.pagination.page} of{" "}
                  {requests.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ page: filters.page! + 1 })}
                  disabled={!requests.pagination.hasNext}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Other tabs would be implemented here */}
        <TabsContent value="analytics">
          <ModerationAnalyticsTab stats={stats} isLoading={statsLoading} />
        </TabsContent>

        <TabsContent value="auto-moderation">
          <AutoModerationTab
            rules={autoRules}
            isLoading={rulesLoading}
            onUpdateRules={updateRulesMutation.mutateAsync}
            testContent={testContent}
            setTestContent={setTestContent}
            testContentType={testContentType}
            setTestContentType={setTestContentType}
            onTestAutoModeration={handleTestAutoModeration}
            isTestingMutation={testAutoModerationMutation}
          />
        </TabsContent>

        <TabsContent value="guidelines">
          <GuidelinesTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Individual moderation request item component
interface ModerationRequestItemProps {
  request: any;
  isSelected: boolean;
  onSelect: () => void;
  onDecision: (decision: ModerationDecision) => void;
}

function ModerationRequestItem({
  request,
  isSelected,
  onSelect,
  onDecision,
}: ModerationRequestItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [decisionDialog, setDecisionDialog] = useState(false);
  const [moderatorNotes, setModeratorNotes] = useState("");

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.POST:
        return <MessageSquare className="w-4 h-4" />;
      case ContentType.COMMENT:
        return <MessageSquare className="w-4 h-4" />;
      case ContentType.IMAGE:
        return <Image className="w-4 h-4" />;
      case ContentType.VIDEO:
        return <Video className="w-4 h-4" />;
      case ContentType.DOCUMENT:
        return <FileText className="w-4 h-4" />;
      case ContentType.PROFILE:
        return <User className="w-4 h-4" />;
      case ContentType.JOB_POSTING:
        return <Building className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleQuickAction = (action: ModerationAction) => {
    onDecision({
      action,
      moderatorNotes: moderatorNotes || undefined,
      notifyAuthor: true,
    });
  };

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getContentIcon(request.contentType)}
                <span className="text-sm font-medium">
                  {getContentTypeLabel(request.contentType)}
                </span>
              </div>
              <Badge className={cn("text-xs", getStatusColor(request.status))}>
                {request.status.replace(/_/g, " ")}
              </Badge>
              <Badge
                className={cn("text-xs", getSeverityColor(request.severity))}
              >
                {request.severity}
              </Badge>
              {request.violationTypes.map((violation: ViolationType) => (
                <Badge key={violation} variant="outline" className="text-xs">
                  {getViolationTypeLabel(violation)}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(request.createdAt)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Dialog open={decisionDialog} onOpenChange={setDecisionDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Moderation Decision</DialogTitle>
                    <DialogDescription>
                      Make a decision on this content moderation request
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Moderator Notes</Label>
                      <Textarea
                        value={moderatorNotes}
                        onChange={(e) => setModeratorNotes(e.target.value)}
                        placeholder="Add notes about your decision..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleQuickAction(ModerationAction.APPROVE)
                        }
                        className="flex-1"
                        variant="outline"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() =>
                          handleQuickAction(ModerationAction.REJECT)
                        }
                        className="flex-1"
                        variant="outline"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleQuickAction(ModerationAction.FLAG)}
                        className="flex-1"
                        variant="outline"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Flag
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Content Preview */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {request.content}
            </p>
            {request.reason && (
              <p className="text-sm text-red-600">
                <strong>Reason:</strong> {request.reason}
              </p>
            )}
          </div>

          {/* Author Info */}
          {request.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>
                {request.author.firstName} {request.author.lastName} (
                {request.author.email})
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction(ModerationAction.APPROVE)}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction(ModerationAction.REJECT)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction(ModerationAction.FLAG)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Flag className="w-4 h-4 mr-1" />
              Flag
            </Button>
          </div>

          {/* Detailed View */}
          {showDetails && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Content ID:</strong> {request.contentId}
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  {format(new Date(request.createdAt), "PPp")}
                </div>
                {request.reporterId && (
                  <div>
                    <strong>Reporter:</strong> {request.reporter?.firstName}{" "}
                    {request.reporter?.lastName}
                  </div>
                )}
                {request.moderatorId && (
                  <div>
                    <strong>Moderator:</strong> {request.moderator?.firstName}{" "}
                    {request.moderator?.lastName}
                  </div>
                )}
              </div>
              {request.moderatorNotes && (
                <div>
                  <strong>Moderator Notes:</strong>
                  <p className="text-muted-foreground mt-1">
                    {request.moderatorNotes}
                  </p>
                </div>
              )}
              {request.metadata && (
                <div>
                  <strong>Metadata:</strong>
                  <pre className="text-xs bg-background p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(request.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
