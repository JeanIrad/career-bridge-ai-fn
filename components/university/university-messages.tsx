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
  Users,
  Building2,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";

export function UniversityMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Jennifer Smith",
      role: "HR Manager - TechCorp Solutions",
      lastMessage:
        "We'd like to schedule a campus visit for next month to meet with CS students.",
      timestamp: "1 hour ago",
      unread: 2,
      avatar: "JS",
      status: "online",
      type: "employer",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      role: "Student - Computer Science",
      lastMessage:
        "Thank you for the career counseling session. The resume tips were very helpful!",
      timestamp: "3 hours ago",
      unread: 0,
      avatar: "ER",
      status: "online",
      type: "student",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Alumni - Class of 2020",
      lastMessage:
        "I'd love to participate in the upcoming alumni mentorship program.",
      timestamp: "1 day ago",
      unread: 1,
      avatar: "MC",
      status: "offline",
      type: "alumni",
    },
    {
      id: 4,
      name: "Dr. Sarah Williams",
      role: "Faculty - Engineering Department",
      lastMessage:
        "The industry partnership proposal looks great. Let's discuss implementation.",
      timestamp: "2 days ago",
      unread: 0,
      avatar: "SW",
      status: "offline",
      type: "faculty",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Jennifer Smith",
      content:
        "Hi Dr. Rodriguez! I hope you're doing well. I wanted to reach out about scheduling a campus visit.",
      timestamp: "2:30 PM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content:
        "Hi Jennifer! Great to hear from you. We'd be delighted to host TechCorp on campus.",
      timestamp: "2:45 PM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Jennifer Smith",
      content:
        "Wonderful! We're particularly interested in meeting with Computer Science students for our summer internship program.",
      timestamp: "3:00 PM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content:
        "Perfect timing! Our CS students are very active right now. I can arrange a meet-and-greet session.",
      timestamp: "3:15 PM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Jennifer Smith",
      content:
        "That sounds excellent! What dates work best for you? We're flexible with our schedule.",
      timestamp: "1 hour ago",
      isOwn: false,
    },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "employer":
        return "bg-blue-100 text-blue-700";
      case "student":
        return "bg-green-100 text-green-700";
      case "alumni":
        return "bg-purple-100 text-purple-700";
      case "faculty":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">
            Manage communications with students, employers, and faculty
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
                <p className="text-2xl font-bold">156</p>
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
                <p className="text-2xl font-bold">18</p>
              </div>
              <Badge className="w-8 h-8 flex items-center justify-center">
                18
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Employer Contacts
                </p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Student Inquiries
                </p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <GraduationCap className="w-8 h-8 text-primary" />
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
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={getTypeColor(conversation.type)}
                          variant="secondary"
                        >
                          {conversation.type}
                        </Badge>
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
