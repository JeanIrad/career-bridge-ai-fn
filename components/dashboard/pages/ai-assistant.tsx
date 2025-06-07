"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send,
  Brain,
  Lightbulb,
  FileText,
  MessageSquare,
  Sparkles,
  Clock,
  TrendingUp,
  Target,
  BookOpen
} from "lucide-react";

export function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI Career Assistant. I can help you with resume optimization, interview preparation, career planning, and job search strategies. What would you like to work on today?",
      timestamp: "Just now"
    }
  ]);

  const quickActions = [
    {
      icon: FileText,
      title: "Resume Review",
      description: "Get AI-powered feedback on your resume",
      action: "review-resume"
    },
    {
      icon: MessageSquare,
      title: "Interview Prep",
      description: "Practice with AI-generated interview questions",
      action: "interview-prep"
    },
    {
      icon: Target,
      title: "Career Planning",
      description: "Create a personalized career roadmap",
      action: "career-planning"
    },
    {
      icon: TrendingUp,
      title: "Skill Assessment",
      description: "Identify skills to develop for your goals",
      action: "skill-assessment"
    }
  ];

  const suggestions = [
    "How can I improve my resume for software engineering roles?",
    "What are the most in-demand skills for data science?",
    "Help me prepare for a product manager interview",
    "What career paths are available in tech?",
    "How do I negotiate salary effectively?"
  ];

  const insights = [
    {
      icon: Lightbulb,
      title: "Resume Optimization",
      content: "Your resume could benefit from more quantified achievements. Consider adding metrics to showcase your impact.",
      priority: "High"
    },
    {
      icon: BookOpen,
      title: "Skill Development",
      content: "Based on your target roles, learning AWS and Docker would significantly boost your marketability.",
      priority: "Medium"
    },
    {
      icon: Target,
      title: "Application Strategy",
      content: "You're applying to roles that match 85% of your skills. Consider targeting positions with 70-80% match for better success rates.",
      priority: "Medium"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: message,
        timestamp: "Just now"
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          content: "I understand you're looking for guidance on that topic. Let me analyze your profile and provide personalized recommendations...",
          timestamp: "Just now"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'resume-review': "I'd like you to review my resume and provide feedback.",
      'interview-prep': "Can you help me prepare for upcoming interviews?",
      'career-planning': "I need help creating a career development plan.",
      'skill-assessment': "What skills should I focus on developing?"
    };
    
    setMessage(actionMessages[action as keyof typeof actionMessages] || "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          AI Career Assistant
        </h1>
        <p className="text-gray-600 mt-2">Your intelligent companion for career growth and job search success</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with AI Assistant
            </CardTitle>
            <CardDescription>Ask questions, get advice, and receive personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="h-8 w-8">
                        {msg.type === 'ai' ? (
                          <div className="bg-blue-600 text-white w-full h-full flex items-center justify-center">
                            <Brain className="h-4 w-4" />
                          </div>
                        ) : (
                          <AvatarImage src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                        )}
                        <AvatarFallback>{msg.type === 'ai' ? 'AI' : 'You'}</AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about your career..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <div className="flex items-start gap-3">
                    <action.icon className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-600">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <insight.icon className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant={insight.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent AI Interactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Resume analysis completed</span>
                  <span className="text-gray-500">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Interview questions generated</span>
                  <span className="text-gray-500">1d ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Career path recommendations</span>
                  <span className="text-gray-500">3d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}