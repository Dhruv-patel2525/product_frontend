import { User } from '@/lib/types/auth';

/**
 * Check if a user has a specific permission for an organization
 */
export const hasOrgPermission = (user: User | undefined, orgId: number, permission: string): boolean => {
  if (!user || !user.memberships) {
    return false;
  }

  const membership = user.memberships.find(m => m.org_id === orgId && m.status === 'ACTIVE');
  if (!membership) {
    return false;
  }

  return membership.role.permissions.includes(permission);
};

/**
 * Check if user can manage members for an org
 */
export const canManageMembers = (user: User | undefined, orgId: number): boolean => {
  return hasOrgPermission(user, orgId, 'org.manage_members');
};