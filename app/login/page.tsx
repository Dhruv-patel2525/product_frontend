"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/ErrorAlert";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      // For mock: skip API
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-sm mx-auto p-6 md:p-8 border rounded-lg shadow bg-white dark:bg-gray-900">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Login</h1>
        {error && <ErrorAlert message={error} />}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors mt-2">
            Log in
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Don&#39;t have an account? <button className="text-blue-600 hover:underline" onClick={()=>router.push('/register')}>Register</button>
        </div>
      </div>
    </div>
  );
}
