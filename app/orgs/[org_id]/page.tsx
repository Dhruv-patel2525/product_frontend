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
import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function OrgPage() {
  const params = useParams();
  const router = useRouter();
  const orgIdString = params?.org_id as string;
  const orgId = orgIdString ? Number(orgIdString) : undefined;
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'feedback' | 'members'>('overview');
  const [validationTimedOut, setValidationTimedOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // Mobile navigation handler
    const handleMobileNavigation = (view: 'overview' | 'products' | 'feedback' | 'members') => {
      setActiveView(view);
      setIsSidebarOpen(false);
    };

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
      {/* Custom header for mobile navigation */}
      <div className="md:hidden border-b bg-white sticky top-0 z-30">
        <div className="flex h-16 items-center px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarOpen(true)}
            className="mr-4"
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">{currentOrg?.name || 'Organization'}</h1>
        </div>
      </div>

      <TopBar breadcrumbItems={breadcrumbItems} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64">
          <OrgSidebar
            activeView={activeView}
            onViewChange={setActiveView}
            productCount={productCount}
            feedbackCount={feedbackCount}
            memberCount={memberCount}
            canManageMembers={hasManageMembersPermission}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
              <OrgSidebar
                activeView={activeView}
                onViewChange={handleMobileNavigation}
                productCount={productCount}
                feedbackCount={feedbackCount}
                memberCount={memberCount}
                canManageMembers={hasManageMembersPermission}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
}
