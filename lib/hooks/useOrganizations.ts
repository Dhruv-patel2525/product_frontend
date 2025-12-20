import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrganizations, createOrganization, getOrgMembers } from '@/lib/api/organizations';
import { CreateOrgRequest, Organization, OrgMember } from '@/lib/types/auth';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<Organization, Error, CreateOrgRequest>({
    mutationFn: createOrganization,
    onSuccess: () => {
      // Invalidate and refetch organizations
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useOrgMembers = (orgId: string) => {
  return useQuery({
    queryKey: ['orgMembers', orgId],
    queryFn: () => getOrgMembers(orgId),
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