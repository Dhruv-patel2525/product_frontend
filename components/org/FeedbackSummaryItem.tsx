"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { Feedback } from "@/lib/types/auth";

interface FeedbackSummaryItemProps {
  feedback: Feedback;
  onVote: (value: boolean) => void;
  isVoting: boolean;
}

export function FeedbackSummaryItem({ feedback, onVote, isVoting }: FeedbackSummaryItemProps) {
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
      </div>
    </div>
  );
}