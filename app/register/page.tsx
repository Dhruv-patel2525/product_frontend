"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/ErrorAlert";
import { useRegisterMutation } from "@/lib/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // This is email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const registerMutation = useRegisterMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await registerMutation.mutateAsync({
        name,
        username, // This is the email
        password,
      });

      // Check for pending invitation token after successful registration
      const pendingToken = sessionStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        sessionStorage.removeItem('pendingInviteToken');
        router.push(`/invitations/accept?token=${pendingToken}`);
      } else {
        // On successful registration, redirect to login
        router.push("/login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-sm mx-auto p-6 md:p-8 border rounded-lg shadow bg-white dark:bg-gray-900">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Register</h1>
        {error && <ErrorAlert message={error} />}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Email"
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
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded transition-colors mt-2"
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <button className="text-blue-600 hover:underline" onClick={()=>router.push('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}
