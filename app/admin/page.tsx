"use client";

import { useAuthContext } from "@/context/auth/use-auth";

export default function Dashboard() {
  const auth = useAuthContext();
  const { user } = auth;
  return (
    <div>
      <h1>Admin2 {user ? user.email : "g"}</h1>
    </div>
  );
}
