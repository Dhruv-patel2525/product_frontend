"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import { useOrganizations } from "@/lib/hooks/useOrganizations";
import { useUser } from "@/lib/hooks/useUser";
import { canManageMembers } from "@/lib/utils/permissions";
import { OrgSidebar } from "@/components/org/OrgSidebar";
import { OrgOverview } from "@/components/org/views/OrgOverview";
import { OrgProducts } from "@/components/org/views/OrgProducts";
import { OrgFeedback } from "@/components/org/views/OrgFeedback";
import { OrgMembers } from "@/components/org/views/OrgMembers";
import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import TopBar from '@/components/layout/TopBar';
import { Organization } from "@/lib/types/auth";

export default function OrgPage() {
  const params = useParams();
  const router = useRouter();
  const orgIdString = params?.org_id as string;
  const orgId = orgIdString ? Number(orgIdString) : undefined;
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'feedback' | 'members'>('overview');
  const [validationTimedOut, setValidationTimedOut] = useState(false);

  // Get organization data
  const { data: organizations, isLoading: orgsLoading, error: orgsError } = useOrganizations();

   // Get user data for permissions
   const { data: user } = useUser();

   // Get products data
   const { data: productsResponse, error: productsError } = useProducts(orgIdString);

   // Immediate validation
   const isInvalidOrgId = !orgIdString || isNaN(Number(orgIdString));
   const orgIdNum = isInvalidOrgId ? null : Number(orgIdString);
   const currentOrg = orgIdNum ? organizations?.find((org: Organization) => org.id === orgIdNum) : null;
   const isUnauthorized = validationTimedOut || (!orgsLoading && orgIdNum && !currentOrg);

   // Timeout for validation (3 seconds)
   useEffect(() => {
     if (orgsLoading) {
       const timer = setTimeout(() => setValidationTimedOut(true), 3000);
       return () => clearTimeout(timer);
     }
   }, [orgsLoading]);

   // Create breadcrumbs
   const breadcrumbItems = [
     { label: 'Dashboard', href: '/dashboard' },
     { label: currentOrg?.name || 'Organization' }
   ];

   // Calculate stats
   const products = productsResponse?.data || [];
   const productCount = products.length;
   const feedbackCount = useMemo(() => {
     // For now, we'll estimate feedback count - in a real app this would come from a dedicated endpoint
     return products.reduce((total: number, product: any) => total + (product.feedback_count || 0), 0);
   }, [products]);

   // Calculate member count and permissions
   const memberCount = useMemo(() => {
     if (!user?.memberships) return 1;
     const activeMemberships = user.memberships.filter(m => m.status === 'ACTIVE');
     return activeMemberships.length;
   }, [user]);

   const hasManageMembersPermission = useMemo(() => {
     return orgIdNum ? canManageMembers(user, orgIdNum) : false;
   }, [user, orgIdNum]);

   // Check for API errors (403, etc.)
   const hasApiError = orgsError || productsError;

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <OrgOverview
            orgName={currentOrg?.name || ''}
            productCount={productCount}
            feedbackCount={feedbackCount}
            memberCount={memberCount}
          />
        );
      case 'products':
        return <OrgProducts orgId={orgIdString} />;
      case 'feedback':
        return <OrgFeedback />;
      case 'members':
        return hasManageMembersPermission ? <OrgMembers orgId={orgIdString} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar breadcrumbItems={breadcrumbItems} />
      <div className="flex">
        {/* Sidebar */}
        <OrgSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          productCount={productCount}
          feedbackCount={feedbackCount}
          memberCount={memberCount}
          canManageMembers={hasManageMembersPermission}
        />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
}
