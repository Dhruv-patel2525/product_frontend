import { getAuthTokens } from '@/lib/auth-storage';
import { InvitationCreate, InvitationRead, InvitationResponse, PendingInvitationsResponse } from '@/lib/types/invitations';

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

export const createInvitation = async (
  orgId: string,
  data: InvitationCreate
): Promise<InvitationRead> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/invites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create invitation');
  }

  const result: InvitationResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to create invitation');
  }

  return result.data!;
};

export const getInvitation = async (token: string): Promise<InvitationRead> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/invites/${token}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }, // No auth for public endpoint
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch invitation');
  }

  const result: InvitationResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to fetch invitation');
  }

  return result.data!;
};

export const acceptInvitation = async (
  orgId: string,
  token: string
): Promise<InvitationRead> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/invites/${token}/accept`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to accept invitation');
  }

  const result: InvitationResponse = await response.json();

   if (!result.success) {
     throw new Error(result.error?.message || 'Failed to accept invitation');
   }

   return result.data!;
};

export const getPendingInvitations = async (orgId: string): Promise<InvitationRead[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/invites/pending`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch pending invitations');
  }

  const result: PendingInvitationsResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to fetch pending invitations');
  }

  return result.data || [];
};