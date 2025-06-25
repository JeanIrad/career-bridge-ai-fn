"use client";

import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ChatBrowser } from "./chat-browser";
import { toast } from "sonner";

export function StudentMessages() {
  const { user } = useCurrentUser();
  const {
    isConnected,
    connectionStatus,
    messages,
    conversations,
    onlineUsers,
    typingUsers,
    error,
    sendMessage,
    getMessages,
    startTyping,
    stopTyping,
    refreshConversations,
  } = useChat();

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);
  const [showBrowser, setShowBrowser] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      getMessages(selectedConversation);
    }
  }, [selectedConversation, getMessages]);

  // Handle starting a new chat with a user
  const handleStartChat = (chatUser: any) => {
    const conversationId = `direct_${chatUser.id}`;
    setSelectedConversation(conversationId);
    setShowBrowser(false);

    // Create a temporary conversation entry if it doesn't exist
    const existingConv = conversations.find((c) => c.id === conversationId);
    if (!existingConv) {
      // This would typically be handled by the chat service
      // For now, we'll just select the conversation and let the chat load
      console.log(
        `Starting new conversation with ${chatUser.firstName} ${chatUser.lastName}`
      );
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      // Extract target user ID from conversation ID
      const targetUserId = selectedConversation.replace("direct_", "");
      await sendMessage(newMessage, targetUserId);
      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Handle typing
  const handleTyping = (isTyping: boolean) => {
    if (!selectedConversation) return;

    const targetUserId = selectedConversation.replace("direct_", "");
    if (isTyping) {
      startTyping(targetUserId);
    } else {
      stopTyping(targetUserId);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "employer":
        return "bg-blue-100 text-blue-700";
      case "mentor":
        return "bg-green-100 text-green-700";
      case "university":
        return "bg-purple-100 text-purple-700";
      case "alumni":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  // Calculate stats from real data
  const totalConversations = conversations.length;
  const unreadMessages = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );
  const employerContacts = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes("hr") ||
      conv.name.toLowerCase().includes("manager") ||
      conv.name.toLowerCase().includes("recruiter")
  ).length;
  const mentorConnections = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes("mentor") ||
      conv.name.toLowerCase().includes("advisor")
  ).length;

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">
              Connect with employers, mentors, and university staff
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Connection Error
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refreshConversations}>
              <Loader2 className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Connect with employers, mentors, and university staff
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {connectionStatus === "connected" ? "Connected" : "Connecting..."}
          </Badge>
          <Button
            onClick={() => setShowBrowser(!showBrowser)}
            variant={showBrowser ? "default" : "outline"}
          >
            <Users className="w-4 h-4 mr-2" />
            {showBrowser ? "Back to Messages" : "Browse Users"}
          </Button>
          <Button onClick={refreshConversations} disabled={!isConnected}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
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
                <p className="text-2xl font-bold">{totalConversations}</p>
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
                <p className="text-2xl font-bold">{unreadMessages}</p>
              </div>
              <Badge className="w-8 h-8 text-white" />
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
                <p className="text-2xl font-bold">{employerContacts}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mentor Connections
                </p>
                <p className="text-2xl font-bold">{mentorConnections}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Show either the browser or the chat interface */}
      {showBrowser ? (
        <ChatBrowser onStartChat={handleStartChat} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
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
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback className="text-sm font-semibold">
                              {conversation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {onlineUsers.includes(
                            conversation.participants[0]?.id || ""
                          ) && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {conversation.name}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                conversation.timestamp
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                {selectedConv ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConv.avatar} />
                          <AvatarFallback className="text-sm font-semibold">
                            {selectedConv.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {onlineUsers.includes(
                          selectedConv.participants[0]?.id || ""
                        ) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedConv.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {onlineUsers.includes(
                            selectedConv.participants[0]?.id || ""
                          )
                            ? "Online"
                            : "Offline"}
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
                ) : (
                  <div className="text-center text-muted-foreground">
                    Select a conversation to start messaging
                  </div>
                )}
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                {selectedConv ? (
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
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a conversation to view messages</p>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Message Input */}
              {selectedConv && (
                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Button size="sm" variant="outline">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping(e.target.value.length > 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                      rows={1}
                      disabled={isSending}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
