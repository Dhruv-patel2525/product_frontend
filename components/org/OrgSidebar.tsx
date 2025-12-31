"use client";

import { ChartBarIcon, CubeIcon, ChatBubbleLeftRightIcon, UsersIcon } from "@heroicons/react/24/outline";
import { PremiumFeatureGate } from "@/components/ui/PremiumFeatureGate";

interface OrgSidebarProps {
  activeView: 'overview' | 'products' | 'feedback' | 'members';
  onViewChange: (view: 'overview' | 'products' | 'feedback' | 'members') => void;
  productCount?: number;
  feedbackCount?: number;
  memberCount?: number;
  canManageMembers?: boolean;
}

export function OrgSidebar({ activeView, onViewChange, productCount = 0, feedbackCount = 0, memberCount = 0, canManageMembers = false }: OrgSidebarProps) {
  const navigationItems: Array<{
    id: 'overview' | 'products' | 'feedback' | 'members';
    label: string;
    icon: any;
    count: number | null;
    premium: boolean;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: ChartBarIcon,
      count: null,
      premium: false,
    },
    {
      id: 'products',
      label: 'Products',
      icon: CubeIcon,
      count: productCount,
      premium: false,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: ChatBubbleLeftRightIcon,
      count: feedbackCount,
      premium: false,
    },
  ];

  // Add members tab only if user can manage members
  if (canManageMembers) {
    navigationItems.splice(2, 0, {
      id: 'members',
      label: 'Members',
      icon: UsersIcon,
      count: memberCount,
      premium: false,
    });
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          const buttonContent = (
            <button
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.count !== null && (
                <span className={`inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 text-xs font-medium rounded-full ${
                  isActive
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );

          if (item.premium) {
            return (
              <PremiumFeatureGate key={item.id} feature="Premium Feature">
                {buttonContent}
              </PremiumFeatureGate>
            );
          }

          return (
            <div key={item.id}>
              {buttonContent}
            </div>
          );
        })}
      </nav>
    </div>
  );
}