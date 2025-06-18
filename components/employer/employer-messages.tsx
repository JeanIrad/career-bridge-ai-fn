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
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  Archive,
} from "lucide-react";
import { useState } from "react";

export function EmployerMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Emily Rodriguez",
      role: "Student - Stanford University",
      lastMessage:
        "Thank you for the interview opportunity! I'm very excited about the position.",
      timestamp: "2 hours ago",
      unread: 2,
      avatar: "ER",
      status: "online",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Student - UC Berkeley",
      lastMessage: "I have a few questions about the internship program...",
      timestamp: "5 hours ago",
      unread: 0,
      avatar: "MC",
      status: "offline",
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      role: "University Staff - MIT",
      lastMessage: "We'd like to schedule a campus visit for next month.",
      timestamp: "1 day ago",
      unread: 1,
      avatar: "SW",
      status: "online",
    },
    {
      id: 4,
      name: "James Thompson",
      role: "Alumni - UC Berkeley",
      lastMessage: "Great meeting you at the networking event!",
      timestamp: "2 days ago",
      unread: 0,
      avatar: "JT",
      status: "offline",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Emily Rodriguez",
      content:
        "Hi Jennifer! Thank you so much for taking the time to interview me yesterday.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content:
        "Hi Emily! It was great meeting you. You have an impressive background in machine learning.",
      timestamp: "10:45 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Emily Rodriguez",
      content:
        "Thank you! I'm really excited about the opportunity to work on AI projects at TechCorp. When can I expect to hear back about next steps?",
      timestamp: "11:00 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content:
        "We'll be making our decision by the end of this week. I'll make sure to keep you updated!",
      timestamp: "11:15 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Emily Rodriguez",
      content:
        "Perfect! Thank you for the timeline. I look forward to hearing from you.",
      timestamp: "2 hours ago",
      isOwn: false,
    },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with candidates, students, and university partners
          </p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Conversations
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unread Messages
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Badge className="w-8 h-8 flex items-center justify-center">
                12
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Response Rate
                </p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Response Time
                </p>
                <p className="text-2xl font-bold">2.5h</p>
              </div>
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-secondary transition-colors ${
                    selectedConversation === conversation.id
                      ? "bg-secondary"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                        {conversation.avatar}
                      </div>
                      {conversation.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {conversation.role}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="ml-2">{conversation.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {selectedConv?.avatar}
                    </div>
                    {selectedConv?.status === "online" && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConv?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv?.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
