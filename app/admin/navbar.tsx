"use client";
import { useAuthContext } from "@/context/auth/use-auth";

export default function Navbar() {
  const auth = useAuthContext();
  const { user } = auth;
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="text-gray-600">Welcome, {user?.fullName}</div>
    </nav>
  );
}
