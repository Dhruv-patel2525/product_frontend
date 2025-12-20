"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useGetInvitation, useAcceptInvitation } from "@/lib/hooks/useInvitations";
import { useUser } from "@/lib/hooks/useUser";

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

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { data: user, isLoading: userLoading } = useUser();

  const { data: invitation, isLoading: invitationLoading, error } = useGetInvitation(token || '', !!token);
  const acceptInvitation = useAcceptInvitation(invitation?.org_id.toString() || '');

  const handleAccept = async () => {
    if (!invitation || !user) return;

    try {
      await acceptInvitation.mutateAsync(token!);
      // Redirect to org page after successful acceptance
      router.push(`/orgs/${invitation.org_id}`);
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleRegister = () => {
    // Store the token for post-registration redirect
    sessionStorage.setItem('pendingInviteToken', token!);
    router.push('/register');
  };

  if (invitationLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">
            This invitation link is invalid, expired, or has already been used.
          </p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 max-w-md mx-auto text-center">
        <UsersIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join {invitation.org_name}</h1>
        <p className="text-gray-600 mb-4">
          You&apos;ve been invited to join <strong>{invitation.org_name}</strong> as a <strong>{getRoleDisplayName(invitation.role_name)}</strong>.
        </p>

        {invitation.status === 'ACCEPTED' ? (
          <div>
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-green-600 font-medium mb-4">
              You have already accepted this invitation.
            </p>
            <Button onClick={() => router.push(`/orgs/${invitation.org_id}`)}>
              Go to Organization
            </Button>
          </div>
        ) : invitation.status === 'EXPIRED' ? (
          <div>
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-4">
              This invitation has expired.
            </p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        ) : (
          <div>
            {!user ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Please register or log in to accept this invitation. Use the email address that received the invitation.
                </p>
                <Button onClick={handleRegister} className="w-full mb-2">
                  Register to Accept
                </Button>
                <Button variant="outline" onClick={() => router.push('/login')} className="w-full">
                  Login to Accept
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={handleAccept}
                  disabled={acceptInvitation.isPending}
                  className="w-full mb-4"
                >
                  {acceptInvitation.isPending ? "Accepting..." : "Accept Invitation"}
                </Button>
                {acceptInvitation.isError && (
                  <p className="text-red-600 text-sm">
                    Failed to accept invitation. Please try again.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}