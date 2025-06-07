"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Star,
  Archive,
  Trash2
} from "lucide-react";

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Alumni - Google",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      lastMessage: "Thanks for connecting! Happy to help with your career questions.",
      timestamp: "2h ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "TechCorp Recruiter",
      role: "HR Manager",
      avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      lastMessage: "We'd like to schedule an interview for the Frontend position.",
      timestamp: "5h ago",
      unread: 1,
      online: false
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Alumni - Microsoft",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      lastMessage: "Great meeting you at the networking event!",
      timestamp: "1d ago",
      unread: 0,
      online: true
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Career Counselor",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      lastMessage: "I've reviewed your resume. Let's discuss the feedback.",
      timestamp: "2d ago",
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: "DataFlow Team",
      role: "Hiring Team",
      avatar: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      lastMessage: "Thank you for your application. We'll be in touch soon.",
      timestamp: "3d ago",
      unread: 0,
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Sarah Chen",
      content: "Hi John! Thanks for connecting with me on the platform.",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      senderId: 0,
      senderName: "You",
      content: "Hi Sarah! Thanks for accepting my connection request. I'm really interested in learning about your experience at Google.",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Sarah Chen",
      content: "I'd be happy to share my experience! I've been working as a Senior Software Engineer for about 3 years now. What specific aspects are you most curious about?",
      timestamp: "10:40 AM",
      isOwn: false
    },
    {
      id: 4,
      senderId: 0,
      senderName: "You",
      content: "I'm particularly interested in the interview process and what skills are most important for a new grad. Also, how did you transition from university to working at such a large company?",
      timestamp: "10:45 AM",
      isOwn: true
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Sarah Chen",
      content: "Great questions! The interview process at Google is quite comprehensive. They focus heavily on data structures, algorithms, and system design. For new grads, I'd recommend practicing coding problems daily and understanding the fundamentals really well.",
      timestamp: "10:50 AM",
      isOwn: false
    },
    {
      id: 6,
      senderId: 1,
      senderName: "Sarah Chen",
      content: "As for the transition, it was definitely overwhelming at first, but Google has excellent onboarding and mentorship programs. The key is to be curious, ask questions, and don't be afraid to make mistakes - that's how you learn!",
      timestamp: "10:52 AM",
      isOwn: false
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Connect and communicate with your network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button size="sm" variant="outline">New Chat</Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              <div className="space-y-1 p-3">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{conversation.role}</p>
                      <p className="text-sm text-gray-700 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConv.avatar} alt={selectedConv.name} />
                        <AvatarFallback>{selectedConv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {selectedConv.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedConv.name}</h3>
                      <p className="text-sm text-gray-600">{selectedConv.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />

              {/* Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}