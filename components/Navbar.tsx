"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  // Dummy always-auth for mock demo
  const isAuth = true;

  function handleLogout() {
    // For dummy, just go to login
    router.push("/login");
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 border-b">
      <div>
        <Link href="/dashboard" className="font-bold text-blue-600">ProductBoard</Link>
      </div>
      <div>
        {isAuth ? (
          <button className="btn btn-sm bg-red-400 text-white px-3 py-1 rounded" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="mr-3 text-blue-600">Login</Link>
            <Link href="/register" className="text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
