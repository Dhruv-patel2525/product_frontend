import { getAuthTokens } from '@/lib/auth-storage';
import { User } from '@/lib/types/auth';

const API_BASE_URL = '';

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

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/user/users/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch user profile');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch user profile');
  }

  return data.data;
};

export const updateUser = async (userId: number, data: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/user/users/${userId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update user profile');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to update user profile');
  }

  return result.data;
};