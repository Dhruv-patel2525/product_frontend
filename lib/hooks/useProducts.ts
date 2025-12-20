import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api/products';
import { getProductFeedback, createFeedback, updateFeedbackStatus, voteFeedback } from '@/lib/api/feedback';
import { CreateProductRequest, CreateFeedbackRequest, Product } from '@/lib/types/auth';

export const useProducts = (orgId: string, params?: { page?: number; limit?: number; q?: string }) => {
  return useQuery({
    queryKey: ['products', orgId, params],
    queryFn: () => getProducts(Number(orgId), params),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: CreateProductRequest }) =>
      createProduct(Number(orgId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, productId, data }: { orgId: string; productId: string; data: Partial<CreateProductRequest> }) =>
      updateProduct(Number(orgId), productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, productId }: { orgId: string; productId: string }) =>
      deleteProduct(Number(orgId), productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};