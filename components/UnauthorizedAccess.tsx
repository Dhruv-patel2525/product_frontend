"use client";

import { useRouter } from "next/navigation";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface UnauthorizedAccessProps {
  resource?: string; // "organization", "product", etc.
  action?: string; // "view", "edit", etc.
}

export function UnauthorizedAccess({
  resource = "resource",
  action = "access"
}: UnauthorizedAccessProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockClosedIcon className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to {action} this {resource}.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}