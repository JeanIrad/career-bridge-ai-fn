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
