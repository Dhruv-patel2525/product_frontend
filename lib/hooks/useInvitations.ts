import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInvitation, getInvitation, acceptInvitation, getPendingInvitations } from '@/lib/api/invitations';
import { InvitationCreate, InvitationRead } from '@/lib/types/invitations';

export const useCreateInvitation = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvitationCreate) => createInvitation(orgId, data),
    onSuccess: () => {
      // Invalidate invitations query to refresh list
      queryClient.invalidateQueries({ queryKey: ['invitations', orgId] });
    },
  });
};

export const useGetInvitation = (token: string, enabled = true) => {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => getInvitation(token),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (invalid token)
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useAcceptInvitation = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => acceptInvitation(orgId, token),
    onSuccess: () => {
      // Invalidate user data and org data after acceptance
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const usePendingInvitations = (orgId: string) => {
  return useQuery({
    queryKey: ['pendingInvitations', orgId],
    queryFn: () => getPendingInvitations(orgId),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};