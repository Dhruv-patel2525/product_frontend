import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductFeedback, createFeedback, updateFeedbackStatus, voteFeedback } from '@/lib/api/feedback';
import { CreateFeedbackRequest } from '@/lib/types/auth';

export const useProductFeedback = (orgId: string, productId: string) => {
  return useQuery({
    queryKey: ['feedback', orgId, productId],
    queryFn: () => getProductFeedback(orgId, productId),
    enabled: !!orgId && !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, productId, data }: { orgId: string; productId: string; data: CreateFeedbackRequest }) =>
      createFeedback(orgId, productId, data),
    onSuccess: (_, { orgId, productId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', orgId, productId] });
      queryClient.invalidateQueries({ queryKey: ['products', orgId] });
    },
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, productId, feedbackId, status }: {
      orgId: string;
      productId: string;
      feedbackId: string;
      status: 'NEW' | 'IN_PROGRESS' | 'DONE'
    }) =>
      updateFeedbackStatus(orgId, productId, feedbackId, status),
    onSuccess: (_, { orgId, productId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', orgId, productId] });
      queryClient.invalidateQueries({ queryKey: ['products', orgId] });
    },
  });
};

export const useVoteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, productId, feedbackId, value }: {
      orgId: string;
      productId: string;
      feedbackId: string;
      value: boolean;
    }) =>
      voteFeedback(orgId, productId, feedbackId, value),
    onSuccess: (_, { orgId, productId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', orgId, productId] });
    },
  });
};