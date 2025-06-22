"use client";

import { useState, useEffect, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const conversation = conversations.find(
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

    const conversation = conversations.find(
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
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-4 p-4">
      <div className="flex flex-1 overflow-hidden rounded-lg border">
        {/* Conversations List */}
        <div className="w-80 border-r">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {connectionStatus}
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNewMessageDialog(true)}
              >
                <MessageSquarePlus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex cursor-pointer items-center space-x-4 border-b p-4 hover:bg-accent/50",
                  selectedConversation === conversation.id && "bg-accent"
                )}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <Avatar>
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>
                    {conversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{conversation.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conversation.timestamp), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default">{conversation.unreadCount}</Badge>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className="flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              <div className="flex h-14 items-center justify-between border-b px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        conversations.find((c) => c.id === selectedConversation)
                          ?.avatar
                      }
                    />
                    <AvatarFallback>
                      {conversations
                        .find((c) => c.id === selectedConversation)
                        ?.name.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {
                        conversations.find((c) => c.id === selectedConversation)
                          ?.name
                      }
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {onlineUsers.includes(
                        conversations.find((c) => c.id === selectedConversation)
                          ?.participants[0]?.id || ""
                      )
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
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
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] space-y-2 rounded-lg px-4 py-2",
                          message.isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {!message.isOwn && (
                            <span className="text-xs font-medium">
                              {message.sender?.name}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.timestamp), "HH:mm")}
                          </span>
                        </div>
                        <p>{message.content}</p>
                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="rounded bg-background/10 px-2 py-1 text-xs"
                                >
                                  <File className="mr-1 inline-block h-3 w-3" />
                                  {attachment}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                {attachments.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm"
                      >
                        <File className="h-4 w-4" />
                        {file.name}
                        <button
                          onClick={() => removeAttachment(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
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
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTyping}
                    disabled={!isConnected || isSending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!isConnected || isSending}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                {typingUsers.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {typingUsers.map((user) => user.username).join(", ")}{" "}
                    typing...
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageSquarePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No conversation selected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation or start a new one
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setShowNewMessageDialog(true)}
                >
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
