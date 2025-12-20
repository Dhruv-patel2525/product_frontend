"use client";

import { useUser } from '@/lib/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserInitials } from '@/lib/utils/user';

export default function UserProfileView() {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Profile...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading profile: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              User not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitials = getUserInitials(user);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-700">
                {userInitials}
              </span>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                {user.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                {user.username}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}