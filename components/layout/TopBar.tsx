"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuthTokens } from '@/lib/auth-storage';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/hooks/useUser';
import { getUserInitials } from '@/lib/utils/user';

interface TopBarProps {
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

export default function TopBar({ breadcrumbItems = [] }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading: userLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitials = user ? getUserInitials(user) : 'U';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    clearAuthTokens();
    router.push('/login');
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/profile');
  };

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PB</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">ProductBoard</span>
        </Link>

        {/* Breadcrumb - hidden on mobile */}
        <div className="flex-1 px-6 hidden md:block">
          {breadcrumbItems.length > 0 && (
            <Breadcrumb items={breadcrumbItems} />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {pathname === '/dashboard' && (
            <Button size="sm" className="hidden sm:flex">
              New Organization
            </Button>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {userLoading ? '...' : userInitials}
                </span>
              </div>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile breadcrumb */}
      {breadcrumbItems.length > 0 && (
        <div className="px-4 py-2 border-t md:hidden">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}
    </header>
  );
}