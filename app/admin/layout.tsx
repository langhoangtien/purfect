import AuthGuard from "@/auth/auth-guard";
import AuthLayout from "../layouts/auth-layout";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout>
      <AuthGuard>{children}</AuthGuard>
    </AuthLayout>
  );
}
