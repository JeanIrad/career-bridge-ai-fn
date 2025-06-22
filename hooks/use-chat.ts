"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getConversations,
  getConversationMessages,
  sendMessage as apiSendMessage,
} from "@/lib/api";
import { toast } from "sonner";
import { getToken } from "@/lib/auth-utils";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  groupId?: string;
  timestamp: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
    name?: string;
  };
  isOwn?: boolean;
  messageId?: string;
  status?: "sending" | "sent" | "delivered" | "read" | "error";
  attachments?: string[];
  metadata?: any;
  replyTo?: Message;
  isEdited?: boolean;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  description?: string;
  lastMessage?: string;
  timestamp: string;
  unreadCount: number;
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface MessageOptions {
  attachments?: string[];
  metadata?: any;
  replyTo?: string;
  groupId?: string;
}

export interface UseChat {
  isConnected: boolean;
  messages: Message[];
  conversations: Conversation[];
  onlineUsers: string[];
  typingUsers: Array<{
    userId: string;
    username: string;
    groupId?: string;
    targetUserId?: string;
  }>;
  error: string | null;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  sendMessage: (
    content: string,
    targetUserId?: string,
    options?: MessageOptions
  ) => Promise<void>;
  sendDirectMessage: (content: string, recipientId: string) => Promise<void>;
  sendGroupMessage: (content: string, groupId: string) => Promise<void>;
  getMessages: (
    conversationId: string,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  clearMessages: () => void;
  startTyping: (targetUserId?: string, groupId?: string) => void;
  stopTyping: (targetUserId?: string, groupId?: string) => void;
  markAsRead: (messageIds: string[]) => Promise<void>;
  getOnlineUsers: (userIds?: string[]) => void;
}

export function useChat(): UseChat {
  const { user } = useCurrentUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<
    Array<{
      userId: string;
      username: string;
      groupId?: string;
      targetUserId?: string;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial conversations
  useEffect(() => {
    if (!user?.id) return;

    const loadConversations = async () => {
      try {
        const response = await getConversations();
        if (response.success) {
          setConversations(response.data.conversations);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
        toast.error("Failed to load conversations");
      }
    };

    loadConversations();
  }, [user?.id]);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.id) return;

    const connectSocket = () => {
      try {
        setConnectionStatus("connecting");

        const token = getToken();
        console.log(
          "🔑 Token for WebSocket connection:",
          token ? "Present" : "Missing"
        );
        console.log("👤 User ID:", user.id);
        console.log(
          "🌐 Backend URL:",
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
        );

        if (!token) {
          setError("No authentication token found");
          setConnectionStatus("error");
          return;
        }

        const baseUrl =
          `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "")}` ||
          "http://localhost:5000";
        console.log("🔌 Attempting to connect to:", `${baseUrl}`);

        const newSocket = io(baseUrl, {
          path: "/api/chats/socket.io",
          query: {
            token: token,
            userId: user.id,
          },
          auth: {
            token: token,
            userId: user.id,
          },
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: `Bearer ${token}`,
              },
            },
            websocket: {
              extraHeaders: {
                Authorization: `Bearer ${token}`,
              },
            },
          },
          transports: ["websocket", "polling"],
          timeout: 10000,
          forceNew: true,
        });

        // Connection events
        newSocket.on("connect", () => {
          console.log("✅ Connected to chat server");
          setIsConnected(true);
          setConnectionStatus("connected");
          setError(null);
          setReconnectAttempts(0);
          toast.success("Connected to chat");
        });

        newSocket.on("connected", (data) => {
          console.log("🔌 Connection confirmed:", data);
          // Automatically get online users
          newSocket.emit("getUsersOnline", {});
        });

        newSocket.on("disconnect", (reason) => {
          console.log("❌ Disconnected from chat server:", reason);
          setIsConnected(false);
          setConnectionStatus("disconnected");

          // Attempt reconnection if not intentional disconnect
          if (reason === "io server disconnect") {
            setError("Server disconnected the connection");
            setConnectionStatus("error");
          } else if (reconnectAttempts < maxReconnectAttempts) {
            setError("Connection lost. Attempting to reconnect...");
            reconnectTimeoutRef.current = setTimeout(
              () => {
                setReconnectAttempts((prev) => prev + 1);
              },
              2000 * Math.pow(2, reconnectAttempts)
            );
          } else {
            setError("Failed to reconnect after multiple attempts");
            setConnectionStatus("error");
          }
        });

        newSocket.on("connect_error", (err: any) => {
          console.error("❌ Connection error:", err);
          console.error(
            "❌ Error details:",
            err.message,
            err.description,
            err.context,
            err.type
          );
          setError(`Connection failed: ${err.message}`);
          setIsConnected(false);
          setConnectionStatus("error");
        });

        // Message events based on actual gateway implementation
        newSocket.on("receiveMessage", (messageData) => {
          console.log("📨 Received direct message:", messageData);
          const message: Message = {
            id: messageData.messageId || `msg_${Date.now()}`,
            content: messageData.content || messageData.text,
            senderId: messageData.senderId,
            recipientId: user?.id,
            timestamp: messageData.timestamp,
            isOwn: messageData.senderId === user?.id,
            status: "delivered",
            sender: {
              id: messageData.senderId,
              firstName:
                messageData.sender?.firstName ||
                messageData.sender?.split(" ")[0] ||
                "",
              lastName:
                messageData.sender?.lastName ||
                messageData.sender?.split(" ")[1] ||
                "",
              email: messageData.sender?.email || "",
              avatar: messageData.sender?.avatar,
              name: messageData.sender?.name || messageData.sender,
            },
          };

          setMessages((prev) => {
            // Check if we already have this message (e.g., from optimistic update)
            const exists = prev.some(
              (msg) =>
                msg.id === message.id ||
                (msg.content === message.content &&
                  msg.senderId === message.senderId &&
                  Math.abs(
                    new Date(msg.timestamp).getTime() -
                      new Date(message.timestamp).getTime()
                  ) < 5000)
            );

            if (!exists) {
              if (!message.isOwn) {
                toast.success(`New message from ${message.sender?.name}`);
              }
              return [...prev, message];
            }
            return prev;
          });
        });

        newSocket.on("receiveGroupMessage", (messageData) => {
          console.log("📨 Received group message:", messageData);
          const message: Message = {
            id: messageData.messageId || `msg_${Date.now()}`,
            content: messageData.content,
            senderId: messageData.senderId,
            groupId: messageData.groupId,
            timestamp: messageData.timestamp,
            isOwn: messageData.senderId === user.id,
            status: "delivered",
            sender: {
              id: messageData.senderId,
              name: messageData.sender,
              firstName: messageData.sender?.split(" ")[0] || "",
              lastName: messageData.sender?.split(" ")[1] || "",
              email: "",
            },
          };
          setMessages((prev) => [...prev, message]);
          if (!message.isOwn) {
            toast.success(`New group message from ${messageData.sender}`);
          }
        });

        newSocket.on("messagesReceived", (data) => {
          console.log("📚 Received message history:", data);
          const processedMessages = data.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            recipientId: msg.recipientId,
            groupId: msg.groupId,
            timestamp: msg.createdAt || msg.timestamp,
            isOwn: msg.senderId === user.id,
            status: "delivered",
            sender: msg.sender,
          }));
          setMessages(processedMessages);
        });

        // Message status events
        newSocket.on("messageSent", (data) => {
          console.log("✅ Message sent confirmation:", data);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id.startsWith("temp_") &&
              msg.recipientId === data.targetUserId
                ? {
                    ...msg,
                    id: data.messageId,
                    status: data.status === "delivered" ? "delivered" : "sent",
                  }
                : msg
            )
          );
        });

        newSocket.on("messageStatus", (data) => {
          console.log("📊 Message status update:", data);
          if (data.status === "saved") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id.startsWith("temp_") || msg.id === data.messageId
                  ? { ...msg, id: data.messageId, status: "sent" }
                  : msg
              )
            );
          }
        });

        // Group events
        newSocket.on("groupCreated", (groupData) => {
          console.log("🏠 Group created:", groupData);
          setConversations((prev) => [...prev, groupData]);
          toast.success(`Group "${groupData.name}" created successfully`);
        });

        newSocket.on("userLeftGroup", (data) => {
          console.log("👋 User left group:", data);
          toast.info(`${data.username} left the group`);
        });

        newSocket.on("leftGroup", (data) => {
          console.log("👋 You left group:", data);
          setConversations((prev) => prev.filter((g) => g.id !== data.groupId));
          toast.info("You left the group");
        });

        // User status events
        newSocket.on("onlineUsersReceived", (data) => {
          console.log("👥 Online users received:", data);
          setOnlineUsers(data.onlineUsers);
        });

        // Typing events
        newSocket.on("userTyping", (data) => {
          console.log("⌨️ User typing:", data);
          if (data.userId !== user.id && data.isTyping) {
            setTypingUsers((prev) => {
              const filtered = prev.filter((t) => t.userId !== data.userId);
              return [
                ...filtered,
                {
                  userId: data.userId,
                  username: data.username,
                  groupId: data.groupId,
                  targetUserId: data.fromUserId,
                },
              ];
            });

            // Clear typing after 3 seconds
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setTypingUsers((prev) =>
                prev.filter((t) => t.userId !== data.userId)
              );
            }, 3000);
          } else if (!data.isTyping) {
            setTypingUsers((prev) =>
              prev.filter((t) => t.userId !== data.userId)
            );
          }
        });

        // Read receipts
        newSocket.on("messagesMarkedAsRead", (data) => {
          console.log("👁️ Messages marked as read:", data);
          setMessages((prev) =>
            prev.map((msg) =>
              data.messageIds.includes(msg.id)
                ? { ...msg, status: "read" }
                : msg
            )
          );
        });

        // Error events
        newSocket.on("error", (error: any) => {
          console.error("❌ Socket error:", error);
          setError(error.message || "An error occurred");
          toast.error(error.message || "Chat error occurred");
        });

        setSocket(newSocket);

        return () => {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          if (newSocket) {
            newSocket.off("connect");
            newSocket.off("connected");
            newSocket.off("disconnect");
            newSocket.off("connect_error");
            newSocket.off("receiveMessage");
            newSocket.off("receiveGroupMessage");
            newSocket.off("messagesReceived");
            newSocket.off("messageSent");
            newSocket.off("messageStatus");
            newSocket.off("groupCreated");
            newSocket.off("userLeftGroup");
            newSocket.off("leftGroup");
            newSocket.off("onlineUsersReceived");
            newSocket.off("userTyping");
            newSocket.off("messagesMarkedAsRead");
            newSocket.off("error");
            newSocket.disconnect();
          }
        };
      } catch (err) {
        console.error("❌ Failed to initialize socket:", err);
        setError("Failed to initialize chat connection");
        setConnectionStatus("error");
      }
    };

    return connectSocket();
  }, [user?.id, reconnectAttempts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket]);

  // Update the sendMessage function
  const sendMessage = useCallback(
    async (
      content: string,
      targetUserId?: string,
      options?: MessageOptions
    ): Promise<void> => {
      if (!socket || !isConnected) {
        throw new Error("Not connected to chat server");
      }

      try {
        const messageData = {
          content,
          targetUserId,
          ...options,
        };

        // Create optimistic message
        const optimisticMessage: Message = {
          id: `temp_${Date.now()}`,
          content,
          senderId: user?.id || "",
          recipientId: targetUserId,
          timestamp: new Date().toISOString(),
          isOwn: true,
          status: "sending",
          sender: {
            id: user?.id || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            name:
              `${user?.firstName} ${user?.lastName}`.trim() || "Unknown User",
          },
        };

        // Add optimistic message to state
        setMessages((prev) => [...prev, optimisticMessage]);

        // Send via WebSocket
        socket.emit("sendMessage", messageData);

        // Also send via API for persistence
        try {
          const apiResponse = await apiSendMessage(
            content,
            targetUserId,
            options
          );

          // Update message status based on API response
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === optimisticMessage.id
                ? {
                    ...msg,
                    id: apiResponse.data?.id || msg.id,
                    status: "sent",
                  }
                : msg
            )
          );

          // Update conversations
          setConversations((prev) => {
            const conversationId = targetUserId
              ? `direct_${targetUserId}`
              : `group_${options?.groupId}`;
            return prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: content,
                    timestamp: new Date().toISOString(),
                  }
                : c
            );
          });
        } catch (apiError) {
          console.warn("API send failed, but WebSocket sent:", apiError);
          // Update message status to error if API call fails
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === optimisticMessage.id
                ? { ...msg, status: "error" }
                : msg
            )
          );
        }
      } catch (error) {
        console.error("❌ Failed to send message:", error);
        // Update failed message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id.startsWith("temp_") && msg.content === content
              ? { ...msg, status: "error" }
              : msg
          )
        );
        throw error;
      }
    },
    [socket, isConnected, user, setMessages, setConversations]
  );

  const sendDirectMessage = useCallback(
    async (content: string, recipientId: string): Promise<void> => {
      await sendMessage(content, recipientId);
    },
    [sendMessage]
  );

  const sendGroupMessage = useCallback(
    async (content: string, groupId: string): Promise<void> => {
      await sendMessage(content, undefined, { groupId });
    },
    [sendMessage]
  );

  const getMessages = useCallback(
    async (conversationId: string, limit = 50, offset = 0): Promise<void> => {
      try {
        const response = await getConversationMessages(
          conversationId,
          limit,
          offset
        );
        if (response.success) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Failed to get messages:", error);
        toast.error("Failed to load messages");
      }
    },
    [setMessages]
  );

  const createGroup = useCallback(
    async (name: string, memberIds: string[], description?: string) => {
      if (!socket || !isConnected) {
        throw new Error("Not connected to chat server");
      }

      socket.emit("createGroup", {
        name,
        memberIds,
        description,
      });
    },
    [socket, isConnected]
  );

  const joinGroup = useCallback(
    (groupId: string) => {
      if (!socket || !isConnected) {
        console.warn("Cannot join group: not connected to chat server");
        return;
      }

      socket.emit("joinGroup", { groupId });
    },
    [socket, isConnected]
  );

  const leaveGroup = useCallback(
    async (groupId: string) => {
      if (!socket || !isConnected) {
        throw new Error("Not connected to chat server");
      }

      socket.emit("leaveGroup", { groupId });
    },
    [socket, isConnected]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const startTyping = useCallback(
    (targetUserId?: string, groupId?: string) => {
      if (!socket || !isConnected) return;

      socket.emit("typing", {
        targetUserId,
        groupId,
        isTyping: true,
      });
    },
    [socket, isConnected]
  );

  const stopTyping = useCallback(
    (targetUserId?: string, groupId?: string) => {
      if (!socket || !isConnected) return;

      socket.emit("typing", {
        targetUserId,
        groupId,
        isTyping: false,
      });
    },
    [socket, isConnected]
  );

  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!socket || !isConnected) {
        throw new Error("Not connected to chat server");
      }

      socket.emit("markAsRead", { messageIds });
    },
    [socket, isConnected]
  );

  const getOnlineUsers = useCallback(
    (userIds?: string[]) => {
      if (!socket || !isConnected) {
        console.warn("Cannot get online users: not connected to chat server");
        return;
      }

      socket.emit("getUsersOnline", { userIds });
    },
    [socket, isConnected]
  );

  return {
    isConnected,
    connectionStatus,
    messages,
    conversations,
    onlineUsers,
    typingUsers,
    error,
    sendMessage,
    sendDirectMessage,
    sendGroupMessage,
    getMessages,
    clearMessages,
    startTyping,
    stopTyping,
    markAsRead,
    getOnlineUsers,
  };
}
