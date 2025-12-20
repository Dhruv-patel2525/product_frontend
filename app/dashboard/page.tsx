"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizations } from '@/lib/hooks/useOrganizations';
import TopBar from '@/components/layout/TopBar';
import OrganizationCard from '@/components/OrganizationCard';
import CreateOrganizationModal from '@/components/CreateOrganizationModal';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardContent() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const router = useRouter();
  const { data: organizations, isLoading, error } = useOrganizations();

  const handleOrganizationClick = (orgId: string) => {
    router.push(`/orgs/${orgId}`);
  };

  const breadcrumbItems = [
    { label: 'Dashboard' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar breadcrumbItems={breadcrumbItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar breadcrumbItems={breadcrumbItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load organizations</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar breadcrumbItems={breadcrumbItems} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-lg text-gray-600">
            Manage your organizations and their products.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {organizations?.length || 0}
                </h3>
                <p className="text-sm text-gray-600">Organizations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Section */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
              <Button onClick={() => setCreateModalOpen(true)}>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Organization
              </Button>
            </div>
          </div>

          <div className="p-6">
            {!organizations || organizations.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first organization.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setCreateModalOpen(true)}>
                    Create Organization
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    organization={org}
                     onClick={() => handleOrganizationClick(org.id.toString())}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateOrganizationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}