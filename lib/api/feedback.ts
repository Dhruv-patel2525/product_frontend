import { getAuthTokens } from '@/lib/auth-storage';
import { Feedback, CreateFeedbackRequest, FeedbackResponse, CreateFeedbackResponse, VoteResponse } from '@/lib/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  const tokens = getAuthTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (tokens) {
    headers['Authorization'] = `Bearer ${tokens.access_token}`;
  }

  return headers;
};

export const getProductFeedback = async (orgId: string, productId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}/feedback`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch feedback');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch feedback');
  }

  return data;
};

export const createFeedback = async (orgId: string, productId: string, data: CreateFeedbackRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}/feedback`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create feedback');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to create feedback');
  }

  return result;
};

export const updateFeedbackStatus = async (orgId: string, productId: string, feedbackId: string, status: 'NEW' | 'IN_PROGRESS' | 'DONE') => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}/feedback/${feedbackId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update feedback status');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to update feedback status');
  }

  return result;
};

export const voteFeedback = async (orgId: string, productId: string, feedbackId: string, value: boolean) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}/feedback/${feedbackId}/votes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to vote on feedback');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to vote on feedback');
  }

  return result;
};

export const getFeedbackVotes = async (orgId: string, productId: string, feedbackId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}/feedback/${feedbackId}/votes`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to get feedback votes');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to get feedback votes');
  }

  return result;
};