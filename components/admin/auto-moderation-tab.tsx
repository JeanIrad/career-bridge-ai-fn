'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Zap,
  Settings,
  TestTube,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Activity,
  Gauge,
  Brain,
  Filter,
  Link,
  Image,
  MessageSquare,
  Copy,
  Clock,
  Loader2,
} from 'lucide-react';
import {
  AutoModerationRule,
  AutoModerationRuleConfig,
  ContentType,
  ModerationAction,
} from '@/lib/actions/content-moderation';

interface AutoModerationTabProps {
  rules: Record<string, any> | undefined;
  isLoading: boolean;
  onUpdateRules: (rules: AutoModerationRuleConfig[]) => Promise<any>;
  testContent: string;
  setTestContent: (content: string) => void;
  testContentType: ContentType;
  setTestContentType: (type: ContentType) => void;
  onTestAutoModeration: () => void;
  isTestingMutation: any;
}

export function AutoModerationTab({
  rules,
  isLoading,
  onUpdateRules,
  testContent,
  setTestContent,
  testContentType,
  setTestContentType,
  onTestAutoModeration,
  isTestingMutation,
}: AutoModerationTabProps) {
  const [localRules, setLocalRules] = useState<AutoModerationRuleConfig[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local rules from props
  React.useEffect(() => {
    if (rules && Object.keys(rules).length > 0) {
      const ruleConfigs: AutoModerationRuleConfig[] = Object.entries(rules).map(
        ([key, config]) => ({
          ruleType: key as AutoModerationRule,
          enabled: config.enabled || false,
          threshold: config.threshold || 0.5,
          action: config.action || ModerationAction.FLAG,
          configuration: config.configuration || {},
        }),
      );
      setLocalRules(ruleConfigs);
    } else {
      // Default rules if none exist
      setLocalRules([
        {
          ruleType: AutoModerationRule.PROFANITY_FILTER,
          enabled: true,
          threshold: 0.7,
          action: ModerationAction.FLAG,
          configuration: {},
        },
        {
          ruleType: AutoModerationRule.SPAM_DETECTION,
          enabled: true,
          threshold: 0.8,
          action: ModerationAction.REJECT,
          configuration: {},
        },
        {
          ruleType: AutoModerationRule.LINK_VALIDATION,
          enabled: true,
          threshold: 0.6,
          action: ModerationAction.FLAG,
          configuration: {},
        },
        {
          ruleType: AutoModerationRule.SENTIMENT_ANALYSIS,
          enabled: false,
          threshold: 0.8,
          action: ModerationAction.FLAG,
          configuration: {},
        },
        {
          ruleType: AutoModerationRule.IMAGE_CONTENT_SCAN,
          enabled: false,
          threshold: 0.7,
          action: ModerationAction.FLAG,
          configuration: {},
        },
        {
          ruleType: AutoModerationRule.DUPLICATE_DETECTION,
          enabled: false,
          threshold: 0.9,
          action: ModerationAction.FLAG,
          configuration: {},
        },
        {
          ruleType: AutoModerationRule.RATE_LIMITING,
          enabled: true,
          threshold: 10,
          action: ModerationAction.TEMPORARY_HIDE,
          configuration: { timeWindow: '1h' },
        },
      ]);
    }
  }, [rules]);

  const updateRule = (
    index: number,
    updates: Partial<AutoModerationRuleConfig>,
  ) => {
    const newRules = [...localRules];
    newRules[index] = { ...newRules[index], ...updates };
    setLocalRules(newRules);
    setHasChanges(true);
  };

  const handleSaveRules = async () => {
    try {
      await onUpdateRules(localRules);
      setHasChanges(false);
      toast.success('Auto-moderation rules updated successfully');
    } catch (error) {
      toast.error('Failed to update auto-moderation rules');
    }
  };

  const getRuleIcon = (ruleType: AutoModerationRule) => {
    switch (ruleType) {
      case AutoModerationRule.PROFANITY_FILTER:
        return <MessageSquare className="w-5 h-5" />;
      case AutoModerationRule.SPAM_DETECTION:
        return <Shield className="w-5 h-5" />;
      case AutoModerationRule.LINK_VALIDATION:
        return <Link className="w-5 h-5" />;
      case AutoModerationRule.IMAGE_CONTENT_SCAN:
        return <Image className="w-5 h-5" />;
      case AutoModerationRule.SENTIMENT_ANALYSIS:
        return <Brain className="w-5 h-5" />;
      case AutoModerationRule.DUPLICATE_DETECTION:
        return <Copy className="w-5 h-5" />;
      case AutoModerationRule.RATE_LIMITING:
        return <Clock className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getRuleDescription = (ruleType: AutoModerationRule) => {
    switch (ruleType) {
      case AutoModerationRule.PROFANITY_FILTER:
        return 'Automatically detect and filter profanity and inappropriate language';
      case AutoModerationRule.SPAM_DETECTION:
        return 'Identify spam content using pattern recognition and machine learning';
      case AutoModerationRule.LINK_VALIDATION:
        return 'Validate links and detect potentially malicious or suspicious URLs';
      case AutoModerationRule.IMAGE_CONTENT_SCAN:
        return 'Scan images for inappropriate content using AI vision models';
      case AutoModerationRule.SENTIMENT_ANALYSIS:
        return 'Analyze text sentiment to detect negative or harmful content';
      case AutoModerationRule.DUPLICATE_DETECTION:
        return 'Detect duplicate or near-duplicate content across the platform';
      case AutoModerationRule.RATE_LIMITING:
        return 'Limit the rate of content creation to prevent abuse';
      default:
        return 'Auto-moderation rule';
    }
  };

  const getActionColor = (action: ModerationAction) => {
    switch (action) {
      case ModerationAction.APPROVE:
        return 'bg-green-100 text-green-800';
      case ModerationAction.REJECT:
        return 'bg-red-100 text-red-800';
      case ModerationAction.FLAG:
        return 'bg-orange-100 text-orange-800';
      case ModerationAction.TEMPORARY_HIDE:
        return 'bg-yellow-100 text-yellow-800';
      case ModerationAction.PERMANENT_BAN:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Auto-Moderation Configuration</h2>
          <p className="text-muted-foreground">
            Configure automated content moderation rules and thresholds
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600">
              Unsaved Changes
            </Badge>
          )}
          <Button onClick={handleSaveRules} disabled={!hasChanges}>
            <Settings className="w-4 h-4 mr-2" />
            Save Rules
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Moderation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {localRules.map((rule, index) => (
                <div
                  key={rule.ruleType}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  {/* Rule Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${rule.enabled ? 'bg-green-100' : 'bg-gray-100'}`}
                      >
                        {getRuleIcon(rule.ruleType)}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {rule.ruleType
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getRuleDescription(rule.ruleType)}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(enabled) =>
                        updateRule(index, { enabled })
                      }
                    />
                  </div>

                  {rule.enabled && (
                    <div className="space-y-4 pl-11">
                      {/* Threshold */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">
                            Threshold: {rule.threshold}
                            {rule.ruleType === AutoModerationRule.RATE_LIMITING
                              ? ' per hour'
                              : ''}
                          </Label>
                          <Badge className={getActionColor(rule.action!)}>
                            {rule.action?.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <Slider
                          value={[rule.threshold!]}
                          onValueChange={([value]) =>
                            updateRule(index, { threshold: value })
                          }
                          max={
                            rule.ruleType === AutoModerationRule.RATE_LIMITING
                              ? 100
                              : 1
                          }
                          min={0}
                          step={
                            rule.ruleType === AutoModerationRule.RATE_LIMITING
                              ? 1
                              : 0.1
                          }
                          className="w-full"
                        />
                      </div>

                      {/* Action */}
                      <div className="space-y-2">
                        <Label className="text-sm">Action when triggered</Label>
                        <Select
                          value={rule.action}
                          onValueChange={(value) =>
                            updateRule(index, {
                              action: value as ModerationAction,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ModerationAction.FLAG}>
                              Flag for Review
                            </SelectItem>
                            <SelectItem value={ModerationAction.REJECT}>
                              Auto-Reject
                            </SelectItem>
                            <SelectItem value={ModerationAction.TEMPORARY_HIDE}>
                              Temporary Hide
                            </SelectItem>
                            <SelectItem value={ModerationAction.ESCALATE}>
                              Escalate to Admin
                            </SelectItem>
                            <SelectItem value={ModerationAction.WARNING}>
                              Send Warning
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rule-specific configuration */}
                      {rule.ruleType === AutoModerationRule.RATE_LIMITING && (
                        <div className="space-y-2">
                          <Label className="text-sm">Time Window</Label>
                          <Select
                            value={rule.configuration?.timeWindow || '1h'}
                            onValueChange={(value) =>
                              updateRule(index, {
                                configuration: {
                                  ...rule.configuration,
                                  timeWindow: value,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1h">1 Hour</SelectItem>
                              <SelectItem value="24h">24 Hours</SelectItem>
                              <SelectItem value="7d">7 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {rule.ruleType ===
                        AutoModerationRule.SENTIMENT_ANALYSIS && (
                        <div className="space-y-2">
                          <Label className="text-sm">Sensitivity Level</Label>
                          <Select
                            value={rule.configuration?.sensitivity || 'medium'}
                            onValueChange={(value) =>
                              updateRule(index, {
                                configuration: {
                                  ...rule.configuration,
                                  sensitivity: value,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Testing Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-purple-600" />
                Test Auto-Moderation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select
                  value={testContentType}
                  onValueChange={(value) =>
                    setTestContentType(value as ContentType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ContentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Test Content</Label>
                <Textarea
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  placeholder="Enter content to test auto-moderation rules..."
                  rows={6}
                />
              </div>

              <Button
                onClick={onTestAutoModeration}
                disabled={!testContent.trim() || isTestingMutation.isPending}
                className="w-full"
              >
                {isTestingMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Content
                  </>
                )}
              </Button>

              {/* Test Results */}
              {isTestingMutation.data && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                  <h4 className="font-medium">Test Results</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Severity:</span>
                      <Badge
                        className={
                          isTestingMutation.data.analysis.severity ===
                          'CRITICAL'
                            ? 'bg-red-100 text-red-800'
                            : isTestingMutation.data.analysis.severity ===
                                'HIGH'
                              ? 'bg-orange-100 text-orange-800'
                              : isTestingMutation.data.analysis.severity ===
                                  'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }
                      >
                        {isTestingMutation.data.analysis.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence:</span>
                      <span className="text-sm font-medium">
                        {(
                          isTestingMutation.data.analysis.confidence * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Action:</span>
                      <Badge
                        className={
                          isTestingMutation.data.analysis.shouldAutoReject
                            ? 'bg-red-100 text-red-800'
                            : isTestingMutation.data.analysis.shouldAutoApprove
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {isTestingMutation.data.analysis.shouldAutoReject
                          ? 'Auto-Reject'
                          : isTestingMutation.data.analysis.shouldAutoApprove
                            ? 'Auto-Approve'
                            : 'Manual Review'}
                      </Badge>
                    </div>
                  </div>
                  {isTestingMutation.data.analysis.reasons.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Reasons:</span>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {isTestingMutation.data.analysis.reasons.map(
                          (reason: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              {reason}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Auto-Moderation Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Rules:</span>
                  <Badge variant="secondary">
                    {localRules.filter((rule) => rule.enabled).length} /{' '}
                    {localRules.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-Approval Rate:</span>
                  <span className="text-sm font-medium">73%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">False Positive Rate:</span>
                  <span className="text-sm font-medium">2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing Speed:</span>
                  <span className="text-sm font-medium">~50ms</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Activity</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>142 posts auto-approved today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span>8 posts auto-rejected today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-orange-500" />
                    <span>23 posts flagged for review</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
