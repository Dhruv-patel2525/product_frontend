import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateUser } from '@/lib/api/user';
import { User } from '@/lib/types/auth';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: Partial<User> }) =>
      updateUser(userId, data),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};