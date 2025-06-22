"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { format } from "date-fns";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useChat } from "@/hooks/use-chat";
import { getUsers } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  MessageSquare,
  MessageSquarePlus,
  Search,
  Send,
  Paperclip,
  Smile,
  File,
  Loader2,
  MoreVertical,
  Phone,
  Video,
  UserPlus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role?: string;
  headline?: string;
}

export default function EmployerMessages() {
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
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [conversationSearchQuery, setConversationSearchQuery] = useState("");
  const [localConversations, setLocalConversations] = useState<
    typeof conversations
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use local conversations that can be updated
  const allConversations =
    localConversations.length > 0 ? localConversations : conversations;

  // Filter conversations based on search query and exclude current user
  const filteredConversations = useMemo(() => {
    let filtered = allConversations;

    // Filter out conversations with the current user (self-conversations)
    if (user?.id) {
      filtered = filtered.filter((conversation) => {
        if (conversation.type === "direct") {
          // For direct conversations, check if the other participant is not the current user
          const otherParticipant = conversation.participants?.[0];
          return otherParticipant?.id !== user.id;
        }
        return true; // Keep group conversations
      });
    }

    // Apply search filter
    if (!conversationSearchQuery.trim()) return filtered;

    return filtered.filter((conversation) => {
      const searchLower = conversationSearchQuery.toLowerCase();
      const name = conversation.name.toLowerCase();
      const lastMessage = conversation.lastMessage?.toLowerCase() || "";

      return name.includes(searchLower) || lastMessage.includes(searchLower);
    });
  }, [allConversations, conversationSearchQuery, user?.id]);

  // Update local conversations when chat conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      setLocalConversations(conversations);
    }
  }, [conversations]);

  // Update the loadUsers function to handle different user types
  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await getUsers({
        page: 1,
        limit: 50,
        search: searchQuery,
        role: selectedTab === "candidates" ? "STUDENT" : undefined,
      });

      if (response.success && response.data.users) {
        let users = response.data.users;

        // If we're looking for candidates, also include alumni
        if (selectedTab === "candidates") {
          const alumniResponse = await getUsers({
            page: 1,
            limit: 50,
            search: searchQuery,
            role: "ALUMNI",
          });
          if (alumniResponse.success) {
            users = [...users, ...alumniResponse.data.users];
          }
        }

        setUsers(users);
        setFilteredUsers(users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load users when dialog opens
  useEffect(() => {
    if (showNewMessageDialog) {
      loadUsers();
    }
  }, [showNewMessageDialog]);

  // Filter users based on search query
  useEffect(() => {
    if (!users.length) return;

    const filtered = users.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const headline = user.headline?.toLowerCase() || "";

      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        headline.includes(searchLower)
      );
    });

    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      getMessages(selectedConversation);
    }
  }, [selectedConversation, getMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewConversation = async (userId: string) => {
    try {
      const selectedUser = users.find((user) => user.id === userId);
      if (!selectedUser) {
        throw new Error("User not found");
      }

      // Send initial message
      await sendMessage("👋 Hi!", userId, {
        metadata: { type: "initial_message" },
      });

      // Select the new conversation
      setSelectedConversation(`direct_${userId}`);

      // Close the dialog
      setShowNewMessageDialog(false);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending || !selectedConversation) {
      return;
    }

    const conversation = filteredConversations.find(
      (c) => c.id === selectedConversation
    );
    if (!conversation) return;

    setIsSending(true);
    try {
      if (conversation.type === "direct") {
        const otherParticipant = conversation.participants?.[0];
        if (otherParticipant) {
          stopTyping(otherParticipant.id);
          await sendMessage(newMessage.trim(), otherParticipant.id, {});
        }
      } else if (conversation.type === "group") {
        const groupId = conversation.id.replace("group_", "");
        await sendMessage(newMessage.trim(), undefined, { groupId });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!selectedConversation) return;

    const conversation = filteredConversations.find(
      (c) => c.id === selectedConversation
    );
    if (!conversation) return;

    if (conversation.type === "direct") {
      const otherParticipant = conversation.participants?.[0];
      if (otherParticipant) {
        startTyping(otherParticipant.id);
      }
    } else if (conversation.type === "group") {
      const groupId = conversation.id.replace("group_", "");
      startTyping(undefined, groupId);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main Chat Container - Fixed Height */}
      <div className="flex-1 flex overflow-hidden border-t">
        {/* Conversations Sidebar - Fixed Width */}
        <div className="w-80 flex flex-col border-r bg-background">
          {/* Header - Fixed Height */}
          <div className="flex h-16 items-center justify-between border-b px-4 flex-shrink-0">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center gap-2">
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="text-xs"
              >
                {connectionStatus}
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                onClick={refreshConversations}
                title="Refresh conversations"
                className="h-8 w-8"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNewMessageDialog(true)}
                className="h-8 w-8"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search - Fixed Height */}
          <div className="border-b p-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9"
                value={conversationSearchQuery}
                onChange={(e) => setConversationSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      No conversations yet
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Start a new conversation to get started
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowNewMessageDialog(true)}
                      className="h-8 bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageSquarePlus className="h-4 w-4 mr-2" />
                      New Message
                    </Button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        "flex cursor-pointer items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-accent/60 hover:shadow-sm",
                        selectedConversation === conversation.id &&
                          "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      )}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {conversation.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online indicator */}
                        {onlineUsers.includes(
                          conversation.participants?.[0]?.id || ""
                        ) && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm truncate text-foreground">
                            {conversation.name}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2 font-medium">
                            {format(new Date(conversation.timestamp), "HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge
                              variant="default"
                              className="h-5 min-w-[20px] text-xs ml-2 bg-blue-600 hover:bg-blue-700"
                            >
                              {conversation.unreadCount > 99
                                ? "99+"
                                : conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {/* Online status text */}
                        <p className="text-xs mt-1 font-medium">
                          {onlineUsers.includes(
                            conversation.participants?.[0]?.id || ""
                          ) ? (
                            <span className="text-green-600 dark:text-green-400">
                              ● Online
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              ○ Offline
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Messages Area - Flexible */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              {/* Chat Header - Fixed Height */}
              <div className="h-16 flex items-center justify-between border-b px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage
                        src={
                          filteredConversations.find(
                            (c) => c.id === selectedConversation
                          )?.avatar
                        }
                      />
                      <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {filteredConversations
                          .find((c) => c.id === selectedConversation)
                          ?.name?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    {onlineUsers.includes(
                      filteredConversations.find(
                        (c) => c.id === selectedConversation
                      )?.participants[0]?.id || ""
                    ) && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">
                      {
                        filteredConversations.find(
                          (c) => c.id === selectedConversation
                        )?.name
                      }
                    </h3>
                    <p className="text-sm font-medium">
                      {onlineUsers.includes(
                        filteredConversations.find(
                          (c) => c.id === selectedConversation
                        )?.participants[0]?.id || ""
                      ) ? (
                        <span className="text-green-600 dark:text-green-400">
                          ● Online
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          ○ Offline • Messages will be delivered
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 hover:bg-accent"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 hover:bg-accent"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 hover:bg-accent"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Conversation</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add to group
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Search in conversation
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages - Scrollable Area */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4">
                  <div className="py-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center min-h-[400px]">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Start the conversation
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Send a message to get things started
                        </p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message, index) => {
                          const isFirstInGroup =
                            index === 0 ||
                            messages[index - 1]?.senderId !== message.senderId;
                          const isLastInGroup =
                            index === messages.length - 1 ||
                            messages[index + 1]?.senderId !== message.senderId;

                          return (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3 group",
                                message.isOwn ? "flex-row-reverse" : "flex-row",
                                !isFirstInGroup && "mt-1"
                              )}
                            >
                              {/* Avatar - only show for first message in group */}
                              {!message.isOwn && isFirstInGroup && (
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage src={message.sender?.avatar} />
                                  <AvatarFallback className="text-xs font-medium">
                                    {message.sender?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "?"}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              {/* Spacer for grouped messages */}
                              {!message.isOwn && !isFirstInGroup && (
                                <div className="w-8 flex-shrink-0" />
                              )}

                              <div
                                className={cn(
                                  "flex flex-col max-w-[70%] min-w-[100px]",
                                  message.isOwn ? "items-end" : "items-start"
                                )}
                              >
                                {/* Sender name - only for first message in group from others */}
                                {!message.isOwn && isFirstInGroup && (
                                  <p className="text-xs font-medium text-muted-foreground mb-1 px-1">
                                    {message.sender?.name || "Unknown User"}
                                  </p>
                                )}

                                {/* Message bubble */}
                                <div
                                  className={cn(
                                    "relative px-4 py-2 text-sm break-words",
                                    message.isOwn
                                      ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                                      : "bg-gray-100 dark:bg-gray-800 text-foreground rounded-2xl rounded-bl-md",
                                    // Adjust border radius for grouped messages
                                    !isFirstInGroup &&
                                      message.isOwn &&
                                      "rounded-tr-md",
                                    !isFirstInGroup &&
                                      !message.isOwn &&
                                      "rounded-tl-md",
                                    !isLastInGroup &&
                                      message.isOwn &&
                                      "rounded-br-md",
                                    !isLastInGroup &&
                                      !message.isOwn &&
                                      "rounded-bl-md"
                                  )}
                                >
                                  <p>{message.content}</p>

                                  {/* Message metadata */}
                                  {message.metadata?.recipients &&
                                    message.metadata.recipients.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-white/20">
                                        <p className="text-xs opacity-75">
                                          To:{" "}
                                          {message.metadata.recipients
                                            .map(
                                              (r: any) =>
                                                `${r.firstName} ${r.lastName}`.trim() ||
                                                r.email
                                            )
                                            .join(", ")}
                                          {message.metadata.recipientCount >
                                            1 &&
                                            ` (${message.metadata.recipientCount} recipients)`}
                                        </p>
                                      </div>
                                    )}
                                </div>

                                {/* Timestamp and status - only show for last message in group */}
                                {isLastInGroup && (
                                  <div
                                    className={cn(
                                      "flex items-center gap-1 mt-1 px-1",
                                      message.isOwn
                                        ? "flex-row-reverse"
                                        : "flex-row"
                                    )}
                                  >
                                    <span className="text-xs text-muted-foreground">
                                      {format(
                                        new Date(message.timestamp),
                                        "HH:mm"
                                      )}
                                    </span>
                                    {message.isOwn && (
                                      <span className="text-xs text-muted-foreground">
                                        {message.status === "delivered"
                                          ? "✓✓"
                                          : message.status === "sent"
                                            ? "✓"
                                            : message.status === "sending"
                                              ? "⏳"
                                              : ""}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Current user avatar - only show for first message in group */}
                              {message.isOwn && isFirstInGroup && (
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage src={user?.avatar} />
                                  <AvatarFallback className="text-xs font-medium bg-blue-600 text-white">
                                    {user?.firstName?.[0]}
                                    {user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              {/* Spacer for grouped messages */}
                              {message.isOwn && !isFirstInGroup && (
                                <div className="w-8 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Message Input - Fixed Height */}
              <div className="border-t bg-background p-4 flex-shrink-0">
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm"
                      >
                        <File className="h-4 w-4" />
                        <span className="max-w-32 truncate">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-xs">
                      {typingUsers.map((user) => user.username).join(", ")}{" "}
                      typing...
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-9 w-9 hover:bg-accent"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="h-9 w-9 hover:bg-accent"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 flex items-end gap-3">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={handleTyping}
                        disabled={!isConnected || isSending}
                        className="pr-12 min-h-[40px] resize-none border-2 focus:border-blue-500 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      {/* Character counter for long messages */}
                      {newMessage.length > 100 && (
                        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                          {newMessage.length}/1000
                        </span>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={!isConnected || isSending || !newMessage.trim()}
                      size="icon"
                      className="h-10 w-10 bg-blue-600 hover:bg-blue-700 disabled:bg-muted"
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageSquarePlus className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  Welcome to Messages
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Select a conversation from the sidebar to start messaging, or
                  create a new conversation to connect with colleagues and
                  candidates.
                </p>
                <Button
                  onClick={() => setShowNewMessageDialog(true)}
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Start new conversation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Dialog */}
      <Dialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Start a new conversation with another user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="online" className="flex-1">
                  Online
                </TabsTrigger>
                <TabsTrigger value="candidates" className="flex-1">
                  Candidates
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">
                  Recent
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {isLoadingUsers ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-muted cursor-pointer"
                      onClick={() => startNewConversation(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.headline || user.email}
                          </p>
                        </div>
                      </div>
                      {onlineUsers.includes(user.id) && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700"
                        >
                          Online
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
