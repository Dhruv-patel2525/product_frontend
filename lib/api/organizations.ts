import { getAuthTokens } from '@/lib/auth-storage';
import {
  Organization,
  CreateOrgRequest,
  OrganizationsResponse,
  CreateOrgResponse,
  OrgMember,
  OrgMembersResponse
} from '@/lib/types/auth';

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

export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/org`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch organizations');
  }

  const data: OrganizationsResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch organizations');
  }

  return data.data || [];
};

export const createOrganization = async (orgData: CreateOrgRequest): Promise<Organization> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/org`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orgData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create organization');
  }

  const data: CreateOrgResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to create organization');
  }

  if (!data.data) {
    throw new Error('No organization data returned');
  }

  return data.data;
};

export const getOrgMembers = async (orgId: string): Promise<OrgMember[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/members`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch organization members');
  }

  const data: OrgMembersResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch organization members');
  }

  return data.data || [];
};