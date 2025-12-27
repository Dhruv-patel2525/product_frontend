import { useMutation } from '@tanstack/react-query';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/lib/types/auth';
import { setAuthTokens } from '@/lib/auth-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest): Promise<RegisterResponse> => {
      const response = await fetch(`/api/v1/auth/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Registration failed');
      }

      return result;
    },
  });
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await fetch(`/api/v1/auth/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Login failed');
      }

      return result;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        setAuthTokens(data.data);
      }
    }
  });
};