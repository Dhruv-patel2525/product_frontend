"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFeedbacks, addFeedback } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";

export default function ProductPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const org_id = params?.org_id as string;
  const product_id = params?.product_id as string;

  useEffect(() => {
    if (!org_id || !product_id) return;
    setFeedbacks(getFeedbacks(org_id, product_id));
  }, [org_id, product_id]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const newFb = addFeedback(org_id, product_id, title, description);
      setFeedbacks(fb => [...fb, newFb]);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-2 md:px-0">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Feedback Items</h2>
      {error && <ErrorAlert message={error} />}
      <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Feedback title" required className="border px-3 py-2 rounded w-full md:w-auto"/>
        <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" required className="border px-3 py-2 rounded w-full md:w-auto"/>
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-5 py-2 font-semibold" type="submit">Create</button>
      </form>
      <ul className="divide-y rounded border overflow-hidden bg-white shadow text-sm">
        {feedbacks.map((fb: any) => (
          <li key={fb.id} className="py-4 px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <b className="block text-base">{fb.title}</b>
              <span className="text-gray-500">{fb.description}</span>
            </div>
            <button className="text-blue-500 underline hover:text-blue-700 mx-1 mt-2 sm:mt-0" onClick={()=>router.push(`/orgs/${org_id}/products/${product_id}/feedback/${fb.id}`)}>Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
