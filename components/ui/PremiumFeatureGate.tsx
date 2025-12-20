"use client";

import { ReactNode } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface PremiumFeatureGateProps {
  children: ReactNode;
  feature?: string;
  className?: string;
}

export function PremiumFeatureGate({
  children,
  feature = "Premium Feature",
  className = ""
}: PremiumFeatureGateProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Overlay to disable interactions */}
      <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-md z-10 flex items-center justify-center">
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          <LockClosedIcon className="h-4 w-4" />
          {feature}
        </div>
      </div>

      {/* Render the original component but make it visually disabled */}
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

// Convenience component for premium buttons
interface PremiumButtonProps {
  children: ReactNode;
  feature?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function PremiumButton({
  children,
  feature,
  className = "",
  variant = "default",
  size = "default"
}: PremiumButtonProps) {
  return (
    <PremiumFeatureGate feature={feature} className={className}>
      <Button variant={variant} size={size}>
        {children}
      </Button>
    </PremiumFeatureGate>
  );
}