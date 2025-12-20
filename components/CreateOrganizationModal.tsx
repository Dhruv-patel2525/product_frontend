"use client";

import { useState } from 'react';
import { useCreateOrganization } from '@/lib/hooks/useOrganizations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateOrganizationModal({ open, onOpenChange }: CreateOrganizationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const createOrg = useCreateOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrg.mutateAsync({ name, email });
      setName('');
      setEmail('');
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to create organization:', error);
    }
  };

  const handleClose = () => {
    if (!createOrg.isPending) {
      setName('');
      setEmail('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to manage your products and gather feedback.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="org-name" className="text-sm font-medium">
              Organization Name
            </label>
            <input
              id="org-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Company"
              required
              disabled={createOrg.isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="org-email" className="text-sm font-medium">
              Contact Email
            </label>
            <input
              id="org-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@company.com"
              required
              disabled={createOrg.isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {createOrg.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {createOrg.error.message}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createOrg.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOrg.isPending || !name.trim() || !email.trim()}
            >
              {createOrg.isPending ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}