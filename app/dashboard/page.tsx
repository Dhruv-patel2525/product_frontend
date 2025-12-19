"use client";
import { useEffect, useState } from "react";
import { getOrgs, addOrg } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setOrgs(getOrgs());
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const newOrg = addOrg(name, email);
      setOrgs((o) => [...o, newOrg]);
      setName("");
      setEmail("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-2 md:px-0">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Your Organizations</h2>
      {error && <ErrorAlert message={error} />}
      <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Org name" required className="border px-3 py-2 rounded w-full md:w-auto"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Contact email" required className="border px-3 py-2 rounded w-full md:w-auto"/>
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-5 py-2 font-semibold" type="submit">Create</button>
      </form>
      <ul className="divide-y rounded border overflow-hidden bg-white shadow text-sm">
        {orgs.map((org: any) => (
          <li key={org.id} className="py-4 px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <b className="block text-base">{org.name}</b>
              <span className="text-gray-500">{org.email}</span>
            </div>
            <button className="text-blue-500 underline hover:text-blue-700 mx-1 mt-2 sm:mt-0" onClick={()=>router.push(`/orgs/${org.id}`)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
