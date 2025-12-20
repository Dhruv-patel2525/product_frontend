"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProductFeedback, useVoteFeedback, useCreateFeedback } from "@/lib/hooks/useFeedback";
import { FeedbackSummaryItem } from "./FeedbackSummaryItem";
import { CreateFeedbackRequest } from "@/lib/types/auth";

interface ProductCardProps {
  orgId: string;
  product: {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
  };
}

export function ProductCard({ orgId, product }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateFeedback, setShowCreateFeedback] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");

  const { data: feedback, isLoading: feedbackLoading } = useProductFeedback(orgId, product.id.toString());
  const voteMutation = useVoteFeedback();
  const createFeedbackMutation = useCreateFeedback();

  const handleVote = async (feedbackId: string, value: boolean) => {
    try {
      await voteMutation.mutateAsync({
        orgId,
        productId: product.id.toString(),
        feedbackId,
        value,
      });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackDescription.trim()) return;

    try {
      await createFeedbackMutation.mutateAsync({
        orgId,
        productId: product.id.toString(),
        data: {
          title: feedbackTitle,
          description: feedbackDescription,
        } as CreateFeedbackRequest,
      });

      setFeedbackTitle("");
      setFeedbackDescription("");
      setShowCreateFeedback(false);
    } catch (error) {
      console.error("Failed to create feedback:", error);
    }
  };

  const activeFeedbackCount = feedback?.data?.length || 0;

  return (
    <Card className={`transition-all duration-200 ${!product.is_active ? 'opacity-60 bg-gray-50' : 'bg-white hover:shadow-md'}`}>
      <div className="p-6">
        {/* Product Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            {!product.is_active && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Inactive
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeFeedbackCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>{activeFeedbackCount} feedback{activeFeedbackCount !== 1 ? 's' : ''}</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Create Feedback Section */}
        {isExpanded && product.is_active && (
          <div className="mb-4">
            {!showCreateFeedback ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateFeedback(true)}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Feedback
              </Button>
            ) : (
              <form onSubmit={handleCreateFeedback} className="space-y-3 border rounded-lg p-4 bg-gray-50">
                <div>
                  <input
                    type="text"
                    placeholder="Feedback title"
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Describe your feedback..."
                    value={feedbackDescription}
                    onChange={(e) => setFeedbackDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createFeedbackMutation.isPending}
                  >
                    {createFeedbackMutation.isPending ? "Creating..." : "Submit Feedback"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateFeedback(false);
                      setFeedbackTitle("");
                      setFeedbackDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Feedback List */}
        {isExpanded && (
          <div className="space-y-3">
            {feedbackLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm">Loading feedback...</p>
              </div>
            ) : feedback?.data && feedback.data.length > 0 ? (
              feedback.data.map((item: any) => (
                <FeedbackSummaryItem
                  key={item.id}
                  feedback={item}
                  onVote={(value: boolean) => handleVote(item.id.toString(), value)}
                  isVoting={voteMutation.isPending}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChatBubbleLeftIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No feedback yet</p>
                <p className="text-xs mt-1">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}