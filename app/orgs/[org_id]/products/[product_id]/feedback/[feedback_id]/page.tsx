"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFeedbacks, getComments, addComment } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";

export default function FeedbackDetailPage() {
  const [feedback, setFeedback] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [voteCount, setVoteCount] = useState(0);
  const [error, setError] = useState("");
  const params = useParams();
  const org_id = params?.org_id as string;
  const product_id = params?.product_id as string;
  const feedback_id = params?.feedback_id as string;

  useEffect(() => {
    if (!(org_id && product_id && feedback_id)) return;
    const feedbacks = getFeedbacks(org_id, product_id);
    const found = feedbacks.find((fb: any) => fb.id == feedback_id);
    setFeedback(found);
    setComments(getComments());
    setVoteCount(found ? found.votes || 0 : 0);
  }, [org_id, product_id, feedback_id]);

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const newComment = addComment(comment);
      setComments(comments => [...comments, newComment]);
      setComment("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleVote() {
    setVoteCount(voteCount + 1);
  }

  return (
    <div className="max-w-2xl mx-auto min-h-[70vh] mt-8 px-2 md:px-0">
      {error && <ErrorAlert message={error} />}
      {feedback && (
        <div className="mb-5 p-4 border rounded bg-white dark:bg-gray-900 shadow">
          <h3 className="text-lg md:text-xl font-bold mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <span>{feedback.title}</span>
            <span className="ml-1 md:ml-6 text-xs font-normal text-gray-400">{feedback.status}</span>
          </h3>
          <p className="mb-3 text-gray-600">{feedback.description}</p>
          <button className="btn btn-sm bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 font-medium transition-colors" onClick={handleVote}>Upvote</button>
          <span className="ml-2 text-green-700 font-semibold">{voteCount}</span>
        </div>
      )}
      <div className="mb-8">
        <h4 className="font-bold mb-2">Comments</h4>
        <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2 mb-3">
          <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment" required className="border px-2 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"/>
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-5 py-2 font-semibold" type="submit">Send</button>
        </form>
        <ul className="divide-y">
          {comments.map((c: any) => (
            <li key={c.id} className="py-2 px-2 text-sm md:text-base bg-white first:rounded-t last:rounded-b last:border-0">
              {c.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
