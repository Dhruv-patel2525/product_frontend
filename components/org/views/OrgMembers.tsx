"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon, PlusIcon, EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCreateInvitation } from "@/lib/hooks/useInvitations";
import { usePendingInvitations } from "@/lib/hooks/useInvitations";
import { useOrgMembers } from "@/lib/hooks/useOrganizations";

const getRoleDisplayName = (roleKey?: string): string => {
  const roleMap: Record<string, string> = {
    'OWNER': 'Owner',
    'ADMIN': 'Admin',
    'PRODUCT_MANAGER': 'Product Manager',
    'CONTRIBUTOR': 'Contributor',
    'VIEWER': 'Viewer',
  };
  return roleMap[roleKey || ''] || 'Member';
};

interface OrgMembersProps {
  orgId: string;
}

export function OrgMembers({ orgId }: OrgMembersProps) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const createInvitation = useCreateInvitation(orgId);
  const { data: pendingInvites, isLoading: invitesLoading, error: invitesError } = usePendingInvitations(orgId);
  const { data: members, isLoading: membersLoading, error: membersError } = useOrgMembers(orgId);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await createInvitation.mutateAsync({
        email: email.trim(),
        role_id: roleId ? parseInt(roleId) : undefined,
      });
      setEmail("");
      setRoleId("");
    } catch (error) {
      console.error("Failed to create invitation:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your organization&apos;s team and invitations</p>
        </div>
      </div>

      {/* Invite Form */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <PlusIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Invite New Member</h2>
        </div>

        <form onSubmit={handleCreateInvitation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a role</option>
                <option value="1">Owner</option>
                <option value="2">Admin</option>
                <option value="3">Product Manager</option>
                <option value="4">Contributor</option>
                <option value="5">Viewer</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createInvitation.isPending}
            className="flex items-center gap-2"
          >
            <EnvelopeIcon className="h-4 w-4" />
            {createInvitation.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </form>

        {createInvitation.isError && (
          <p className="text-red-600 text-sm mt-2">
            Failed to send invitation. Please try again.
          </p>
        )}

        {createInvitation.isSuccess && (
          <p className="text-green-600 text-sm mt-2">
            Invitation sent successfully!
          </p>
        )}
      </Card>

      {/* Pending Invitations */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Pending Invitations</h2>
        </div>

        {invitesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading invitations...</p>
          </div>
        ) : invitesError ? (
          <div className="text-center py-8 text-red-600">
            <p>Failed to load pending invitations</p>
          </div>
        ) : pendingInvites && pendingInvites.length > 0 ? (
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{invite.email}</p>
                  <p className="text-sm text-gray-600">{getRoleDisplayName(invite.role_name)} • Invited {new Date(invite.invited_at).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm">
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No pending invitations</p>
            <p className="text-xs mt-1">Invitations will appear here once sent</p>
          </div>
        )}
      </Card>

      {/* Current Members */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Current Members</h2>
          {members && <span className="ml-2 text-sm text-gray-500">({members.length})</span>}
        </div>

        {membersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading members...</p>
          </div>
        ) : membersError ? (
          <div className="text-center py-8 text-red-600">
            <p>Failed to load members</p>
          </div>
        ) : members && members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-700">
                      {member.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-gray-600">{member.user.username} • {getRoleDisplayName(member.user.memberships?.find(m => m.org_id === parseInt(orgId))?.role.key)} • Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No members found</p>
            <p className="text-xs mt-1">Members will appear here once they join</p>
          </div>
        )}
      </Card>
    </div>
  );
}