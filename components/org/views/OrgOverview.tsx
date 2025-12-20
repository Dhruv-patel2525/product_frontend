"use client";

import { ChartBarIcon, CubeIcon, ChatBubbleLeftRightIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";

interface OrgOverviewProps {
  orgName: string;
  productCount: number;
  feedbackCount: number;
  memberCount?: number;
}

export function OrgOverview({ orgName, productCount, feedbackCount, memberCount = 1 }: OrgOverviewProps) {
  const stats = [
    {
      label: 'Products',
      value: productCount,
      icon: CubeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Feedback Items',
      value: feedbackCount,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Team Members',
      value: memberCount,
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to {orgName}</h1>
        <p className="text-blue-100">
          Manage your products, collect feedback, and collaborate with your team.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>

        <div className="space-y-3">
          {productCount === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CubeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No products yet</p>
              <p className="text-xs mt-1">Create your first product to get started!</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Activity feed coming soon</p>
              <p className="text-xs mt-1">Track product updates and feedback in real-time</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <CubeIcon className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-600">Create and configure a new product</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer opacity-50">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">View All Feedback</h3>
            <p className="text-sm text-gray-600">Browse and manage all feedback (Premium)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}