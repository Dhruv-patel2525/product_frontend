"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { PremiumFeatureGate } from "@/components/ui/PremiumFeatureGate";
import { Button } from "@/components/ui/button";

export function OrgFeedback() {
  return (
    <PremiumFeatureGate feature="Premium Feature">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Feedback</h1>
            <p className="text-gray-600 mt-1">View and manage all feedback across your products</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4" />
              Filter
            </Button>
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Feedback List Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-8 text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FunnelIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Feedback Management</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Unlock premium features to view all feedback across products, advanced filtering,
              bulk actions, and detailed analytics.
            </p>
          </div>
        </div>

        {/* Premium Features Teaser */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Features Include:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-600 rounded-full"></div>
              View all feedback across all products in one place
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-600 rounded-full"></div>
              Advanced filtering by status, product, date, and priority
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-600 rounded-full"></div>
              Bulk actions for managing multiple feedback items
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-600 rounded-full"></div>
              Detailed analytics and reporting
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-600 rounded-full"></div>
              Priority scoring and smart categorization
            </li>
          </ul>
        </div>
      </div>
    </PremiumFeatureGate>
  );
}