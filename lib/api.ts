import { getToken } from "./auth-utils";
import {
  MessageCandidateData,
  ScheduleInterviewData,
  RejectApplicationData,
  CandidateProfile,
} from "@/types/application-actions";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============= JOB APPLICATION MANAGEMENT =============

export const shortlistCandidate = async (
  jobId: string,
  applicationId: string,
  message?: string
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/shortlist`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to shortlist candidate");
  }

  return response.json();
};

export const rejectApplication = async (
  jobId: string,
  applicationId: string,
  data: RejectApplicationData
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reject application");
  }

  return response.json();
};

export const scheduleInterview = async (
  jobId: string,
  applicationId: string,
  interviewData: ScheduleInterviewData
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/schedule-interview`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interviewData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to schedule interview");
  }

  return response.json();
};

export const messageCandidate = async (
  jobId: string,
  applicationId: string,
  messageData: MessageCandidateData
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/message`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const getCandidateProfile = async (
  userId: string
): Promise<CandidateProfile> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch candidate profile");
  }

  return response.json();
};

// ============= CHAT MANAGEMENT =============

export const getConversations = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const data = await response.json();
  console.log("CHATS RESPONSE", data);
  return data;
};

export const getConversationMessages = async (
  conversationId: string,
  limit = 50,
  offset = 0
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/chats/${conversationId}?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversation messages");
  }

  const data = await response.json();
  console.log("CHATS ARE RETRIEVED =======>", data);
  return data;
};

export async function sendMessage(
  content: string,
  targetUserId?: string,
  options?: {
    attachments?: string[];
    metadata?: any;
    replyTo?: string;
    groupId?: string;
  }
) {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      content,
      targetUserId,
      ...options,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send message");
  }

  return {
    success: true,
    data,
  };
}

export async function sendDirectMessage(targetUserId: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      content,
      targetUserId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send direct message");
  }

  return {
    success: true,
    data,
  };
}

export const createChatGroup = async (
  name: string,
  members: string[],
  description?: string
) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chats/groups`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      members,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create group");
  }

  return response.json();
};

export const getUserGroups = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chats/groups`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }

  return response.json();
};

export async function getUsers(options?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.role) params.append("role", options.role);
  if (options?.search) params.append("search", options.search);

  const response = await fetch(
    `${API_BASE_URL}/users${params.toString() ? `?${params.toString()}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get users");
  }

  return data;
}
