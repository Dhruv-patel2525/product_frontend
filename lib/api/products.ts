import { getAuthTokens } from '@/lib/auth-storage';
import { Product, CreateProductRequest, Feedback, CreateFeedbackRequest } from '@/lib/types/auth';

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

export const getProducts = async (orgId: number, params?: { page?: number; limit?: number; q?: string }) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.q) queryParams.set('q', params.q);

  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch products');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch products');
  }

  return data;
};

export const createProduct = async (orgId: number, data: CreateProductRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create product');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to create product');
  }

  return result;
};

export const updateProduct = async (orgId: number, productId: string, data: Partial<CreateProductRequest>) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update product');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to update product');
  }

  return result;
};

export const deleteProduct = async (orgId: number, productId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orgs/${orgId}/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete product');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to delete product');
  }

  return result;
};