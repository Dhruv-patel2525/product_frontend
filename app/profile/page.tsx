"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TopBar from '@/components/layout/TopBar';
import UserProfileView from '@/components/profile/UserProfileView';
import UserProfileEdit from '@/components/profile/UserProfileEdit';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar breadcrumbItems={breadcrumbItems} />

      <main className="py-8">
        {/* Header with Edit Toggle */}
        <div className="max-w-2xl mx-auto px-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Profile' : 'My Profile'}
            </h1>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'outline' : 'default'}
              className={isEditing ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        {isEditing ? <UserProfileEdit /> : <UserProfileView />}
      </main>
    </div>
  );
}