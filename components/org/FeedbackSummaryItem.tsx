"use client";

import { useState } from "react";
import { HandThumbUpIcon, SparklesIcon, ArrowPathIcon, ChevronUpIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Feedback, ArtifactResponse } from "@/lib/types/auth";
import { useFeedbackAISummary } from "@/lib/hooks/useFeedback";

interface FeedbackSummaryItemProps {
  feedback: Feedback;
  onVote: (value: boolean) => void;
  isVoting: boolean;
  orgId: string;
  productId: string;
}

export function FeedbackSummaryItem({ feedback, onVote, isVoting, orgId, productId }: FeedbackSummaryItemProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<ArtifactResponse | null>(null);

  const aiSummaryMutation = useFeedbackAISummary();

  const handleGenerateSummary = async (force: boolean = false) => {
    try {
      const result = await aiSummaryMutation.mutateAsync({
        orgId,
        productId,
        feedbackId: feedback.id.toString(),
        force,
      });
      if (result.data) {
        setSummary(result.data);
        setShowSummary(true);
      }
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{feedback.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
            {getStatusLabel(feedback.status)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onVote(true)}
            disabled={isVoting}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
              isVoting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-50 hover:text-green-700 text-gray-600'
            }`}
          >
            <HandThumbUpIcon className="h-4 w-4" />
            <span>{feedback.votes || 0}</span>
          </button>
        </div>

        {/* AI Summary Button */}
        <div className="flex items-center gap-1">
          {!summary ? (
            <button
              onClick={() => handleGenerateSummary(false)}
              disabled={aiSummaryMutation.isPending}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                aiSummaryMutation.isPending
                  ? 'opacity-50 cursor-not-allowed bg-blue-100 text-blue-600'
                  : 'hover:bg-blue-50 hover:text-blue-700 text-blue-600 bg-blue-50'
              }`}
            >
              {aiSummaryMutation.isPending ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="h-4 w-4" />
              )}
              <span>{aiSummaryMutation.isPending ? 'Generating...' : 'AI Summary'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleGenerateSummary(true)}
              disabled={aiSummaryMutation.isPending}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                aiSummaryMutation.isPending
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-600'
                  : 'hover:bg-gray-50 hover:text-gray-700 text-gray-600 bg-gray-50'
              }`}
            >
              {aiSummaryMutation.isPending ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowPathIcon className="h-4 w-4" />
              )}
              <span>{aiSummaryMutation.isPending ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Summary Display */}
      {summary && showSummary && (
        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-900">AI Summary</h4>
            <button
              onClick={() => setShowSummary(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <ChevronUpIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Summary */}
            <div>
              <p className="text-gray-800">{summary.content.summary}</p>
            </div>

            {/* Sentiment */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Sentiment:</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                summary.content.sentiment.label === 'positive' ? 'bg-green-100 text-green-800' :
                summary.content.sentiment.label === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {summary.content.sentiment.label} ({Math.round(summary.content.sentiment.confidence * 100)}%)
              </span>
            </div>

            {/* Pain Level */}
            <div>
              <span className="font-medium text-gray-700">Pain Level:</span>
              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                summary.content.pain_level.label === 'high' ? 'bg-red-100 text-red-800' :
                summary.content.pain_level.label === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {summary.content.pain_level.label}
              </span>
              <p className="text-gray-600 mt-1">{summary.content.pain_level.reason}</p>
            </div>

            {/* Key Requests */}
            {summary.content.key_requests.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Key Requests:</span>
                <ul className="mt-1 ml-4 list-disc text-gray-600">
                  {summary.content.key_requests.map((request: string, index: number) => (
                    <li key={index}>{request}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clarifying Questions */}
            {summary.content.clarifying_questions.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Clarifying Questions:</span>
                <ul className="mt-1 ml-4 list-disc text-gray-600">
                  {summary.content.clarifying_questions.map((question: string, index: number) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Next Step */}
            <div>
              <span className="font-medium text-gray-700">Suggested Next Step:</span>
              <p className="text-gray-600 mt-1">{summary.content.suggested_next_step.step}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {aiSummaryMutation.isError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-800">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span>Failed to generate AI summary. Please try again.</span>
          <button
            onClick={() => aiSummaryMutation.reset()}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}